import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Helper to parse inline styles (bold, italic, code)
  const renderInlineFormatted = (text: string): React.ReactNode => {
    // Regex splits by backticks, bold, italic
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-slate-800 text-indigo-300 rounded border border-slate-700/60 font-medium"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={i} className="font-semibold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={i} className="italic text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  // Split content by code blocks vs regular text
  const blocks = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let codeBlockCounter = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }
    blocks.push({
      type: 'code',
      language: match[1] || 'code',
      code: match[2].trim(),
      id: codeBlockCounter++,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    blocks.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return (
    <div className="space-y-3 leading-relaxed text-slate-200 text-sm sm:text-base">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return (
            <div
              key={idx}
              className="my-3 rounded-xl overflow-hidden border border-slate-700/70 bg-slate-900/95 shadow-md"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-indigo-400">
                  {block.language}
                </span>
                <button
                  onClick={() => handleCopyCode(block.code!, block.id!)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors duration-150 cursor-pointer"
                  title="Copy code"
                >
                  {copiedIndex === block.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-sans font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-sans">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300/90 leading-normal selection:bg-indigo-600/50">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Render text lines with headings, lists, quotes
        const lines = (block.content || '').split('\n');
        return (
          <div key={idx} className="space-y-2">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              // Headings
              if (trimmed.startsWith('#### ')) {
                return (
                  <h5 key={lineIdx} className="text-sm font-bold text-indigo-300 pt-2">
                    {renderInlineFormatted(trimmed.slice(5))}
                  </h5>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lineIdx} className="text-base font-bold text-slate-100 pt-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block"></span>
                    {renderInlineFormatted(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lineIdx} className="text-lg font-bold text-white pt-3 pb-1 border-b border-slate-800">
                    {renderInlineFormatted(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={lineIdx} className="text-xl font-extrabold text-white pt-3 pb-1 text-indigo-200">
                    {renderInlineFormatted(trimmed.slice(2))}
                  </h2>
                );
              }

              // Blockquote
              if (trimmed.startsWith('> ')) {
                return (
                  <div
                    key={lineIdx}
                    className="border-l-4 border-indigo-500 pl-3 py-1 my-1.5 bg-indigo-950/20 rounded-r-lg text-slate-300 italic text-sm"
                  >
                    {renderInlineFormatted(trimmed.slice(2))}
                  </div>
                );
              }

              // Unordered list
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 ml-2 my-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                    <span className="flex-1">{renderInlineFormatted(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 ml-2 my-0.5">
                    <span className="text-xs font-bold text-indigo-400 font-mono mt-0.5 w-4 shrink-0">
                      {numMatch[1]}.
                    </span>
                    <span className="flex-1">{renderInlineFormatted(numMatch[2])}</span>
                  </div>
                );
              }

              // Normal paragraph
              return (
                <p key={lineIdx} className="text-slate-200">
                  {renderInlineFormatted(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
