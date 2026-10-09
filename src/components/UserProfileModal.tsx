import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  LogOut, 
  Cloud, 
  CloudCheck, 
  Flame, 
  Brain, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Download, 
  TrendingDown, 
  CheckCircle2, 
  User as UserIcon,
  HelpCircle,
  RefreshCw,
  Compass
} from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfileData } from '../services/firebase';
import { AbcdeEntry, MoodCheckIn } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userProfile: UserProfileData | null;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  entries: AbcdeEntry[];
  moods: MoodCheckIn[];
  streak: number;
  onSyncLocalToCloud: () => Promise<void>;
  onOpenDataModal: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userProfile,
  onLogin,
  onLogout,
  entries,
  moods,
  streak,
  onSyncLocalToCloud,
  onOpenDataModal
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    try {
      await onLogin();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    try {
      await onSyncLocalToCloud();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Calculate psychological resilience metrics
  const totalCompleted = entries.length;
  
  // Average drop from consequence to energization
  let avgDrop = 0;
  if (entries.length > 0) {
    const drops = entries.map(e => {
      const c = e.consequences?.intensity || 5;
      const f = e.energization?.newIntensity || c;
      return Math.max(0, c - f);
    });
    avgDrop = +(drops.reduce((a, b) => a + b, 0) / entries.length).toFixed(1);
  }

  // Explanatory style breakdown
  const permanentCount = entries.filter(e => e.classifications?.permanent).length;
  const universalCount = entries.filter(e => e.classifications?.universal).length;
  const internalCount = entries.filter(e => e.classifications?.internal).length;

  const tempOptimismPct = entries.length > 0 
    ? Math.round(((entries.length - permanentCount) / entries.length) * 100) 
    : 85;

  const specificOptimismPct = entries.length > 0 
    ? Math.round(((entries.length - universalCount) / entries.length) * 100) 
    : 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#333E38]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FBF9F5] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-tonal-xl border border-[#E6DFD5] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E6DFD5] flex items-center justify-between sticky top-0 bg-[#FBF9F5]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E5A44]/10 text-[#2E5A44] flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#2E5A44]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#333E38]">
                Panel de Usuario & Resiliencia
              </h3>
              <p className="text-xs text-[#647069]">
                Tu refugio y datos persistentes en OptiMind
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#647069] hover:bg-[#F3EEE7] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Auth Status Card */}
          {user ? (
            <div className="p-5 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Usuario'} 
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#2E5A44]/20 shadow-tonal-sm"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-2xl bg-[#2E5A44] text-[#FBF9F5] flex items-center justify-center font-serif text-xl font-bold">
                      {user.displayName ? user.displayName.charAt(0) : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[#333E38] text-base leading-tight">
                        {user.displayName || 'Practicante de Optimismo'}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2E5A44] bg-[#2E5A44]/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Nube Activa
                      </span>
                    </div>
                    <p className="text-xs text-[#647069] mt-0.5">{user.email}</p>
                    <p className="text-[11px] text-[#55635C] mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E5A44]" /> Base de datos Firestore sincronizada en tiempo real
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="px-3 py-1.5 rounded-xl border border-[#E6DFD5] bg-[#FBF9F5] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-medium text-[#55635C] transition flex items-center gap-1.5 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>

              {/* Sync Actions Bar */}
              <div className="pt-2 border-t border-[#E6DFD5]/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-[#647069]">
                  <Cloud className="w-4 h-4 text-[#2E5A44]" />
                  <span>Progreso respaldado automáticamente</span>
                </div>
                <button
                  onClick={handleSyncClick}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-medium text-xs transition flex items-center gap-1.5 shadow-tonal-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{syncSuccess ? '¡Sincronizado!' : 'Forzar Sincronización'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#333E38]">
                    Modo Local Activo (Invitado)
                  </h4>
                  <p className="text-xs text-[#55635C] mt-1 leading-relaxed">
                    Tus reflexiones se guardan en este navegador. Conecta tu cuenta con Google para respaldar tus ejercicios, conservar tu racha y continuar en cualquier dispositivo con Firebase.
                  </p>
                </div>
              </div>

              <button
                onClick={handleLoginClick}
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-medium text-sm transition flex items-center justify-center gap-2.5 shadow-tonal-sm"
              >
                {/* Google "G" SVG */}
                <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isLoggingIn ? 'Iniciando sesión segura...' : 'Iniciar Sesión con Google'}</span>
              </button>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#647069]">
              Estadísticas de Entrenamiento Cognitivo
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {/* Streak */}
              <div className="p-3.5 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] text-center">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#C86D51] flex items-center justify-center mx-auto mb-1">
                  <Flame className="w-4 h-4 fill-[#C86D51]" />
                </div>
                <div className="font-serif text-xl font-bold text-[#333E38] tabular-nums">
                  {streak}
                </div>
                <div className="text-[10px] text-[#647069] font-medium">
                  Días de Racha
                </div>
              </div>

              {/* Workouts */}
              <div className="p-3.5 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] text-center">
                <div className="w-7 h-7 rounded-lg bg-[#2E5A44]/10 text-[#2E5A44] flex items-center justify-center mx-auto mb-1">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="font-serif text-xl font-bold text-[#333E38] tabular-nums">
                  {totalCompleted}
                </div>
                <div className="text-[10px] text-[#647069] font-medium">
                  Sesiones ABCDE
                </div>
              </div>

              {/* Relief */}
              <div className="p-3.5 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] text-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div className="font-serif text-xl font-bold text-[#2E5A44] tabular-nums">
                  {avgDrop > 0 ? `-${avgDrop}` : '0.0'}
                </div>
                <div className="text-[10px] text-[#647069] font-medium">
                  Alivio Emocional (C a E)
                </div>
              </div>
            </div>
          </div>

          {/* Explanatory Style Balance */}
          <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#333E38] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#2E5A44]" />
                Pauta de Estilo Explicativo Actual
              </span>
              <span className="text-[11px] text-[#2E5A44] font-semibold">
                {tempOptimismPct}% Enfoque Temporal
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-[#647069] mb-1">
                  <span>Permanencia (Temporal vs Permanente)</span>
                  <span className="font-medium text-[#333E38]">{tempOptimismPct}% flexible</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E6DFD5] overflow-hidden">
                  <div 
                    className="h-full bg-[#2E5A44] transition-all duration-500 rounded-full"
                    style={{ width: `${tempOptimismPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#647069] mb-1">
                  <span>Amplitud (Específico vs Universal)</span>
                  <span className="font-medium text-[#333E38]">{specificOptimismPct}% contenido</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E6DFD5] overflow-hidden">
                  <div 
                    className="h-full bg-[#C86D51] transition-all duration-500 rounded-full"
                    style={{ width: `${specificOptimismPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Backup & Portability Options */}
          <div className="pt-2 border-t border-[#E6DFD5] flex items-center justify-between gap-4">
            <button
              onClick={() => {
                onClose();
                onOpenDataModal();
              }}
              className="text-xs text-[#2E5A44] hover:underline flex items-center gap-1.5 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar / Importar respaldo JSON</span>
            </button>
            <span className="text-[11px] text-[#647069]">
              {moods.length} registros anímicos
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3EEE7] border-t border-[#E6DFD5] flex items-center justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-medium text-xs transition"
          >
            Cerrar panel
          </button>
        </div>
      </div>
    </div>
  );
};
