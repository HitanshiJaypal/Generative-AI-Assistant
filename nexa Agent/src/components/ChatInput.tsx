import React, { useRef, useState, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  FileCode,
  X,
  Zap,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AssistantMode, Attachment } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, attachments: Attachment[], aspectRatio?: string) => void;
  isLoading: boolean;
  currentMode: AssistantMode;
  explainSimply: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  currentMode,
  explainSimply,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [fileError, setFileError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    onSendMessage(
      input.trim(),
      attachments,
      currentMode === 'image_gen' ? aspectRatio : undefined
    );
    setInput('');
    setAttachments([]);
    setFileError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFiles = (fileList: File[]) => {
    setFileError(null);
    for (const file of fileList) {
      // 20MB limit
      if (file.size > 20 * 1024 * 1024) {
        setFileError(`File "${file.name}" exceeds the 20MB limit.`);
        continue;
      }

      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Strip data:mime/type;base64, prefix
        const base64Data = result.split(',')[1] || '';

        const newAttachment: Attachment = {
          name: file.name,
          mimeType: file.type || 'text/plain',
          data: base64Data,
          size: file.size,
          previewUrl: isImg ? result : undefined,
        };

        setAttachments((prev) => [...prev, newAttachment]);
      };

      if (isImg || isPdf) {
        reader.readAsDataURL(file);
      } else {
        // Text or code file
        reader.readAsDataURL(file);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getPlaceholder = () => {
    if (currentMode === 'image_gen') {
      return 'Describe the image you want to generate (e.g., "A modern AI engineering lab with holographic displays, cinematic lighting")...';
    }
    if (currentMode === 'education') {
      return 'Ask any engineering or CS concept, homework problem, algorithm, or math formula...';
    }
    if (currentMode === 'career') {
      return 'Ask for software engineering career roadmaps, resume tips, or mock interview questions...';
    }
    if (currentMode === 'file_analysis') {
      return 'Attach a code file, diagram screenshot, or PDF and ask questions about it...';
    }
    return 'Ask me anything — learn, create, solve problems, explore careers, or get everyday help...';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4">
      {/* Active mode & status pill banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          {currentMode === 'image_gen' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/15 text-pink-300 font-semibold border border-pink-500/30">
              <Sparkles className="w-3 h-3 text-pink-400" />
              Image Generation Mode
            </span>
          ) : currentMode === 'education' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
              Education Mentor Mode
            </span>
          ) : currentMode === 'career' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
              Career Guide Mode
            </span>
          ) : currentMode === 'file_analysis' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/30">
              Document & Code Analysis Mode
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
              All-in-One General Assistant
            </span>
          )}

          {explainSimply && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 animate-pulse">
              <Zap className="w-3 h-3 fill-amber-300" />
              Explain Simply Active
            </span>
          )}
        </div>

        {/* Aspect Ratio controls if in Image Mode */}
        {currentMode === 'image_gen' && (
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <span className="px-2 text-[10px] text-slate-400 uppercase font-mono">Aspect:</span>
            {['1:1', '16:9', '4:3', '9:16'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition ${
                  aspectRatio === ratio
                    ? 'bg-pink-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main input container */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border-b border-slate-800 bg-slate-950/40 rounded-t-2xl">
            {attachments.map((att, index) => {
              const isImg = att.mimeType.startsWith('image/');
              const isPdf = att.mimeType === 'application/pdf';
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 animate-fade-in"
                >
                  {isImg && att.previewUrl ? (
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded object-cover border border-slate-600"
                    />
                  ) : isPdf ? (
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                  ) : isImg ? (
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span className="max-w-[140px] truncate font-medium">{att.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="p-0.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* File Error Notice */}
        {fileError && (
          <div className="px-4 py-1.5 text-xs text-rose-300 bg-rose-950/40 border-b border-rose-900/50">
            {fileError}
          </div>
        )}

        {/* Text Input Row */}
        <div className="flex items-end gap-2 p-3">
          {/* File Upload Trigger */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.ts,.js,.py,.java,.cpp,.c,.html,.css,.json,.csv,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer shrink-0"
            title="Attach images, PDFs, code files, or documents"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Auto-growing Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="w-full max-h-48 py-2 px-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none resize-none leading-relaxed"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className={`p-2.5 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
              (!input.trim() && attachments.length === 0) || isLoading
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
            title="Send message (Enter)"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-slate-500">
        <span>Enter to send • Shift + Enter for new line</span>
        <span>Multimodal • Supports Images, PDFs & Code</span>
      </div>
    </div>
  );
};
