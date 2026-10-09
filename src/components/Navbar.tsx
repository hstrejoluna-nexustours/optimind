import React, { useState } from 'react';
import { 
  Flame, 
  DownloadCloud, 
  Volume2, 
  VolumeX, 
  Cloud, 
  CheckCircle2, 
  User as UserIcon,
  LogIn
} from 'lucide-react';
import { User } from 'firebase/auth';
import { sounds } from '../utils/audio';

export type AppTab = 'santuario' | 'wiki' | 'glosario' | 'gimnasio';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  streak: number;
  onOpenDataModal: () => void;
  user: User | null;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  streak,
  onOpenDataModal,
  user,
  onOpenProfileModal,
}) => {
  const [isAmbientOn, setIsAmbientOn] = useState(false);

  const handleToggleAmbient = () => {
    const active = sounds.toggleAmbientNature();
    setIsAmbientOn(active);
  };

  const navTabs: { id: AppTab; label: string; icon: string }[] = [
    { id: 'santuario', label: 'Santuario', icon: '🌿' },
    { id: 'wiki', label: 'Wiki del Optimismo', icon: '📖' },
    { id: 'glosario', label: 'Glosario', icon: '📚' },
    { id: 'gimnasio', label: 'Gimnasio ABCDE', icon: '🧠' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E6DFD5] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Brand Wordmark (Zone 1) */}
          <button 
            onClick={() => onSelectTab('santuario')}
            className="text-left group flex items-center gap-2.5 sm:gap-3 focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#2E5A44] flex items-center justify-center text-[#FBF9F5] shadow-tonal-sm group-hover:scale-105 transition-transform">
              <span className="text-base select-none">🌿</span>
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl tracking-tight font-medium text-[#333E38] block leading-none">
                OptiMind
              </span>
              <span className="text-[10px] tracking-wide text-[#647069] font-medium hidden sm:block mt-0.5">
                Santuario & Gimnasio Cognitivo
              </span>
            </div>
          </button>

          {/* 4 Distinct Tabs (Zone 2) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#F3EEE7] rounded-2xl border border-[#E6DFD5]">
            {navTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold shadow-tonal-sm'
                      : 'text-[#55635C] hover:text-[#333E38] hover:bg-[#EAE4DB]'
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Persistent Streak Badge & Action Cluster (Zone 3) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Ambient Rain / Zen Soundscape Toggle */}
            <button
              onClick={handleToggleAmbient}
              title={isAmbientOn ? "Silenciar sonido relajante de lluvia" : "Activar sonido zen de lluvia suave"}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium ${
                isAmbientOn
                  ? 'bg-[#2E5A44]/10 text-[#2E5A44] border-[#2E5A44]/30'
                  : 'bg-[#F3EEE7] text-[#647069] border-[#E6DFD5] hover:bg-[#EAE4DB]'
              }`}
            >
              {isAmbientOn ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#2E5A44] animate-pulse" />
                  <span className="hidden xl:inline text-[11px] text-[#2E5A44] font-medium">Lluvia</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden xl:inline text-[11px]">Sonido</span>
                </>
              )}
            </button>

            {/* Persistent Resilience Streak Badge with warm Terracotta accent */}
            <div 
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F3EEE7] border border-[#E6DFD5] text-[#C86D51] text-xs font-semibold shadow-tonal-sm cursor-pointer hover:bg-[#EAE4DB] transition"
              title="Racha de días de resiliencia y reflexión cognitiva (haz clic para ver tu perfil)"
              onClick={onOpenProfileModal}
            >
              <Flame className="w-4 h-4 text-[#C86D51] fill-[#C86D51] animate-bounce" />
              <span className="tabular-nums font-bold text-[#333E38]">{streak}</span>
              <span className="hidden sm:inline text-[#647069] font-normal text-[11px]">días</span>
            </div>

            {/* User Profile & Firebase Cloud Sync Button */}
            <button
              onClick={onOpenProfileModal}
              title={user ? `Conectado como ${user.displayName || user.email} (Sincronizado con Firebase)` : "Iniciar sesión con Google para sincronizar tus avances en la nube"}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition text-xs font-medium ${
                user 
                  ? 'bg-[#2E5A44]/10 border-[#2E5A44]/30 text-[#2E5A44] hover:bg-[#2E5A44]/15' 
                  : 'bg-[#F3EEE7] border-[#E6DFD5] text-[#55635C] hover:bg-[#EAE4DB]'
              }`}
            >
              {user ? (
                <>
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="" 
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-[#2E5A44]"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#2E5A44] text-[#FBF9F5] flex items-center justify-center text-[10px] font-bold">
                      {user.displayName ? user.displayName.charAt(0) : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-medium max-w-[85px] truncate text-[#333E38]">
                    {user.displayName?.split(' ')[0] || 'Perfil'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sincronizado" />
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#C86D51]" />
                  <span className="text-xs text-[#333E38] font-medium hidden sm:inline">Ingresar</span>
                </>
              )}
            </button>

            {/* JSON Export/Import Modal Button */}
            <button
              onClick={onOpenDataModal}
              title="Copias de seguridad JSON"
              className="p-2 rounded-xl bg-[#F3EEE7] hover:bg-[#EAE4DB] text-[#647069] border border-[#E6DFD5] transition"
            >
              <DownloadCloud className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip (4 Tabs) */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#E6DFD5] text-xs">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#2E5A44] font-semibold'
                    : 'text-[#647069]'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="text-[10px] mt-0.5">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
