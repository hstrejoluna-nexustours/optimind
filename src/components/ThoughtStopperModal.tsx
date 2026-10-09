import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wind, 
  Clock, 
  Eye, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ThoughtStopperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThoughtStopperModal: React.FC<ThoughtStopperModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [bowlTriggered, setBowlTriggered] = useState(false);
  const [deferredTime, setDeferredTime] = useState('Mañana a las 10:00 AM');
  const [breathText, setBreathText] = useState('Inhala suavemente');

  useEffect(() => {
    if (isOpen) {
      setBowlTriggered(false);
      sounds.playThoughtStopperGong();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const steps = ['Inhala suavemente (4s)', 'Sostén con paz (4s)', 'Exhala y suelta (4s)'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setBreathText(steps[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRingBowl = () => {
    setBowlTriggered(true);
    sounds.playThoughtStopperGong();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141715]/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#1A1F1C] rounded-[2.5rem] p-7 sm:p-10 shadow-xl border border-[#E8E2D7] dark:border-[#2C332E] text-center overflow-hidden">
        {/* Soft Warm Ambient Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-80 h-80 bg-[#5F7A61]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#696F6B] hover:text-[#282D2A] dark:hover:text-[#F0F3EF] hover:bg-[#EFEAE2] dark:hover:bg-[#252B27] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-6">
          <div>
            <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium tracking-wide">
              Pausa Consciente & Protocolo de Seligman
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#282D2A] dark:text-[#F0F3EF] mt-1">
              Espacio de Calma & Dejar Ir
            </h2>
            <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-2 leading-relaxed">
              Cuando un pensamiento rumiante se repite sin traer respuestas, no luches contra él. 
              Detente, respira y permite que se disipe como una onda en el agua.
            </p>
          </div>

          {/* Interactive Singing Bowl & Ripple Circle */}
          <div className="py-3 flex flex-col items-center justify-center">
            <button
              onClick={handleRingBowl}
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center transition-transform active:scale-95 group focus:outline-none"
            >
              {/* Concentric ripples */}
              <div className="absolute inset-0 rounded-full border border-[#5F7A61]/30 animate-ripple" />
              <div className="absolute inset-2 rounded-full border border-[#5F7A61]/20 animate-ripple" style={{ animationDelay: '1.2s' }} />

              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#E2B678]/40 via-[#5F7A61]/20 to-[#5F7A61]/30 dark:from-[#323D34] dark:to-[#222924] border border-[#5F7A61]/30 flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-all">
                <Wind className="w-6 h-6 text-[#4A644C] dark:text-[#A8BEA7] mb-1" />
                <span className="font-serif text-xs font-medium text-[#282D2A] dark:text-[#F0F3EF]">
                  Toca para soltar
                </span>
                <span className="text-[10px] text-[#696F6B] dark:text-[#9BA19C]">
                  Cuenco tibetano
                </span>
              </div>
            </button>

            <div className="mt-3 text-xs font-medium text-[#5F7A61] dark:text-[#A8BEA7]">
              {breathText}
            </div>
          </div>

          {/* 2 Gentle Seligman Release Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Method 1: Gentle Postponement */}
            <div className="p-4 rounded-2xl bg-[#F4EFE6] dark:bg-[#232925] border border-[#E9E3D6] dark:border-[#2C342E]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#282D2A] dark:text-[#F0F3EF] mb-1">
                <Clock className="w-4 h-4 text-[#5F7A61]" />
                <span>1. Aplazamiento Amable</span>
              </div>
              <p className="text-[11px] text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
                Di mentalmente: &ldquo;No necesito resolver esto en este segundo. Lo revisaré con calma a las {deferredTime}&rdquo;.
              </p>
              <input
                type="text"
                value={deferredTime}
                onChange={(e) => setDeferredTime(e.target.value)}
                className="mt-2.5 w-full px-2.5 py-1 text-xs rounded-xl bg-white dark:bg-[#161A17] border border-[#DED7CA] dark:border-[#2E3630] text-[#282D2A] dark:text-[#F0F3EF]"
              />
            </div>

            {/* Method 2: 3-3-3 Grounding */}
            <div className="p-4 rounded-2xl bg-[#F4EFE6] dark:bg-[#232925] border border-[#E9E3D6] dark:border-[#2C342E]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#282D2A] dark:text-[#F0F3EF] mb-1">
                <Eye className="w-4 h-4 text-[#5F7A61]" />
                <span>2. Anclaje al Presente</span>
              </div>
              <p className="text-[11px] text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
                Observa 3 detalles bellos a tu alrededor, escucha 3 sonidos sutiles y siente el peso de tus pies sobre el suelo.
              </p>
              <div className="mt-2.5 text-[11px] font-medium text-[#4A644C] dark:text-[#A8BEA7] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aquí y ahora todo está bien</span>
              </div>
            </div>
          </div>

          {/* Close & Continue */}
          <div className="pt-1">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] text-xs font-semibold tracking-wide transition shadow-xs"
            >
              Volver con serenidad y mente despejada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
