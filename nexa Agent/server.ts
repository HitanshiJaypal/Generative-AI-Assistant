import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase payload limits for image and document uploads (base64)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Ensure the SDK targets Gemini Developer API (generativelanguage.googleapis.com)
// rather than Vertex AI (which rejects API keys with OAuth2 requirement errors)
delete process.env.GOOGLE_GENAI_USE_VERTEXAI;
delete process.env.GOOGLE_GENAI_USE_ENTERPRISE;

// Initialize GoogleGenAI SDK with required headers and explicit vertexai: false
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: false,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Lightweight health check endpoint for deployment container liveness probes
app.get(['/healthz', '/api/health'], (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

const DEFAULT_SYSTEM_INSTRUCTION = `You are "Nexa", a highly capable, supportive, and intellectually honest AI agent.
Your mission is to help users learn, create, solve problems, explore careers, and get everyday help.

Core Personas & Suggested Categories:
1. Education Mentor: Help engineering students, beginners, and lifelong learners understand complex technical concepts (CS, algorithms, system design, math, hardware, software engineering). Break down tough topics clearly.
2. Career Guide: Provide strategic guidance for tech and professional careers, resume optimization, portfolio review, technical and behavioral interview preparation, and skill roadmaps.
3. General Help & Everyday Productivity: Assist with writing, creative brainstorming, document synthesis, coding, debugging, and productivity workflows.

Key Guidelines:
- Accuracy & Depth: Provide well-structured, technically accurate responses. Include code snippets, bullet points, and step-by-step breakdowns where beneficial.
- Clarifying Questions: When a user's prompt is underspecified (e.g., asking for a study plan without mentioning timeline, or interview prep without stating role/experience), provide a foundational answer and ask 1-2 focused clarifying questions to tailor further advice.
- "Explain Simply" Mode: When the user requests a simple explanation or when Explain Simply is active, explain as if talking to an eager beginner (Feynman technique). Use relatable analogies, visual mental models, and eliminate unnecessary jargon without losing technical truth.
- Personalized Study Plans: Provide clear milestones, daily/weekly breakdowns, recommended hands-on practice, and verification checkpoints.
- Project Recommendations: Offer modern, portfolio-worthy projects with architecture designs, tech stacks, step-by-step phases, and high-impact resume bullet points.
- Honesty & Boundaries: Be completely honest about uncertainty. Never claim to have accessed private databases, live internet browsers, or executed physical actions unless supported. Acknowledge limitations gracefully.`;

interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64 string without header
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

// System status and capability check
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'online',
    appName: 'Nexa',
    hasApiKey: hasKey,
    activeTextModel: 'gemini-3.8-flash',
    imageModel: 'gemini-3.1-flash-lite-image',
    capabilities: {
      textGeneration: true,
      multimodalUnderstanding: true,
      documentAnalysis: true,
      imageAnalysis: true,
      studyPlanner: true,
      careerGuide: true,
      explainSimply: true,
      imageGeneration: 'requires_paid_plan', // Inspected and identified limit: 0 on free tier
    },
    message: 'System active. Multimodal text & document understanding powered by gemini-3.8-flash.',
  });
});

