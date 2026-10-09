import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  Clock, 
  Eye, 
  CheckCircle, 
  RotateCcw,
  Sparkles,
  ArrowRight
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
  const [bastaTriggered, setBastaTriggered] = useState(false);
  const [breathCount, setBreathCount] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 minutes worry postponement
  const [timerActive, setTimerActive] = useState(false);
  const [deferredTime, setDeferredTime] = useState('11:00 AM de mañana');

  useEffect(() => {
    if (isOpen) {
      setBastaTriggered(false);
      setBreathCount(1);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  if (!isOpen) return null;

  const triggerBasta = () => {
    setBastaTriggered(true);
    sounds.playThoughtStopperGong();
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Protocolo de Interrupción de Rumiación (Dr. Martin Seligman)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              Freno Cognitivo de Emergencia
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Cuando una creencia negativa se repite en bucle sin aportar soluciones, no discutas: ¡deténla en seco!
            </p>
          </div>

          {/* Big Interactive "¡BASTA!" Button */}
          <div className="py-2">
            <button
              onClick={triggerBasta}
              className={`w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full font-black text-2xl sm:text-3xl tracking-widest transition-all transform active:scale-95 flex flex-col items-center justify-center shadow-xl border-4 ${
                bastaTriggered
                  ? 'bg-rose-600 text-white border-rose-400 shadow-rose-500/50 animate-basta scale-105'
                  : 'bg-gradient-to-tr from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white border-white/40 shadow-rose-500/30 hover:scale-102'
              }`}
            >
              <Volume2 className="w-8 h-8 mb-1" />
              <span>¡BASTA!</span>
              <span className="text-[10px] font-medium tracking-normal opacity-90 mt-1">
                Toca para romper el bucle
              </span>
            </button>
          </div>

          {bastaTriggered && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 animate-fade-in font-medium">
              ⚡ <strong>Comando neuronal activado:</strong> La interrupción súbita corta el secuestro de la amígdala. Ahora redirige tu atención visual a tu entorno inmediato.
            </div>
          )}

          {/* 2 Alternate Seligman Techniques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Technique 1: Thought Deferral */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>1. Aplazamiento de la Preocupación</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Asigna una cita específica en tu agenda para pensar en este problema. Si viene antes, di: &ldquo;Pensaré en esto a las {deferredTime}&rdquo;.
              </p>
              <input
                type="text"
                value={deferredTime}
                onChange={(e) => setDeferredTime(e.target.value)}
                placeholder="Ej. Mañana a las 10:30 am"
                className="mt-2 w-full px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Technique 2: 3-3-3 Grounding */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>2. Anclaje Sensorial Inmediato</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Nombra en voz alta 3 objetos que veas alrededor, 3 sonidos que escuches y mueve 3 partes de tu cuerpo (dedos, hombros, cuello).
              </p>
              <div className="mt-2 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <span>Atención plena anclada</span>
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Close & Continue */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold text-sm transition"
            >
              Listo, regresar con la mente despejada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
