
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
    <div className="flex-1 flex flex-col relative h-full w-full overflow-hidden bg-[#020617]">
      <div className="scanline"></div>
      
      {/* Top Header - Compact */}
      <header className="h-12 md:h-14 shrink-0 border-b border-white/5 px-4 md:px-6 flex items-center justify-between glass-panel z-20">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Nexus Core 5.0</span>
          </div>
          <div className="hidden xs:block h-3 w-[1px] bg-white/10"></div>
          <div className="hidden xs:flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-indigo-400" />
            <span className="text-[9px] md:text-[10px] font-bold text-slate-500">OPTIMIZED</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Encrypted Link</span>
           </div>
        </div>
      </header>

      {/* Main Chat Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl nexus-accent-gradient flex items-center justify-center mb-6 shadow-xl float-animation">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter text-white">
              NEXUS <span className="text-indigo-400">GPT-5</span>
            </h2>
            <p className="text-slate-400 max-w-md text-xs md:text-sm font-medium leading-relaxed mb-8 opacity-60">
              Neural interface engineered for extreme precision.
            </p>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 w-full max-w-2xl px-2">
              {[
                "Quantum Logic Analysis",
                "Neural Architecture Synthesis",
                "Advanced Debugging",
                "Enterprise Strategy"
              ].map((suggest, i) => (
                <button 
                  key={i}
                  onClick={() => onSendMessage(suggest)}
                  className="p-3.5 md:p-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 text-left transition-all group flex items-center gap-3"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  <p className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-tight">{suggest}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:px-10 md:py-10 space-y-5 md:space-y-8 scrollbar-hide">
            {messages.map((msg, index) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 md:gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-in max-w-full`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl nexus-accent-gradient flex items-center justify-center">
                    <Cpu className="w-4 h-4 md:w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] md:max-w-[70%] group relative ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                  <div className={`p-3.5 md:p-5 rounded-xl md:rounded-2xl shadow-lg relative break-words overflow-hidden ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'glass-panel text-slate-100 rounded-tl-none border-white/10'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed text-[12px] md:text-[15px] font-medium tracking-normal">
                      {msg.content}
                    </div>
                    
                    {msg.role === 'assistant' && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                         >
                           {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                         </button>
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 mt-1.5 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {msg.role === 'user' ? 'SYSTEM.USER' : 'NEXUS.CORE'}
                    </span>
                    <span className="text-[7px] md:text-[9px] font-bold text-slate-600">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="shrink-0 w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center order-2">
                    <User className="w-4 h-4 md:w-5 h-5 text-indigo-500" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 md:gap-6 justify-start message-in">
                <div className="shrink-0 w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl nexus-accent-gradient flex items-center justify-center animate-pulse">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div className="glass-panel px-4 py-2.5 rounded-xl border-white/10 flex gap-1 items-center">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Module - Fixed to Bottom, No Overflow */}
      <div className="shrink-0 p-3 md:p-6 bg-gradient-to-t from-[#020617] to-transparent z-30">
        <div className="max-w-4xl mx-auto relative group">
          <form 
            onSubmit={handleSubmit}
            className="relative glass-panel p-1.5 md:p-2 rounded-xl md:rounded-2xl border-white/10 shadow-2xl flex items-center gap-2"
          >
            <div className="hidden sm:flex ml-2 p-2 rounded-lg bg-slate-900 text-indigo-500">
              <Terminal className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject neural command..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-700 px-2 py-2 md:py-3 font-bold text-xs md:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all flex items-center gap-2 ${
                input.trim() && !isLoading 
                  ? 'nexus-accent-gradient text-white shadow-lg' 
                  : 'bg-white/5 text-slate-700 cursor-not-allowed'
              }`}
            >
              <span className="hidden sm:inline text-[10px] md:text-xs font-black uppercase tracking-widest">Transmit</span>
              <Send className="w-3.5 h-3.5 md:w-4 h-4" />
            </button>
          </form>
        </div>
        <p className="text-[7px] text-center text-slate-800 uppercase tracking-[0.3em] font-black mt-3">
          Tech Master Engineering © Core v5.2
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
