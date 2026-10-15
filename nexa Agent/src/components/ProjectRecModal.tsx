import React, { useState } from 'react';
import { Code2, Layers, Rocket, Star, Sparkles, X } from 'lucide-react';

interface ProjectRecModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPrompt: (promptText: string) => void;
}

export const ProjectRecModal: React.FC<ProjectRecModalProps> = ({
  isOpen,
  onClose,
  onSubmitPrompt,
}) => {
  const [domain, setDomain] = useState('Full-Stack Web Application');
  const [techStack, setTechStack] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [skillLevel, setSkillLevel] = useState('Intermediate Engineering Student');
  const [goal, setGoal] = useState('Stand out to recruiters for Software Engineer internship/job');
  const [interestArea, setInterestArea] = useState('Real-time collaboration, developer tools, or fintech');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = `Recommend 3 unique, high-impact programming projects for me with the following criteria:
- Target Domain: ${domain}
- Preferred Tech Stack / Languages: ${techStack}
- My Experience Level: ${skillLevel}
- Primary Objective: ${goal}
- Personal Interests: ${interestArea}

Avoid cliché projects like basic Todo lists or standard weather apps.
For EACH of the 3 recommended projects, please provide:
1. Project Title & Problem Statement
2. Unique Hook / Differentiator (what makes this stand out)
3. High-Level Architecture & Recommended Tech Stack
4. Core MVP Features to build first
5. Advanced stretch features for extra resume value
6. High-Impact Resume Bullet Point (with metrics placeholder)`;

    onSubmitPrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Project Recommender</h3>
              <p className="text-xs text-slate-400">
                Discover standout software projects tailored to your tech stack & career goals
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Target Project Domain
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="Full-Stack Web Application">Full-Stack Web Application</option>
              <option value="AI / LLM Agent & Applied Machine Learning">AI / LLM Agent & Applied ML</option>
              <option value="Backend Systems & Distributed Microservices">Backend Systems & Distributed Services</option>
              <option value="DevOps & Cloud Infrastructure Tooling">DevOps & Cloud Infrastructure Tooling</option>
              <option value="Mobile App (React Native / Flutter / Android)">Mobile App Development</option>
              <option value="Cybersecurity & Network Security Tools">Cybersecurity & Networking Tools</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Preferred Tech Stack & Languages
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
              placeholder="e.g. React, Python, FastAPI, Docker, PostgreSQL"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Experience Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="Beginner Student (1st/2nd Year)">Beginner Student (1st/2nd Year)</option>
                <option value="Intermediate Engineering Student">Intermediate Student (3rd Year)</option>
                <option value="Advanced / Final Year Capstone">Advanced / Final Year Capstone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-emerald-400" />
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="Stand out to recruiters for Software Engineer internship/job">
                  Stand out to recruiters / Resume piece
                </option>
                <option value="Win a college hackathon or AI competition">
                  Hackathon Winner
                </option>
                <option value="Learn production-grade backend and architectural patterns">
                  Learn Production Architecture
                </option>
                <option value="Build a SaaS MVP for real users">
                  Launch a real SaaS MVP
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Personal Interests or Domains of Curiosity
            </label>
            <input
              type="text"
              value={interestArea}
              onChange={(e) => setInterestArea(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
              placeholder="e.g. EdTech, Gaming, Health, Productivity, Cryptography"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Recommend Standout Projects
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
