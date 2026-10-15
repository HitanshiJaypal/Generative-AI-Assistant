import React from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Calendar,
  Rocket,
  ShieldCheck,
  HelpCircle,
  Download,
  X,
  Sparkles,
} from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onNewChat: () => void;
  onOpenStudyModal: () => void;
  onOpenProjectModal: () => void;
  onOpenSystemInfo: () => void;
  onOpenTestingGuide: () => void;
  onExportChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  onOpenStudyModal,
  onOpenProjectModal,
  onOpenSystemInfo,
  onOpenTestingGuide,
  onExportChat,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 flex flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 ml-2 rounded-lg text-slate-400 hover:text-white md:hidden transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Agent Actions */}
        <div className="p-3 border-b border-slate-800 space-y-1.5">
          <span className="px-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Agent Accelerators
          </span>
          <button
            onClick={() => {
              onOpenStudyModal();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span>Study Plan Generator</span>
          </button>

          <button
            onClick={() => {
              onOpenProjectModal();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <span>Project Recommender</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Chat History ({sessions.length})
            </span>
            {sessions.length > 0 && (
              <button
                onClick={onExportChat}
                className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition cursor-pointer"
                title="Download current chat transcript"
              >
                <Download className="w-3 h-3" />
                Export
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No previous chats saved yet. Start typing to create one!
            </div>
          ) : (
            sessions.map((sess) => {
              const isActive = sess.id === currentSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    onSelectSession(sess.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-indigo-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{sess.title || 'Untitled Conversation'}</span>
                  </div>
                  <button
                    onClick={(e) => onDeleteSession(sess.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Model:
              </span>
              <span className="font-mono text-emerald-400">gemini-3.8-flash</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Free Tier active. Keys isolated in Node.js backend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onOpenTestingGuide();
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Testing</span>
            </button>
            <button
              onClick={() => {
                onOpenSystemInfo();
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Specs</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
