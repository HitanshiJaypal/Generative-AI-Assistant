import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Target, Sparkles, X } from 'lucide-react';

interface StudyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPlan: (promptText: string) => void;
}

export const StudyPlanModal: React.FC<StudyPlanModalProps> = ({
  isOpen,
  onClose,
  onSubmitPlan,
}) => {
  const [subject, setSubject] = useState('Data Structures & Algorithms in Java');
  const [durationWeeks, setDurationWeeks] = useState('4');
  const [dailyHours, setDailyHours] = useState('2');
  const [level, setLevel] = useState('Beginner to Intermediate');
  const [examGoal, setExamGoal] = useState('College CIE-3 Exam & Campus Placements');
  const [specialFocus, setSpecialFocus] = useState('Graph algorithms, Dynamic Programming, and LeetCode problem patterns');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedPrompt = `Create a detailed, day-by-day and week-by-week personalized study plan for:
- Subject/Topic: ${subject}
- Total Duration: ${durationWeeks} weeks
- Available Study Time: ${dailyHours} hours/day
- Current Level: ${level}
- Target Goal/Exam: ${examGoal}
- Priority Focus Areas: ${specialFocus || 'Core fundamentals & practical problem solving'}

Please structure the plan into clear phases:
1. Phase Overview & Milestones
2. Weekly Breakdown with daily topics and high-yield practice tasks
3. Recommended free high-quality study resources
4. Self-assessment checkpoints and common pitfalls to avoid`;

    onSubmitPlan(generatedPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Study Plan Generator</h3>
              <p className="text-xs text-slate-400">
                Generate a custom timeline tailored to your deadlines & daily hours
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
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Subject or Topic Name
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
              placeholder="e.g. Operating Systems, System Design, React & Node.js"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Study Duration
              </label>
              <select
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="1">1 Week (Crash Sprint)</option>
                <option value="2">2 Weeks (Intensive)</option>
                <option value="4">4 Weeks (1 Month Plan)</option>
                <option value="8">8 Weeks (2 Months)</option>
                <option value="12">12 Weeks (Semester Plan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Available Time / Day
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="1">1 hour / day</option>
                <option value="2">2 hours / day</option>
                <option value="3">3 hours / day</option>
                <option value="4">4+ hours / day</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="Complete Beginner">Complete Beginner</option>
                <option value="Beginner to Intermediate">Beginner to Intermediate</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced Review">Advanced / Fast Revision</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Target Exam or Goal
              </label>
              <input
                type="text"
                value={examGoal}
                onChange={(e) => setExamGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
                placeholder="e.g. Semester Exam, Placements, GATE"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Special Focus Areas or Topics
            </label>
            <input
              type="text"
              value={specialFocus}
              onChange={(e) => setSpecialFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
              placeholder="e.g. Recursion, Trees, Memory Management"
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate Personalized Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
