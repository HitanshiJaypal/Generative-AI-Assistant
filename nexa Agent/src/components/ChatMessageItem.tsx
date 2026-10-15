import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  Zap,
  Download,
  AlertTriangle,
  FileText,
  FileCode,
  Image as ImageIcon,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSendFollowUp: (prompt: string) => void;
  onOpenSystemInfo: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSendFollowUp,
  onOpenSystemInfo,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = (url: string, filename = 'generated-gemini-image.png') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={`py-5 px-3 sm:px-6 transition-colors duration-150 ${
        isUser ? 'bg-slate-950/40' : 'bg-slate-900/60 border-y border-slate-800/40'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Content Body */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header row: Author + Tag + Timestamp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {isUser ? 'You' : 'Nexa'}
              </span>
              {!isUser && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 font-mono border border-indigo-500/30">
                  gemini-3.8-flash
                </span>
              )}
              {message.explainSimply && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-amber-300" />
                  Explained Simply
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* User Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {message.attachments.map((att, i) => {
                const isImg = att.mimeType.startsWith('image/');
                const isPdf = att.mimeType === 'application/pdf';
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-200"
                  >
                    {isImg ? (
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    ) : isPdf ? (
                      <FileText className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span className="font-medium truncate max-w-[160px]">{att.name}</span>
                    {isImg && att.data && (
                      <img
                        src={`data:${att.mimeType};base64,${att.data}`}
                        alt={att.name}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded object-cover ml-1 border border-slate-600"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Generated Image Output if any */}
          {message.generatedImage && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-3 max-w-md space-y-2">
              <div className="relative group rounded-xl overflow-hidden cursor-pointer">
                <img
                  src={message.generatedImage.url}
                  alt={message.generatedImage.prompt}
                  referrerPolicy="no-referrer"
                  onClick={() => setImageModalUrl(message.generatedImage!.url)}
                  className="w-full h-auto object-cover rounded-xl transition group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <span className="text-xs text-white bg-black/60 px-2.5 py-1 rounded-lg">
                    Click to enlarge
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <p className="text-slate-400 italic truncate max-w-[280px]">
                  &quot;{message.generatedImage.prompt}&quot;
                </p>
                <button
                  onClick={() => downloadImage(message.generatedImage!.url)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Limitation Warning (e.g. Free Tier Quota limit: 0 for image model) */}
          {message.isLimitation && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Feature Limitation & Policy Status</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {message.content}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={onOpenSystemInfo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/40 transition cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  View API Inspection Details
                </button>
                <button
                  onClick={() =>
                    onSendFollowUp(
                      'Explain the visual concept described in the prompt in detail with architectural diagrams and text-based layouts.'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                >
                  Explain Concept as Text/Diagram Instead
                </button>
              </div>
            </div>
          )}

          {/* Main Message Text (Markdown) */}
          {!message.isLimitation && message.content && (
            <MarkdownRenderer content={message.content} />
          )}

          {/* Error Message */}
          {message.error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 space-y-1">
              <p className="font-semibold">Request Error:</p>
              <p>{message.error}</p>
            </div>
          )}

          {/* Assistant Action Toolbar & Follow-up Prompt Accelerators */}
          {!isUser && !message.error && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
                title="Copy entire response"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {!message.explainSimply && (
                <button
                  onClick={() =>
                    onSendFollowUp(
                      'Can you explain this simpler using an everyday analogy and simpler terms?'
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30 transition cursor-pointer"
                  title="Request an even simpler explanation with everyday analogies"
                >
                  <Zap className="w-3 h-3" />
                  <span>Explain Simpler</span>
                </button>
              )}

              <button
                onClick={() =>
                  onSendFollowUp(
                    'Could you give a concrete, production-grade code example illustrating this with commentary?'
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30 transition cursor-pointer"
              >
                <Code2 className="w-3 h-3" />
                <span>Code Example</span>
              </button>

              <button
                onClick={() =>
                  onSendFollowUp(
                    'What are common pitfalls, edge cases, and best practices to keep in mind for this?'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
              >
                <span>Edge Cases & Pitfalls</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full Image View */}
      {imageModalUrl && (
        <div
          onClick={() => setImageModalUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
        >
          <img
            src={imageModalUrl}
            alt="Generated Preview"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};
