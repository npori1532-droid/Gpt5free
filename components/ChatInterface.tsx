
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Bot, Sparkles, Terminal, Copy, Check, 
  Activity, Cpu, Shield, ArrowRight, Zap 
} from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.08),transparent)]">
      <div className="scanline"></div>
      
      {/* Top Status Bar */}
      <div className="h-14 border-b border-white/5 px-8 flex items-center justify-between glass-panel relative z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nexus Core Active</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-500">Stability: 99.9%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Protocol: v5.1-Nexus</span>
           <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[9px] font-black text-indigo-400">ENCRYPTED</span>
           </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
          <div className="w-28 h-28 rounded-[2.5rem] nexus-accent-gradient flex items-center justify-center mb-12 shadow-[0_0_60px_rgba(99,102,241,0.3)] float-animation">
            <Zap className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-6xl font-black mb-6 tracking-tighter text-white">
            NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">PRO</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-xl font-medium leading-relaxed mb-16 opacity-70">
            Direct access to the GPT-5 Nexus architecture. Enterprise-grade reasoning and intelligence via Tech Master Engineering.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
            {[
              "Synthesize a financial roadmap for a SaaS exit",
              "Architect a microservices layout for scale",
              "Deconstruct the nuances of post-modern art",
              "Optimize this Python logic for O(n log n)"
            ].map((suggest, i) => (
              <button 
                key={i}
                onClick={() => onSendMessage(suggest)}
                className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 text-left transition-all group flex items-center gap-6"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <p className="text-sm font-extrabold text-slate-300 group-hover:text-white transition-colors uppercase tracking-tight">{suggest}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-16 space-y-12 scrollbar-hide relative z-10">
          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`flex gap-6 md:gap-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-14 h-14 rounded-3xl nexus-accent-gradient flex items-center justify-center shadow-2xl">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
              )}
              
              <div className={`max-w-[85%] md:max-w-[75%] group relative ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-tr-none' 
                    : 'glass-panel text-slate-100 rounded-tl-none border-white/10'
                }`}>
                  <p className="whitespace-pre-wrap leading-[1.8] text-[16px] md:text-[17px] font-medium tracking-tight">
                    {msg.content}
                  </p>
                  
                  {msg.role === 'assistant' && (
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-xl"
                       >
                         {copiedId === msg.id ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-4 mt-4 px-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {msg.role === 'user' ? 'User Identity' : 'Nexus Intelligence'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  <span className="text-[10px] font-bold text-slate-600">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-14 h-14 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center order-2 shadow-xl">
                  <User className="w-8 h-8 text-indigo-500" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-6 md:gap-10 justify-start message-in">
               <div className="flex-shrink-0 w-14 h-14 rounded-3xl nexus-accent-gradient flex items-center justify-center shadow-lg animate-pulse">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="glass-panel px-10 py-8 rounded-[2.5rem] rounded-tl-none border-white/10 flex gap-3 items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Module */}
      <div className="p-6 md:p-12 pt-0 relative z-20">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-[3rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
          <form 
            onSubmit={handleSubmit}
            className="relative glass-panel p-3 rounded-[2.5rem] border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-4 group transition-all"
          >
            <div className="ml-4 p-4 rounded-[1.5rem] bg-slate-900 text-indigo-500">
              <Terminal className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject command into Nexus core..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 px-3 py-5 font-bold text-xl"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-10 py-5 rounded-[1.8rem] font-black text-sm tracking-widest uppercase transition-all flex items-center gap-3 ${
                input.trim() && !isLoading 
                  ? 'nexus-accent-gradient text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-[1.03] active:scale-95' 
                  : 'bg-white/5 text-slate-700 cursor-not-allowed'
              }`}
            >
              <span>Transmit</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
        <div className="flex items-center justify-center gap-6 mt-8">
           <div className="h-[1px] w-20 bg-white/5"></div>
           <p className="text-[10px] text-slate-700 uppercase tracking-[0.5em] font-black italic">
             Developed by Tech Master Engineering • Production Build 5.1
           </p>
           <div className="h-[1px] w-20 bg-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
