
import React from 'react';
import { 
  MessageSquare, Plus, ExternalLink, Send, Trash2, 
  Cpu, ShieldCheck, Zap, Layers, Globe, Star 
} from 'lucide-react';
import { ChatSession } from '../types.ts';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectSession, onDeleteSession }) => {
  return (
    <div className="w-80 h-full glass-panel border-r border-white/5 flex flex-col p-6 z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-12 group">
        <div className="w-14 h-14 rounded-2xl nexus-accent-gradient flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.5)] group-hover:rotate-6 transition-all duration-500">
          <Layers className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            NEXUS<span className="text-indigo-500">5</span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">PRO EDITION</p>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <button 
        onClick={onNewChat}
        className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 mb-10 overflow-hidden"
      >
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Plus className="w-5 h-5 text-indigo-400 group-hover:rotate-90 transition-transform" />
        <span className="font-bold text-sm tracking-wide text-white">Initialize Core</span>
      </button>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2 scrollbar-hide">
        <div className="flex items-center gap-3 px-3 mb-6">
          <Globe className="w-3.5 h-3.5 text-slate-600" />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Neural Channels</p>
        </div>
        
        {sessions.map((session) => (
          <div 
            key={session.id}
            className={`group flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${
              activeSessionId === session.id 
                ? 'bg-indigo-600/10 border-indigo-500/40 text-white' 
                : 'hover:bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <div className={`w-2 h-2 rounded-full ${activeSessionId === session.id ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'}`}></div>
            <span className="flex-1 truncate text-xs font-bold leading-none">{session.title}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Developer Profile - Professional Spotlight */}
      <div className="mt-8 space-y-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 relative overflow-hidden group shadow-2xl">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-indigo-500/40 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-0.5 border-2 border-slate-900">
                <Star className="w-2.5 h-2.5 text-white fill-current" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter">Senior Architect</p>
              <h4 className="text-sm font-black text-white">Tech Master</h4>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <a 
              href="https://t.me/GAJARBOTOLZ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 hover:text-white transition-all border border-transparent hover:border-indigo-500/20"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Official Nexus Channel</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
            </a>
            <a 
              href="https://t.me/tech_master_a2z" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 hover:text-white transition-all border border-transparent hover:border-indigo-500/20"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Developer Support</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
            </a>
          </div>
        </div>
        
        <p className="text-[9px] text-center text-slate-700 font-black uppercase tracking-[0.5em] mt-4">
          Tech Master Engineering © 2025
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
