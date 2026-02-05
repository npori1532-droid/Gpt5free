
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Terminal, Copy, Check, 
  Activity, Cpu, Shield, ArrowRight, Zap 
} from 'lucide-react';
import { Message } from '../types.ts';

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
  }, [messages, isLoading]);

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
      <div className="h-14 border-b border-white/5 px-4 md:px-8 flex items-center justify-between glass-panel relative z-20">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">Nexus Core Active</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest sm:hidden">ACTIVE</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-500">99.9%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest hidden xs:inline">Protocol: v5.2</span>
           <div className="px-2 md:px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[9px] font-black text-indigo-400 uppercase">Secure</span>
           </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 overflow-y-auto">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] md:rounded-[2.5rem] nexus-accent-gradient flex items-center justify-center mb-8 md:mb-10 shadow-[0_0_60px_rgba(99,102,241,0.3)] float-animation">
            <Zap className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
            NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">PRO</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-sm md:text-lg font-medium leading-relaxed mb-10 opacity-70 px-4">
            Next-generation neural architecture via Tech Master Engineering. Enterprise-grade reasoning deployed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-4xl px-4">
            {[
              "Analyze quantum computing impact",
              "Synthesize a 12-month business plan",
              "Debug complex race conditions",
              "Draft a professional whitepaper"
            ].map((suggest, i) => (
              <button 
                key={i}
                onClick={() => onSendMessage(suggest)}
                className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 text-left transition-all group flex items-center gap-4"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4 md:w-5 h-5" />
                </div>
                <p className="text-[11px] md:text-sm font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-tight line-clamp-2">{suggest}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:px-12 md:py-16 space-y-6 md:space-y-10 scrollbar-hide relative z-10 pb-32 md:pb-40">
          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 md:gap-8 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl nexus-accent-gradient flex items-center justify-center shadow-lg">
                  <Cpu className="w-4 h-4 md:w-6 h-6 text-white" />
                </div>
              )}
              
              <div className={`max-w-[90%] md:max-w-[80%] group relative ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`p-4 md:p-7 rounded-2xl md:rounded-[2rem] shadow-xl relative overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-tr-none' 
                    : 'glass-panel text-slate-100 rounded-tl-none border-white/10'
                }`}>
                  <div className="whitespace-pre-wrap leading-[1.6] md:leading-[1.8] text-[13px] md:text-[16px] font-medium tracking-tight">
                    {msg.content}
                  </div>
                  
                  {msg.role === 'assistant' && (
                    <div className="absolute top-2 right-2 p-1 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all backdrop-blur-xl"
                       >
                         {copiedId === msg.id ? <Check className="w-3 h-3 md:w-4 h-4 text-emerald-400" /> : <Copy className="w-3 h-3 md:w-4 h-4" />}
                       </button>
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-2 mt-2 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    {msg.role === 'user' ? 'USER' : 'NEXUS-5'}
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-800"></span>
                  <span className="text-[8px] md:text-[9px] font-bold text-slate-600">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center order-2 shadow-lg">
                  <User className="w-4 h-4 md:w-6 h-6 text-indigo-500" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 md:gap-8 justify-start message-in">
               <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl nexus-accent-gradient flex items-center justify-center shadow-lg animate-pulse">
                <Activity className="w-4 h-4 md:w-6 h-6 text-white" />
              </div>
              <div className="glass-panel px-5 py-3 md:px-8 md:py-6 rounded-2xl md:rounded-[2rem] rounded-tl-none border-white/10 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Module */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent pt-10 z-30">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-2xl md:rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
          <form 
            onSubmit={handleSubmit}
            className="relative glass-panel p-2 md:p-2.5 rounded-2xl md:rounded-[2.5rem] border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex items-center gap-2 group transition-all"
          >
            <div className="hidden sm:flex ml-2 p-3 rounded-xl bg-slate-900 text-indigo-500">
              <Terminal className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject neural command..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 px-3 py-3 md:py-4 font-bold text-sm md:text-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-[1.8rem] font-black text-[10px] md:text-xs tracking-widest uppercase transition-all flex items-center gap-2 ${
                input.trim() && !isLoading 
                  ? 'nexus-accent-gradient text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-95' 
                  : 'bg-white/5 text-slate-700 cursor-not-allowed'
              }`}
            >
              <span className="hidden xs:inline">Transmit</span>
              <Send className="w-3.5 h-3.5 md:w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="hidden md:flex items-center justify-center gap-4 mt-6 opacity-30">
           <div className="h-[1px] w-12 bg-white/20"></div>
           <p className="text-[8px] text-slate-400 uppercase tracking-[0.5em] font-black italic">
             TECH MASTER CORE v5.2
           </p>
           <div className="h-[1px] w-12 bg-white/20"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
