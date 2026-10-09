import React, { useState } from 'react';
import { PlanTier } from '../types';
import { Settings, Shield, RefreshCw, X, ChevronUp, ChevronDown } from 'lucide-react';

interface DevTierSwitcherProps {
  currentTier: PlanTier;
  trialDaysLeft: number;
  bonusCredits: number;
  onSetTier: (tier: PlanTier) => void;
  onSetTrialDays: (days: number) => void;
  onResetUsage: () => void;
}

export const DevTierSwitcher: React.FC<DevTierSwitcherProps> = ({
  currentTier,
  trialDaysLeft,
  bonusCredits,
  onSetTier,
  onSetTrialDays,
  onResetUsage
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-[#FBF9F5] rounded-2xl p-4 shadow-tonal-xl border border-[#2E5A44]/30 w-72 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-2">
            <div className="flex items-center gap-1.5 font-bold text-[#2E5A44]">
              <Shield className="w-3.5 h-3.5" />
              <span>Dev & QA Tier Switcher</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#647069] hover:text-[#333E38] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#55635C] mb-1.5">
              Estado de Nivel (User Tier):
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSetTier('reverse_trial')}
                className={`px-2.5 py-1.5 rounded-xl border text-left transition ${
                  currentTier === 'reverse_trial'
                    ? 'bg-[#2E5A44] text-[#FBF9F5] border-[#2E5A44] font-semibold'
                    : 'bg-[#F3EEE7] text-[#333E38] border-[#E6DFD5]'
                }`}
              >
                Reverse Trial
              </button>
              <button
                onClick={() => onSetTier('free')}
                className={`px-2.5 py-1.5 rounded-xl border text-left transition ${
                  currentTier === 'free'
                    ? 'bg-[#2E5A44] text-[#FBF9F5] border-[#2E5A44] font-semibold'
                    : 'bg-[#F3EEE7] text-[#333E38] border-[#E6DFD5]'
                }`}
              >
                Free Plan
              </button>
              <button
                onClick={() => onSetTier('pro')}
                className={`px-2.5 py-1.5 rounded-xl border text-left transition ${
                  currentTier === 'pro'
                    ? 'bg-[#2E5A44] text-[#FBF9F5] border-[#2E5A44] font-semibold'
                    : 'bg-[#F3EEE7] text-[#333E38] border-[#E6DFD5]'
                }`}
              >
                Pro Active
              </button>
              <button
                onClick={() => onSetTier('executive')}
                className={`px-2.5 py-1.5 rounded-xl border text-left transition ${
                  currentTier === 'executive'
                    ? 'bg-[#2E5A44] text-[#FBF9F5] border-[#2E5A44] font-semibold'
                    : 'bg-[#F3EEE7] text-[#333E38] border-[#E6DFD5]'
                }`}
              >
                Executive
              </button>
            </div>
          </div>

          {currentTier === 'reverse_trial' && (
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#55635C] mb-1">
                <span>Días de prueba restantes:</span>
                <span className="font-bold text-[#2E5A44]">{trialDaysLeft} días</span>
              </div>
              <input
                type="range"
                min={0}
                max={14}
                value={trialDaysLeft}
                onChange={(e) => onSetTrialDays(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer accent-[#2E5A44]"
              />
            </div>
          )}

          <div className="pt-2 border-t border-[#E6DFD5] flex items-center justify-between">
            <span className="text-[10px] text-[#647069]">
              Créditos bono: +{bonusCredits}
            </span>
            <button
              onClick={onResetUsage}
              className="text-[10px] text-[#C86D51] hover:underline flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Reiniciar uso
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#F3EEE7]/90 hover:bg-[#F3EEE7] text-[#55635C] hover:text-[#2E5A44] px-3 py-1.5 rounded-full border border-[#E6DFD5] shadow-tonal-sm text-[11px] font-medium flex items-center gap-1.5 backdrop-blur-sm transition"
          title="Abrir menú de pruebas de niveles (Dev / QA)"
        >
          <Settings className="w-3.5 h-3.5 text-[#2E5A44]" />
          <span>Tier: {currentTier}</span>
        </button>
      )}
    </div>
  );
};
