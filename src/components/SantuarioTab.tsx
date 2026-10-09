import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Smile, 
  Heart, 
  BookOpen, 
  Brain, 
  Wind,
  CheckCircle2,
  Calendar,
  Feather
} from 'lucide-react';
import { MoodCheckIn } from '../types';
import { DAILY_REFLECTIONS } from '../data/initialData';
import { sounds } from '../utils/audio';

interface SantuarioTabProps {
  onGoToGym: () => void;
  onGoToWiki: () => void;
  onSaveMoodCheckIn: (checkIn: MoodCheckIn) => void;
  recentMoods: MoodCheckIn[];
}

export const SantuarioTab: React.FC<SantuarioTabProps> = ({
  onGoToGym,
  onGoToWiki,
  onSaveMoodCheckIn,
  recentMoods,
}) => {
  const [moodScore, setMoodScore] = useState<number>(7);
  const [moodEnergy, setMoodEnergy] = useState<MoodCheckIn['energy']>('sereno');
  const [moodNote, setMoodNote] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Daily reflection index based on day of month
  const todayReflection = DAILY_REFLECTIONS[new Date().getDate() % DAILY_REFLECTIONS.length];

  const handleSaveMood = () => {
    sounds.playBambooChime();
    const newCheckIn: MoodCheckIn = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      score: moodScore,
      energy: moodEnergy,
      note: moodNote.trim() || undefined,
    };
    onSaveMoodCheckIn(newCheckIn);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  // Soft color feedback based on score
  const getMoodColorFeedback = (score: number) => {
    if (score <= 3) return { text: '#8C5A5A', label: 'Sensible / Necesito reposo y amabilidad', bg: 'bg-[#F2E8E8]' };
    if (score <= 6) return { text: '#C86D51', label: 'Equilibrado / Observando con calma', bg: 'bg-[#F6EEEA]' };
    if (score <= 8) return { text: '#2E5A44', label: 'Sereno / Con presencia y claridad', bg: 'bg-[#EAEFEA]' };
    return { text: '#1E4432', label: 'Vigoroso / Con resiliencia y plenitud', bg: 'bg-[#E4ECE5]' };
  };

  const feedback = getMoodColorFeedback(moodScore);

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Gentle Hero Sanctuary Card */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#F3EEE7] border border-[#E6DFD5] p-8 sm:p-11 shadow-tonal">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5A44] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#2E5A44]" />
            <span>Santuario de Calma & Claridad Cognitiva</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#333E38] leading-tight text-balance">
            Bienvenido a tu espacio de tranquilidad cognitiva.
          </h1>

          <p className="mt-4 text-[#55635C] text-sm sm:text-base leading-relaxed">
            Aquí no practicamos la positividad tóxica ni exigimos sonrisas forzadas. 
            Este es un refugio para pausar el ruido, observar los contratiempos con compasión y 
            desarmar las trampas del pesimismo automático con la exactitud de los hechos.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onGoToGym}
              className="px-6 py-3.5 rounded-2xl bg-[#2E5A44] hover:bg-[#244836] active:bg-[#1C3A2B] text-[#FBF9F5] text-xs sm:text-sm font-semibold tracking-wide transition shadow-tonal-sm flex items-center gap-2.5"
            >
              <span>Registrar un Contratiempo (ABCDE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToWiki}
              className="px-5 py-3.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#EAE4DB] text-[#333E38] text-xs sm:text-sm font-medium transition border border-[#E6DFD5]"
            >
              Explorar la Ciencia (Wiki)
            </button>
          </div>
        </div>

        {/* Ambient Botanical Watermark in lower right */}
        <div className="absolute -bottom-8 -right-8 w-64 h-64 text-[#2E5A44]/5 pointer-events-none select-none">
          <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
            <path d="M100 20 C60 60 40 100 40 140 C40 180 80 180 100 180 C120 180 160 180 160 140 C160 100 140 60 100 20 Z" />
          </svg>
        </div>
      </div>

      {/* Mood & Energy Check-in Widget */}
      <section className="bg-[#F3EEE7] rounded-[1.75rem] p-7 sm:p-9 border border-[#E6DFD5] shadow-tonal space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
              Pausa de Conexión Interior
            </div>
            <h2 className="font-serif text-2xl text-[#333E38] mt-0.5">
              ¿Cómo está tu mente y energía hoy?
            </h2>
            <p className="text-xs text-[#647069] mt-1">
              Desliza suavemente para registrar tu estado de serenidad actual sin juzgarlo.
            </p>
          </div>

          <div className="text-right">
            <span className="font-serif text-3xl font-normal text-[#2E5A44] tabular-nums">
              {moodScore}
            </span>
            <span className="text-xs text-[#647069]"> / 10</span>
          </div>
        </div>

        {/* Dynamic Color Feedback Bar */}
        <div className="space-y-4">
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={moodScore}
            onChange={(e) => setMoodScore(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer"
          />

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#647069]">1 (Inquietud / Tensión)</span>
            <span 
              className={`px-3 py-1 rounded-xl font-medium text-xs transition-colors ${feedback.bg}`}
              style={{ color: feedback.text }}
            >
              {feedback.label}
            </span>
            <span className="text-[#647069]">10 (Paz profunda)</span>
          </div>
        </div>

        {/* Energy Toggles & Note */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#55635C] mb-2">
              Tono de energía presente:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['calma', 'sereno', 'inquieto', 'agotado'] as const).map((energy) => (
                <button
                  key={energy}
                  type="button"
                  onClick={() => setMoodEnergy(energy)}
                  className={`py-2 px-3 rounded-xl capitalize transition border text-left flex items-center justify-between ${
                    moodEnergy === energy
                      ? 'bg-[#2E5A44] text-[#FBF9F5] border-[#2E5A44] font-semibold'
                      : 'bg-[#FBF9F5] text-[#55635C] border-[#E6DFD5] hover:bg-[#EFE9DF]'
                  }`}
                >
                  <span>{energy}</span>
                  {moodEnergy === energy && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <label className="block text-xs font-medium text-[#55635C] mb-2">
              Breve nota reflexiva (opcional):
            </label>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="¿Qué pensamiento acompaña este momento?..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30 resize-none"
            />
          </div>
        </div>

        {/* Save Check-in Button */}
        <div className="pt-2 flex items-center justify-between border-t border-[#E6DFD5]/80">
          <div className="text-xs text-[#647069]">
            {isSavedRecently ? (
              <span className="text-[#2E5A44] font-medium flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Registrado con serenidad en tu historial local
              </span>
            ) : (
              `${recentMoods.length} registros guardados en tu dispositivo`
            )}
          </div>

          <button
            onClick={handleSaveMood}
            className="px-5 py-2.5 rounded-xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold transition shadow-tonal-sm"
          >
            Guardar Estado de Hoy
          </button>
        </div>
      </section>

      {/* 2 Prominent Quick Actions Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Action 1: Gimnasio ABCDE */}
        <div 
          onClick={onGoToGym}
          className="bg-[#F3EEE7] rounded-[1.75rem] p-7 border border-[#E6DFD5] shadow-tonal hover:border-[#2E5A44]/50 cursor-pointer transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#2E5A44]/10 text-[#2E5A44] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51] mb-1">
              Práctica Guiada
            </div>

            <h3 className="font-serif text-xl text-[#333E38] group-hover:text-[#2E5A44] transition-colors">
              Registrar un Contratiempo (Gimnasio ABCDE)
            </h3>

            <p className="text-xs text-[#647069] mt-2 leading-relaxed">
              Transforma una frustración, rechazo o tropiezo paso a paso con las 4 Cartas de Discusión 
              (Evidencia, Alternativas, Descatastrofización y Utilidad).
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E6DFD5] flex items-center justify-between text-xs font-semibold text-[#2E5A44]">
            <span>Iniciar ejercicio ABCDE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Quick Action 2: Wiki del Optimismo */}
        <div 
          onClick={onGoToWiki}
          className="bg-[#F3EEE7] rounded-[1.75rem] p-7 border border-[#E6DFD5] shadow-tonal hover:border-[#2E5A44]/50 cursor-pointer transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#C86D51]/10 text-[#C86D51] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51] mb-1">
              Base de Sabiduría
            </div>

            <h3 className="font-serif text-xl text-[#333E38] group-hover:text-[#2E5A44] transition-colors">
              Explorar la Ciencia (Wiki del Optimismo)
            </h3>

            <p className="text-xs text-[#647069] mt-2 leading-relaxed">
              Descubre los fundamentos científicos de Martin Seligman: la impotencia aprendida, 
              las 3 dimensiones explicativas y la regla del optimismo flexible.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E6DFD5] flex items-center justify-between text-xs font-semibold text-[#2E5A44]">
            <span>Leer artículos editoriales</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Daily Reflection Card (Seligman Wisdom) */}
      <section className="bg-[#F3EEE7] rounded-[1.75rem] p-7 sm:p-9 border border-[#E6DFD5] shadow-tonal space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5A44]">
          <Feather className="w-4 h-4 text-[#2E5A44]" />
          <span>Reflexión del Día · {todayReflection.concept}</span>
        </div>

        <blockquote className="font-serif text-lg sm:text-xl text-[#333E38] leading-relaxed italic">
          &ldquo;{todayReflection.quote}&rdquo;
        </blockquote>

        <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-1">
          <span className="text-xs font-semibold text-[#C86D51] block">
            Pregunta para tu día:
          </span>
          <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed">
            {todayReflection.prompt}
          </p>
        </div>
      </section>
    </div>
  );
};
