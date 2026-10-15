import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { StudyPlanModal } from './components/StudyPlanModal';
import { ProjectRecModal } from './components/ProjectRecModal';
import { SystemInfoModal } from './components/SystemInfoModal';
import { HowToTestModal } from './components/HowToTestModal';
import { AssistantMode, Attachment, ChatMessage, ChatSession, ModelStatus } from './types';
import { Loader2, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'generative_ai_assistant_sessions_v1';
const CURRENT_SESSION_KEY = 'generative_ai_assistant_active_session_id';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading sessions from storage:', e);
    }
    const initialSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'general',
      messages: [],
    };
    return [initialSession];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    const savedId = localStorage.getItem(CURRENT_SESSION_KEY);
    return savedId || (sessions[0]?.id ?? 'session-' + Date.now());
  });

  const [currentMode, setCurrentMode] = useState<AssistantMode>('general');
  const [explainSimply, setExplainSimply] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Modals
  const [studyModalOpen, setStudyModalOpen] = useState<boolean>(false);
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState<boolean>(false);
  const [testingGuideOpen, setTestingGuideOpen] = useState<boolean>(false);

  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Error saving sessions:', e);
    }
  }, [sessions]);

  // Sync active session ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId);
    } catch (e) {
      console.error('Error saving current session ID:', e);
    }
  }, [currentSessionId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, isLoading]);

  // Fetch server status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data: ModelStatus) => {
        setModelStatus(data);
      })
      .catch((err) => {
        console.error('Failed to fetch status:', err);
      });
  }, []);

  const activeSession =
    sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const updateCurrentSession = (updater: (prevSession: ChatSession) => ChatSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === currentSessionId ? updater(s) : s))
    );
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: currentMode,
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    const selected = sessions.find((s) => s.id === id);
    if (selected) {
      setCurrentMode(selected.mode || 'general');
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const freshSession: ChatSession = {
        id: 'session-' + Date.now(),
        title: 'New Conversation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: 'general',
        messages: [],
      };
      setSessions([freshSession]);
      setCurrentSessionId(freshSession.id);
    } else {
      setSessions(remaining);
      if (currentSessionId === id) {
        setCurrentSessionId(remaining[0].id);
      }
    }
  };

  const handleSendMessage = async (
    text: string,
    attachments: Attachment[] = [],
    aspectRatio?: string
  ) => {
    if (!text && attachments.length === 0) return;

    // Create user message object
    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now() + '-user',
      role: 'user',
      content: text,
      timestamp: Date.now(),
      mode: currentMode,
      explainSimply,
      attachments,
    };

    // Update session title if first message
    const updatedTitle =
      messages.length === 0
        ? text.slice(0, 36) || (attachments[0] ? `File: ${attachments[0].name}` : 'New Conversation')
        : activeSession.title;

    // Append user message immediately
    updateCurrentSession((prev) => ({
      ...prev,
      title: updatedTitle,
      updatedAt: Date.now(),
      messages: [...prev.messages, userMessage],
    }));

    setIsLoading(true);

    try {
      // 1. IMAGE GENERATION ROUTE
      if (currentMode === 'image_gen') {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            aspectRatio: aspectRatio || '1:1',
          }),
        });
        const data = await response.json();

        if (data.success && data.imageUrl) {
          const assistantMsg: ChatMessage = {
            id: 'msg-' + Date.now() + '-ai',
            role: 'assistant',
            content: `Generated image for prompt: "${text}"`,
            timestamp: Date.now(),
            generatedImage: {
              url: data.imageUrl,
              prompt: text,
            },
          };
          updateCurrentSession((prev) => ({
            ...prev,
            updatedAt: Date.now(),
            messages: [...prev.messages, assistantMsg],
          }));
        } else {
          // Limitation or error
          const assistantMsg: ChatMessage = {
            id: 'msg-' + Date.now() + '-ai',
            role: 'assistant',
            content:
              data.error ||
              'Image generation is currently restricted on this API tier. Please inspect system specifications.',
            timestamp: Date.now(),
            isLimitation: Boolean(data.isLimitation),
            error: data.isLimitation ? undefined : data.error,
          };
          updateCurrentSession((prev) => ({
            ...prev,
            updatedAt: Date.now(),
            messages: [...prev.messages, assistantMsg],
          }));
        }
      } else {
        // 2. TEXT, MULTIMODAL & CODE UNDERSTANDING ROUTE
        // Send history up to the last 8 messages for contextual memory without token blowup
        const historyForApi = messages.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
          attachments: m.attachments,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyForApi,
            prompt: text,
            mode: currentMode,
            explainSimply,
            attachments,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: 'msg-' + Date.now() + '-ai',
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
          mode: currentMode,
          explainSimply,
        };

        updateCurrentSession((prev) => ({
          ...prev,
          updatedAt: Date.now(),
          messages: [...prev.messages, assistantMsg],
        }));
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'msg-' + Date.now() + '-err',
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        error:
          err.message || 'Failed to communicate with the server. Please check your network or API status.',
      };
      updateCurrentSession((prev) => ({
        ...prev,
        updatedAt: Date.now(),
        messages: [...prev.messages, errorMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (
    prompt: string,
    mode?: AssistantMode,
    withExplainSimply?: boolean
  ) => {
    if (mode) setCurrentMode(mode);
    if (withExplainSimply !== undefined) setExplainSimply(withExplainSimply);
    handleSendMessage(prompt, []);
  };

  const handleSendFollowUp = (prompt: string) => {
    handleSendMessage(prompt, []);
  };

  const handleExportChat = () => {
    if (!activeSession || activeSession.messages.length === 0) return;

    let transcript = `# ${activeSession.title}\n`;
    transcript += `Date: ${new Date(activeSession.createdAt).toLocaleString()}\n`;
    transcript += `Mode: ${activeSession.mode}\n\n---\n\n`;

    for (const msg of activeSession.messages) {
      transcript += `### ${msg.role === 'user' ? 'You' : 'Nexa'} (${new Date(
        msg.timestamp
      ).toLocaleTimeString()})\n\n`;
      if (msg.attachments && msg.attachments.length > 0) {
        transcript += `*Attachments: ${msg.attachments.map((a) => a.name).join(', ')}*\n\n`;
      }
      if (msg.content) {
        transcript += `${msg.content}\n\n`;
      }
      if (msg.generatedImage) {
        transcript += `![Generated Image](${msg.generatedImage.url})\n*Prompt: ${msg.generatedImage.prompt}*\n\n`;
      }
      transcript += `---\n\n`;
    }

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSession.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleNewChat}
        onOpenStudyModal={() => setStudyModalOpen(true)}
        onOpenProjectModal={() => setProjectModalOpen(true)}
        onOpenSystemInfo={() => setSystemInfoOpen(true)}
        onOpenTestingGuide={() => setTestingGuideOpen(true)}
        onExportChat={handleExportChat}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Navigation Bar */}
        <Navbar
          currentMode={currentMode}
          onSelectMode={(mode) => setCurrentMode(mode)}
          explainSimply={explainSimply}
          onToggleExplainSimply={() => setExplainSimply((prev) => !prev)}
          onNewChat={handleNewChat}
          onOpenSystemInfo={() => setSystemInfoOpen(true)}
          onOpenTestingGuide={() => setTestingGuideOpen(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Message List or Empty State */}
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState
              onSelectPrompt={handleSelectPrompt}
              onOpenStudyModal={() => setStudyModalOpen(true)}
              onOpenProjectModal={() => setProjectModalOpen(true)}
              onSelectMode={(mode) => setCurrentMode(mode)}
            />
          ) : (
            <div className="divide-y divide-slate-800/40 pb-6">
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onSendFollowUp={handleSendFollowUp}
                  onOpenSystemInfo={() => setSystemInfoOpen(true)}
                />
              ))}

              {/* Loading Indicator Turn */}
              {isLoading && (
                <div className="py-5 px-3 sm:px-6 bg-slate-900/60 border-y border-slate-800/40 animate-pulse">
                  <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Nexa is thinking and synthesizing response...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Floating Input Dock */}
        <footer className="shrink-0 bg-slate-950/90 backdrop-blur-md pt-2 border-t border-slate-900">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentMode={currentMode}
            explainSimply={explainSimply}
          />
        </footer>
      </div>

      {/* Interactive Modals */}
      <StudyPlanModal
        isOpen={studyModalOpen}
        onClose={() => setStudyModalOpen(false)}
        onSubmitPlan={(prompt) => {
          setCurrentMode('education');
          handleSendMessage(prompt, []);
        }}
      />

      <ProjectRecModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmitPrompt={(prompt) => {
          setCurrentMode('general');
          handleSendMessage(prompt, []);
        }}
      />

      <SystemInfoModal
        isOpen={systemInfoOpen}
        onClose={() => setSystemInfoOpen(false)}
        status={modelStatus}
      />

      <HowToTestModal
        isOpen={testingGuideOpen}
        onClose={() => setTestingGuideOpen(false)}
      />
    </div>
  );
}
