# Nexa (Generative AI Assistant)

A full-stack, multimodal interactive agent web application designed for students, developers, and lifelong learners. Built for college AI Agent challenges, engineering coursework, career preparation, and everyday productivity.

---

## 🌟 Capabilities & Features

### 1. Text Generation & Concept Mentoring
- Powered by Google Gemini (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK.
- Answers complex questions across engineering, computer science, mathematics, coding, and general knowledge.
- Maintains multi-turn conversation memory within sessions for natural follow-up questions.

### 2. "Explain Simply" Mode (Feynman Technique)
- Toggleable at any time or triggered via one-click button under any response.
- Deconstructs opaque technical jargon into relatable everyday analogies, intuitive mental models, and step-by-step logic.

### 3. Personalized Study Plan Generator
- Interactive dialog where students specify subject, daily available study hours, duration (weeks), and target exam/goal.
- Produces a structured study schedule with milestones, high-yield practice topics, and self-assessment checkpoints.

### 4. Standout Software Project Recommender
- Tailored to student skill level, preferred tech stack, and career goals.
- Recommends 3 unique, non-trivial projects with architectural designs, MVP feature checklists, and resume bullet points.

### 5. Multimodal Document & Image Understanding
- Supports direct file uploads of:
  - **Images**: `.png`, `.jpg`, `.webp` (circuit diagrams, handwritten notes, UI designs, system architectures)
  - **Documents**: `.pdf` (exam papers, research papers, syllabus documents)
  - **Source Code & Data**: `.ts`, `.js`, `.py`, `.java`, `.cpp`, `.json`, `.csv`, `.md`, `.txt`
- Server securely streams these files as native inline parts to `gemini-3.8-flash`.

### 6. Image Generation & Limitation Transparency
- Includes a dedicated "Generate Image" mode with aspect ratio controls (`1:1`, `16:9`, `4:3`, `9:16`).
- **Genuinely Inspected Status**: Google AI Studio free tier enforces `limit: 0` on image generation models (`gemini-3.1-flash-lite-image`). When attempted without paid billing, the assistant honestly explains the policy quota limitation rather than generating fake images or failing silently.

---

## 🏗️ Architecture & Security

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Client                        │
│   React 19 + TypeScript + Tailwind CSS + Lucide Icons       │
│   - Session persistence (localStorage)                      │
│   - Markdown & Code syntax renderer with copy button        │
│   - File drag-and-drop & attachment previews                │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / Base64 Payloads
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Node.js Express Server                   │
│   - Endpoints:                                              │
│     * POST /api/chat (Multi-turn text & multimodal parts)   │
│     * POST /api/generate-image (Image model integration)    │
│     * GET  /api/status (Model health & capability inspection│
│   - Mounts Vite middlewares in dev mode on port 3000        │
└──────────────────────────────┬──────────────────────────────┘
                               │ User-Agent: 'aistudio-build'
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Google Gemini API                      │
│   - gemini-3.8-flash (Text, Code, Vision, Multimodal)       │
│   - gemini-3.1-flash-lite-image (Image generation)          │
└─────────────────────────────────────────────────────────────┘
```

### Security & Secret Protection
- **No secrets in client**: `process.env.GEMINI_API_KEY` is exclusively consumed inside `server.ts`.
- The frontend has zero access to the raw key, preventing credential leakage.
- No third-party file storage needed: attachments are safely streamed directly to the Gemini API.

---

## 📋 System Instruction Specification

The assistant operates under a structured system instruction:
1. **Accurate & Clear**: Delivers rigorous, practical technical answers with formatted code snippets.
2. **Clarifying Questions**: When user queries are ambiguous or missing key requirements, asks focused follow-up questions instead of guessing blindly.
3. **Intellectual Honesty**: Never claims to have executed actions it has not performed (e.g. live internet search or remote terminal execution).
4. **Beginner-Friendly Pedagogic Style**: Patient, encouraging, and structured.

---

## 🧪 How to Test Each Feature

1. **General Chat**: Ask *"Compare PostgreSQL vs MongoDB for high-write IoT sensor workloads."*
2. **Explain Simply**: Toggle "Explain Simply" to ON and ask *"How does Raft consensus work?"*
3. **Study Planner**: Click "Generate Study Plan" in the navbar, enter your subject and hours, and click generate.
4. **Project Recommender**: Click "Project Recommender" in the sidebar, pick your preferred tech stack, and generate standout ideas.
5. **Document / Code Analysis**: Click the paperclip icon, attach a `.py` or `.ts` file, and ask *"Review this code for edge cases."*
6. **Follow-Up Context**: Ask *"Can you rewrite that solution using an iterative approach instead of recursion?"*
7. **Image Generation**: Switch to "Generate Image" mode, input a prompt, and observe the limitation handling report.
8. **Export Conversation**: Click "Export" in the sidebar to download your full chat as a `.md` markdown file.
