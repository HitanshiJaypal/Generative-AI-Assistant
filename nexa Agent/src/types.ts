export type AssistantMode = 'general' | 'education' | 'career' | 'image_gen' | 'file_analysis';

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64 string without data prefix
  size?: number;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode?: AssistantMode;
  explainSimply?: boolean;
  attachments?: Attachment[];
  generatedImage?: {
    url: string;
    prompt: string;
  };
  isLimitation?: boolean;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  mode: AssistantMode;
  messages: ChatMessage[];
}

export interface ModelStatus {
  status: string;
  appName: string;
  hasApiKey: boolean;
  activeTextModel: string;
  imageModel: string;
  capabilities: {
    textGeneration: boolean;
    multimodalUnderstanding: boolean;
    documentAnalysis: boolean;
    imageAnalysis: boolean;
    studyPlanner: boolean;
    careerGuide: boolean;
    explainSimply: boolean;
    imageGeneration: string;
  };
  message: string;
}