// Chat endpoint with multi-turn history & multimodal attachments
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      prompt,
      mode = 'general',
      explainSimply = false,
      attachments = [],
    }: {
      messages: ChatMessage[];
      prompt: string;
      mode?: string;
      explainSimply?: boolean;
      attachments?: Attachment[];
    } = req.body;

    if (!prompt && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: 'Prompt or attachment is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
      });
    }

    // Build specialized instruction additions based on mode
    let customInstruction = DEFAULT_SYSTEM_INSTRUCTION;
    if (mode === 'education') {
      customInstruction += `\n[Focus: Education Mentor]. Emphasize pedagogy, intuitive mental models, practical code demonstrations, and progressive problem-solving.`;
    } else if (mode === 'career') {
      customInstruction += `\n[Focus: Career Guide]. Emphasize industry standards, hiring manager expectations, actionable career roadmaps, and interview best practices.`;
    }

    if (explainSimply) {
      customInstruction += `\n[Directive: EXPLAIN SIMPLY ACTIVE]. Break this topic down using vivid everyday analogies, plain language, and step-by-step logic so anyone can grasp it immediately. Avoid intimidating jargon.`;
    }

    // Convert chat history to Gemini contents format
    const contents: any[] = [];

    // Add prior message turns
    for (const msg of messages) {
      const parts: any[] = [];

      if (msg.attachments && Array.isArray(msg.attachments)) {
        for (const att of msg.attachments) {
          if (
            att.mimeType.startsWith('image/') ||
            att.mimeType === 'application/pdf'
          ) {
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: att.data,
              },
            });
          } else {
            // Text, markdown, code, csv, json files
            try {
              const textContent = Buffer.from(att.data, 'base64').toString('utf-8');
              parts.push({
                text: `[Attached File: ${att.name}]\n\`\`\`\n${textContent}\n\`\`\``,
              });
            } catch {
              parts.push({ text: `[Attached File: ${att.name}] (Binary content)` });
            }
          }
        }
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      if (parts.length > 0) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts,
        });
      }
    }

    // Add current user turn
    const currentParts: any[] = [];
    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (
          att.mimeType.startsWith('image/') ||
          att.mimeType === 'application/pdf'
        ) {
          currentParts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: att.data,
            },
          });
        } else {
          try {
            const textContent = Buffer.from(att.data, 'base64').toString('utf-8');
            currentParts.push({
              text: `[Attached File: ${att.name}]\n\`\`\`\n${textContent}\n\`\`\``,
            });
          } catch {
            currentParts.push({ text: `[Attached File: ${att.name}]` });
          }
        }
      }
    }

    if (prompt) {
      currentParts.push({ text: prompt });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    let response;
    const callModel = (modelName: string) =>
      ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: customInstruction,
          temperature: 0.7,
        },
      });

    try {
      // Race gemini-3.8-flash with a 5-second timeout against capacity spikes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('HIGH_DEMAND_TIMEOUT')), 5000)
      );
      response = (await Promise.race([callModel('gemini-3.8-flash'), timeoutPromise])) as any;
    } catch (primaryErr: any) {
      console.warn('Primary model delayed or errored, activating resilient fallback:', primaryErr?.message);
      // Seamlessly fall back to gemini-3.1-flash-lite
      response = await callModel('gemini-3.1-flash-lite');
    }

    const replyText = response.text || 'I received your request, but no text output was produced.';
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error?.message || 'An unexpected error occurred while communicating with Gemini.',
    });
  }
});

// Image Generation Endpoint
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1' }: { prompt: string; aspectRatio?: string } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    // Attempt generation with gemini-3.1-flash-lite-image
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        return res.json({
          success: true,
          imageUrl,
          prompt,
          model: 'gemini-3.1-flash-lite-image',
        });
      } else {
        return res.json({
          success: false,
          isLimitation: true,
          error: 'The image generation model did not return image data for this prompt.',
        });
      }
    } catch (modelErr: any) {
      const errMsg = modelErr?.message || '';
      const isQuotaOrPaid =
        modelErr?.status === 429 ||
        errMsg.includes('quota') ||
        errMsg.includes('billing') ||
        errMsg.includes('free_tier') ||
        errMsg.includes('limit: 0');

      return res.json({
        success: false,
        isLimitation: true,
        quotaExceeded: isQuotaOrPaid,
        error: isQuotaOrPaid
          ? 'Image generation requires a Google AI Studio account with an enabled paid tier/billing plan (quota limit on free tier for gemini-3.1-flash-lite-image is 0). Because paid services are not enabled without your approval, image generation cannot be completed at this time. All other text, coding, career, and multimodal document analysis features are completely operational and free!'
          : `Image generation unavailable: ${errMsg}`,
      });
    }
  } catch (error: any) {
    console.error('Error in /api/generate-image:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Server error while processing image request.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
