import React from 'react';
import {
  BookOpen,
  Briefcase,
  Sparkles,
  Rocket,
  Calendar,
  Image as ImageIcon,
  FileCode,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { AssistantMode } from '../types';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string, mode?: AssistantMode, explainSimply?: boolean) => void;
  onOpenStudyModal: () => void;
  onOpenProjectModal: () => void;
  onSelectMode: (mode: AssistantMode) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectPrompt,
  onOpenStudyModal,
  onOpenProjectModal,
  onSelectMode,
}) => {
  const exampleCategories = [
    {
      title: 'Education & Concept Clarity',
      icon: BookOpen,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
      prompts: [
        {
          label: 'Explain Dijkstra Algorithm simply',
          text: 'Explain Dijkstra\'s Shortest Path Algorithm step-by-step using an intuitive real-world analogy (like road trips or GPS) and show simple pseudocode.',
          mode: 'education' as AssistantMode,
          explainSimply: true,
        },
        {
          label: 'How Database Indexing & B-Trees work',
          text: 'How does database indexing work under the hood? Explain B-Trees vs Hash Indexes and why indexes make queries fast but writes slower.',
          mode: 'education' as AssistantMode,
          explainSimply: false,
        },
        {
          label: 'Compare TCP vs UDP with streaming',
          text: 'Compare TCP vs UDP in computer networks. Why does multiplayer gaming or live video streaming use UDP while web downloads use TCP?',
          mode: 'education' as AssistantMode,
          explainSimply: false,
        },
      ],
    },
    {
      title: 'Career & Tech Roadmaps',
      icon: Briefcase,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      prompts: [
        {
          label: '3-Month Software Engineer Roadmap',
          text: 'Provide a structured 3-month preparation roadmap for an engineering student targeting junior software engineering / campus placement interviews.',
          mode: 'career' as AssistantMode,
          explainSimply: false,
        },
        {
          label: 'Mock Behavioral Interview Questions',
          text: 'Conduct a mock behavioral interview for a junior software engineer role using the STAR method. Ask me the first question and wait for my response.',
          mode: 'career' as AssistantMode,
          explainSimply: false,
        },
        {
          label: 'How to make a standout GitHub portfolio',
          text: 'What do tech recruiters and engineering managers look for in a candidate\'s GitHub profile and personal projects? Give actionable tips.',
          mode: 'career' as AssistantMode,
          explainSimply: false,
        },
      ],
    },
    {
      title: 'Creation, Projects & Brainstorming',
      icon: Rocket,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      prompts: [
        {
          label: 'Recommend 3 Standout Portfolio Projects',
          text: 'Recommend 3 unique, resume-worthy programming projects in TypeScript/Python that solve real problems (avoid basic todo or weather apps).',
          mode: 'general' as AssistantMode,
          explainSimply: false,
        },
        {
          label: 'Design a Real-Time Collaborative Canvas',
          text: 'How would you architect a real-time collaborative whiteboard app (like Excalidraw or Miro)? Detail the frontend canvas, WebSockets, and state sync.',
          mode: 'education' as AssistantMode,
          explainSimply: false,
        },
        {
          label: 'Brainstorm 5 AI Agent Hackathon ideas',
          text: 'Brainstorm 5 innovative, technically feasible ideas for an AI agent hackathon focusing on student productivity or developer workflows.',
          mode: 'general' as AssistantMode,
          explainSimply: false,
        },
      ],
    },
    {
      title: 'Multimodal & Image Generation',
      icon: ImageIcon,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 border-pink-500/30',
      prompts: [
        {
          label: 'Generate: Cyberpunk AI Research Lab',
          text: 'A clean, futuristic engineering lab with holographic schematics and amber desk lighting, cinematic 8k render',
          mode: 'image_gen' as AssistantMode,
          explainSimply: false,
        },
        {
          label: 'Generate: 3D Isometric Robot Builder',
          text: 'An isometric 3D render of an engineer programming a friendly glowing desktop robot, soft pastel lighting, octane render',
          mode: 'image_gen' as AssistantMode,
          explainSimply: false,
        },
        {
          label: 'Analyze: Upload Code, PDF, or Diagram',
          text: 'I want to upload a code snippet or architecture diagram for line-by-line review, edge cases, and optimization advice.',
          mode: 'file_analysis' as AssistantMode,
          explainSimply: false,
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Hero Title Section */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Agent Powered by Google Gemini</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Ask me anything — learn, create, solve problems, explore careers, or get everyday help.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Your personal engineering mentor, career strategist, and creative AI partner. Education, career guidance, and general problem solving are suggested starting points, not boundaries.
        </p>

        {/* Primary Interactive Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onOpenStudyModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Generate Study Plan</span>
          </button>

          <button
            onClick={onOpenProjectModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Recommend Standout Projects</span>
          </button>

          <button
            onClick={() => onSelectMode('image_gen')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30 text-xs font-semibold transition cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Generate Image Mode</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exampleCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg ${cat.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {cat.title}
                </h3>
              </div>

              <div className="space-y-2">
                {cat.prompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => onSelectPrompt(p.text, p.mode, p.explainSimply)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/90 border border-slate-800/60 hover:border-indigo-500/40 transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-200 group-hover:text-indigo-300">
                        <span>{p.label}</span>
                        {p.explainSimply && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-500/10 px-1 rounded">
                            <Zap className="w-2.5 h-2.5 fill-amber-400" />
                            Simple
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
