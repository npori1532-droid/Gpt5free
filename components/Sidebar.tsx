
import React from 'react';
import { 
  Plus, Send, Trash2, 
  Cpu, ShieldCheck, Zap, Layers, Globe, Star, AlertTriangle 
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
  const handleClearAll = () => {
    if (confirm("PROTOCOL ALERT: Are you sure you want to permanently wipe all neural chat records? This cannot be undone.")) {
      localStorage.removeItem('nexus_pro_sessions');
      window.location.reload();
    }
  };

  return (
    <div className="w-full h-full glass-panel border-r border-white/5 flex flex-col p-4 md:p-6 z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 md:mb-12 group">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl nexus-accent-gradient flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
          <Layers className="text-white w-6 h-6 md:w-7 md:h-7" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-white">
            NEXUS<span className="text-indigo-500">5</span>
          </h1>
          <p className="text-[8px] md:text-[9px] text-slate-500 font-bold tracking-widest uppercase">PRO INTERFACE</p>
        </div>
      </div>

      {/* Action Area */}
      <div className="space-y-2 mb-8">
        <button 
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-bold text-xs md:text-sm shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          <span>New Neural Link</span>
        </button>
        
        <button 
          onClick={handleClearAll}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all font-bold text-[10px] md:text-xs"
        >
          <AlertTriangle size={14} />
          <span>Wipe All Data</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1 scrollbar-hide">
        <div className="flex items-center gap-2 px-2 mb-4">
          <Globe className="w-3 h-3 text-slate-600" />
          <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural Channels</p>
        </div>
        
        {sessions.map((session) => (
          <div 
            key={session.id}
            className={`group flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 cursor-pointer border ${
              activeSessionId === session.id 
                ? 'bg-indigo-600/15 border-indigo-500/40 text-white' 
                : 'hover:bg-white/5 border-transparent text-slate-400'
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeSessionId === session.id ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-slate-800'}`}></div>
            <span className="flex-1 truncate text-[11px] md:text-xs font-bold">{session.title}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-10 opacity-20">
            <Cpu className="w-8 h-8 mx-auto mb-2" />
            <p className="text-[10px] font-bold">NO RECENT LINKS</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
             </div>
             <div>
               <p className="text-[8px] text-indigo-400 font-black uppercase tracking-tighter">Architect</p>
               <h4 className="text-[11px] font-bold text-white">Tech Master</h4>
             </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <a href="https://t.me/GAJARBOTOLZ" target="_blank" className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-2 transition-colors">
              <Send size={10} /> Telegram Channel
            </a>
            <a href="https://t.me/tech_master_a2z" target="_blank" className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-2 transition-colors">
              <Zap size={10} /> Developer Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
