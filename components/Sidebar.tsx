
import React from 'react';
import { MessageSquare, Plus, ExternalLink, Send, Trash2, Cpu, ShieldCheck, Zap, MessageCircleMore } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectSession, onDeleteSession }) => {
  return (
    <div className="w-80 h-full glass border-r border-white/5 flex flex-col p-5 z-20 overflow-hidden">
      {/* Brand Section */}
      <div className="flex items-center gap-4 mb-10 group cursor-default">
        <div className="w-12 h-12 rounded-2xl nexus-gradient flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-500">
          <Cpu className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            GPT-5 <span className="text-indigo-400">NEXUS</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Tech Master Engine</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <button 
        onClick={onNewChat}
        className="flex items-center justify-center gap-2.5 w-full py-4 px-4 rounded-2xl nexus-gradient hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/10 mb-8 font-bold text-sm tracking-wide"
      >
        <Plus className="w-5 h-5" />
        <span>Initialize Nexus</span>
      </button>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 -mr-2 scrollbar-hide">
        <div className="flex items-center justify-between px-3 mb-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural History</p>
          <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
        </div>
        
        {sessions.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-slate-600 font-medium italic">Empty core...</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              className={`group flex items-center gap-3 w-full p-3.5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                activeSessionId === session.id 
                  ? 'bg-indigo-600/10 border-indigo-500/40 text-white shadow-inner' 
                  : 'hover:bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageCircleMore className={`w-4 h-4 ${activeSessionId === session.id ? 'text-indigo-400' : 'text-slate-600'}`} />
              <span className="flex-1 truncate text-xs font-semibold tracking-tight">{session.title}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Developer Profile Card */}
      <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-150 transition-transform">
             <ShieldCheck className="w-12 h-12 text-indigo-400" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">Verified Dev</p>
              <h4 className="text-xs font-extrabold text-white">Tech Master</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a 
              href="https://t.me/GAJARBOTOLZ" 
              target="_blank" 
              className="flex items-center gap-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Telegram Channel</span>
              <ExternalLink className="w-2.5 h-2.5 ml-auto opacity-50" />
            </a>
            <a 
              href="https://t.me/tech_master_a2z" 
              target="_blank" 
              className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Dev Support</span>
              <ExternalLink className="w-2.5 h-2.5 ml-auto opacity-50" />
            </a>
          </div>
        </div>
        
        <p className="text-[8px] text-center text-slate-600 font-bold tracking-[0.3em] uppercase opacity-50">
          Nexus v5.1.0 • Stable Release
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
