
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Terminal, Copy, Check, Waves, Command } from 'lucide-react';
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
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      <div className="neural-bg"></div>
      
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
          <div className="w-24 h-24 rounded-3xl nexus-gradient flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-float">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-extrabold mb-6 animate-text-shimmer tracking-tighter">
            Nexus AI Architecture
          </h2>
          <p className="text-slate-400 max-w-lg text-lg font-medium leading-relaxed mb-12 opacity-80">
            Welcome to the GPT-5 Nexus. Experience the next generation of reasoning, precision, and intelligence engineered by Tech Master.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
            {[
              "Synthesize a growth strategy for a tech startup",
              "Architect a scalable React application structure",
              "Deconstruct the physics of dark matter",
              "Draft a high-conversion SaaS landing page copy"
            ].map((suggest, i) => (
              <button 
                key={i}
                onClick={() => onSendMessage(suggest)}
                className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-left transition-all group flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Command className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{suggest}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-12 space-y-10 scrollbar-hide relative z-10">
          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`flex gap-5 md:gap-8 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-reveal`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl nexus-gradient flex items-center justify-center shadow-lg shadow-indigo-900/40">
                  <Bot className="w-7 h-7 text-white" />
                </div>
              )}
              
              <div className={`max-w-[90%] md:max-w-[80%] group relative ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`p-5 md:p-7 rounded-3xl shadow-2xl relative overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                    : 'glass text-slate-100 rounded-tl-none border-white/5'
                }`}>
                  <p className="whitespace-pre-wrap leading-[1.6] text-[15px] md:text-[16px] font-medium tracking-tight">
                    {msg.content}
                  </p>
                  
                  {msg.role === 'assistant' && (
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-md"
                        title="Copy Response"
                       >
                         {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                       </button>
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-3 mt-3 px-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {msg.role === 'user' ? 'Nexus User' : 'Nexus GPT-5'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span className="text-[10px] font-bold text-slate-600">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800/80 border border-indigo-500/20 flex items-center justify-center order-2">
                  <User className="w-7 h-7 text-indigo-400" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-5 md:gap-8 justify-start message-reveal">
               <div className="flex-shrink-0 w-12 h-12 rounded-2xl nexus-gradient flex items-center justify-center shadow-lg animate-pulse">
                <Waves className="w-7 h-7 text-white" />
              </div>
              <div className="glass px-8 py-6 rounded-3xl rounded-tl-none border-white/5 flex gap-2 items-center">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Futuristic Input Area */}
      <div className="p-4 md:p-10 pt-0 relative z-20">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition-opacity duration-1000"></div>
          <form 
            onSubmit={handleSubmit}
            className="relative glass p-2.5 rounded-[2rem] border-white/10 shadow-2xl flex items-center gap-3 group focus-within:ring-2 ring-indigo-500/20 transition-all"
          >
            <div className="ml-3 p-3 rounded-2xl bg-slate-800 text-indigo-400 group-focus-within:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Command Nexus GPT-5..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-2 py-4 font-semibold text-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-8 py-4 rounded-2xl font-black text-sm tracking-[0.1em] uppercase transition-all flex items-center gap-2 ${
                input.trim() && !isLoading 
                  ? 'nexus-gradient text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>Transmit</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
           <div className="h-[1px] w-12 bg-white/5"></div>
           <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-black">
             Engineered by Developer Tech Master
           </p>
           <div className="h-[1px] w-12 bg-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
