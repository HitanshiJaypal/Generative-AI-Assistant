import React from 'react';
import {
  Sparkles,
  BookOpen,
  Briefcase,
  Image as ImageIcon,
  FileSearch,
  MessageSquare,
  HelpCircle,
  PlusCircle,
  Menu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AssistantMode } from '../types';

interface NavbarProps {
  currentMode: AssistantMode;
  onSelectMode: (mode: AssistantMode) => void;
  explainSimply: boolean;
  onToggleExplainSimply: () => void;
  onNewChat: () => void;
  onOpenSystemInfo: () => void;
  onOpenTestingGuide: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  explainSimply,
  onToggleExplainSimply,
  onNewChat,
  onOpenSystemInfo,
  onOpenTestingGuide,
  onToggleSidebar,
}) => {
  const modes: { id: AssistantMode; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'All-in-One Chat', icon: MessageSquare },
    { id: 'education', label: 'Education Mentor', icon: BookOpen },
    { id: 'career', label: 'Career Guide', icon: Briefcase },
    { id: 'image_gen', label: 'Generate Image', icon: ImageIcon },
    { id: 'file_analysis', label: 'File Analysis', icon: FileSearch },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5">
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition cursor-pointer"
            aria-label="Toggle history menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Nexa
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Learn, create, solve problems & explore careers
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher (Desktop) */}
        <div className="hidden lg:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Explain Simply Toggle */}
          <button
            onClick={onToggleExplainSimply}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
              explainSimply
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="When active, AI simplifies complex concepts using everyday analogies"
          >
            <Zap className={`w-3.5 h-3.5 ${explainSimply ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">Explain Simply</span>
            <span className={`text-[10px] px-1 rounded ${explainSimply ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-500'}`}>
              {explainSimply ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Testing Guide */}
          <button
            onClick={onOpenTestingGuide}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-950/40 hover:text-indigo-200 transition cursor-pointer"
            title="How to test every feature in this app"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Testing Guide</span>
          </button>

          {/* System Specs */}
          <button
            onClick={onOpenSystemInfo}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Inspect active models, costs, and API status"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 sm:hidden" />
            <span className="hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              API Specs
            </span>
          </button>

          {/* New Chat */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            title="Start a fresh conversation"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Row */}
      <div className="flex lg:hidden overflow-x-auto px-3.5 py-2 border-t border-slate-900 gap-1.5 no-scrollbar">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shrink-0 font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
