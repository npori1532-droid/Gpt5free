
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { AIService } from './services/geminiService';
import { Message, ChatSession } from './types';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize first chat session if none exists
  useEffect(() => {
    const saved = localStorage.getItem('gpt5_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Revive Dates
      parsed.forEach((s: any) => {
        s.createdAt = new Date(s.createdAt);
        s.messages.forEach((m: any) => m.timestamp = new Date(m.timestamp));
      });
      setSessions(parsed);
      if (parsed.length > 0) setActiveSessionId(parsed[0].id);
    }
  }, []);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('gpt5_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) {
      const newSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: newSessionId,
        title: content.slice(0, 30) + '...',
        messages: [],
        createdAt: new Date(),
      };
      setSessions([newSession, ...sessions]);
      setActiveSessionId(newSessionId);
      processMessage(newSessionId, content);
    } else {
      processMessage(activeSessionId, content);
    }
  };

  const processMessage = async (sessionId: string, content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          messages: [...s.messages, userMessage],
          title: s.messages.length === 0 ? content.slice(0, 30) + '...' : s.title
        };
      }
      return s;
    }));

    setIsLoading(true);

    try {
      const currentSession = sessions.find(s => s.id === sessionId) || { messages: [] };
      const history = currentSession.messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }]
      }));

      const ai = AIService.getInstance();
      const aiResponseText = await ai.generateChatResponse(content, history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };

      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: [...s.messages, assistantMessage]
          };
        }
        return s;
      }));
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error connecting to my neural network. Please check your connection or try again later.",
        timestamp: new Date(),
      };
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) return { ...s, messages: [...s.messages, errorMessage] };
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-gray-100 overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-30 flex items-center justify-between px-6 border-b border-white/10">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
        <span className="font-bold tracking-tighter text-indigo-400">GPT-5</span>
        <button onClick={handleNewChat} className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
          <Menu className="rotate-90 w-5 h-5" />
        </button>
      </div>

      {/* Sidebar - Desktop/Mobile Overlay */}
      <div className={`
        fixed md:relative z-40 h-full transition-all duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden'}
      `}>
        <Sidebar 
          sessions={sessions}
          activeSessionId={activeSessionId || ''}
          onNewChat={handleNewChat}
          onSelectSession={(id) => {
            setActiveSessionId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0">
        <ChatInterface 
          messages={activeSession?.messages || []} 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;
