
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import ChatInterface from './components/ChatInterface.tsx';
import { AIService } from './services/geminiService.ts';
import { Message, ChatSession } from './types.ts';
import { Menu, X, Command, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_pro_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.forEach((s: any) => {
          s.createdAt = new Date(s.createdAt);
          s.messages.forEach((m: any) => m.timestamp = new Date(m.timestamp));
        });
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      } catch (e) {
        console.error("Local Storage sync failed:", e);
      }
    }
    
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexus_pro_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Neural Link Initialized',
      messages: [],
      createdAt: new Date(),
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    let currentId = activeSessionId;
    if (!currentId) {
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: content.slice(0, 30),
        messages: [],
        createdAt: new Date(),
      };
      setSessions([newSession, ...sessions]);
      setActiveSessionId(newId);
      currentId = newId;
    }
    processMessage(currentId, content);
  };

  const processMessage = async (sessionId: string, content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setSessions(prev => prev.map(s => s.id === sessionId ? { 
      ...s, 
      messages: [...s.messages, userMessage],
      title: s.messages.length === 0 ? content.slice(0, 30) : s.title 
    } : s));

    setIsLoading(true);
    try {
      const ai = AIService.getInstance();
      const currentSession = sessions.find(s => s.id === sessionId);
      const history = (currentSession?.messages || []).map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }]
      }));

      const response = await ai.generateChatResponse(content, history);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setSessions(prev => prev.map(s => s.id === sessionId ? { 
        ...s, 
        messages: [...s.messages, botMessage] 
      } : s));
    } catch (e) {
      console.error("Chat Process Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] w-screen bg-[#020617] text-gray-100 overflow-hidden font-sans fixed inset-0">
      {/* Mobile Nav Bar - Thinner to feel less "large" */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 glass-panel z-40 flex items-center justify-between px-4 border-b border-white/5">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 rounded-lg bg-white/5 text-indigo-400"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-1.5">
           <Command className="w-4 h-4 text-indigo-500" />
           <span className="font-black text-sm tracking-tighter text-white">NEXUS GPT-5</span>
        </div>
        <button 
          onClick={handleNewChat} 
          className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Sidebar with constrained mobile width */}
      <aside className={`
        fixed lg:relative z-[50] h-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0 w-[80%] sm:w-72' : '-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'}
      `}>
        <Sidebar 
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={id => { setActiveSessionId(id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
          onDeleteSession={id => setSessions(sessions.filter(s => s.id !== id))}
        />
      </aside>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[45]" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col pt-14 lg:pt-0 relative overflow-hidden h-full w-full">
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
