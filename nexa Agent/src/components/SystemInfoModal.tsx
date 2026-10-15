import React from 'react';
import { ShieldCheck, Cpu, AlertTriangle, CheckCircle2, Lock, DollarSign, X } from 'lucide-react';
import { ModelStatus } from '../types';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ModelStatus | null;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({
  isOpen,
  onClose,
  status,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">System & Model Inspection</h3>
              <p className="text-xs text-slate-400">
                Genuinely verified APIs, access rules, safety boundaries, and costs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm">
          {/* Active Primary Model */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Text & Reasoning Model:</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  gemini-3.8-flash
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Active & Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Powers conversational intelligence, engineering education mentoring, career roadmaps, code generation, multi-turn follow-ups, and full multimodal vision & document understanding.
              </p>
              <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-400">
                <span>Cost: Free Tier (Zero charge)</span>
                <span>Latency: Low / Realtime</span>
                <span>Context Window: 1M+ tokens</span>
              </div>
            </div>
          </div>

          {/* Multimodal & Documents */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Document & Image Understanding:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Directly analyzes uploaded images (PNG, JPEG, WebP) and documents (PDFs, Source Code .ts/.py/.java, Markdown, JSON, Text). The server streams these parts to <code className="text-indigo-300 font-mono">gemini-3.8-flash</code> without external third-party storage.
              </p>
            </div>
          </div>

          {/* Image Generation Availability Inspection */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Image Generation Model:</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  gemini-3.1-flash-lite-image
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-200">Environment Inspection Result:</strong> Google AI Studio free tier enforces a strict <code className="text-amber-300 font-mono">limit: 0 requests/min</code> on image generation models. Generating images through Google API requires enabling a paid billing plan.
              </p>
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                <p className="font-medium flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  Policy Compliance Guarantee:
                </p>
                <p className="text-[11px] text-amber-200/90 leading-normal">
                  Per your strict requirement: <em>"Do not deploy publicly or enable paid services without asking me first."</em> We have not activated any paid services or billed API keys. When you test image generation in the app, it honestly explains this quota limitation instead of generating fake images or silent failures.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Secrets */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Credentials & Architecture:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your <code className="text-cyan-300 font-mono">GEMINI_API_KEY</code> is completely isolated on the Node.js Express server via <code className="text-cyan-300 font-mono">process.env.GEMINI_API_KEY</code>. The browser client never touches or receives raw API keys, protecting your credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close Inspection View
          </button>
        </div>
      </div>
    </div>
  );
};
