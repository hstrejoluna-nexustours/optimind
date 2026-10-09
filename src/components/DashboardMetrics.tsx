import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Maximize2, 
  Heart, 
  Wind,
  Compass,
  Smile,
  BookOpen
} from 'lucide-react';
import { ExplanatoryProfile, AbcdeEntry } from '../types';
import { sounds } from '../utils/audio';

interface DashboardMetricsProps {
  profile: ExplanatoryProfile;
  entries: AbcdeEntry[];
  onStartWorkout: () => void;
  onOpenQuiz: () => void;
  onSelectEntry: (entry: AbcdeEntry) => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  profile,
  entries,
  onStartWorkout,
  onOpenQuiz,
  onSelectEntry,
}) => {
  // Breath pacer state (Inhale, Hold, Exhale)
  const [breathPhase, setBreathPhase] = useState<'Inhala serenidad' | 'Sostén con calma' | 'Exhala la tensión'>('Inhala serenidad');

  useEffect(() => {
    const cycle = () => {
      setBreathPhase('Inhala serenidad');
      setTimeout(() => {
        setBreathPhase('Sostén con calma');
        setTimeout(() => {
          setBreathPhase('Exhala la tensión');
        }, 4000);
      }, 4000);
    };

    cycle();
    const interval = setInterval(cycle, 12000);
    return () => clearInterval(interval);
  }, []);

  const avgDrop = entries.length > 0
    ? (entries.reduce((acc, e) => acc + (e.consequences.intensity - e.energization.newIntensity), 0) / entries.length).toFixed(1)
    : '4.2';

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Serene Hero Sanctuary */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#EDE6D8]/80 via-[#F3EFE7] to-[#E5ECE4]/70 dark:from-[#1E2420] dark:via-[#191D1A] dark:to-[#1C211E] p-8 sm:p-12 border border-[#E4DDD0] dark:border-[#2C332D] shadow-sm">
        {/* Soft Organic Ambient Light */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#5F7A61]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-16 w-80 h-80 bg-[#E2B678]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="text-[13px] text-[#556D57] dark:text-[#A4BAA5] font-medium tracking-wide mb-3 flex items-center gap-2">
            <span>Santuario de Claridad Mental</span>
            <span aria-hidden="true">·</span>
            <span>Psicología Positiva de Martin Seligman</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#282D2A] dark:text-[#F0F3EF] leading-tight text-balance">
            Encuentra calma y perspectiva ante lo imprevisto.
          </h1>

          <p className="mt-4 text-[#5A605C] dark:text-[#A7ADA9] text-base leading-relaxed">
            El optimismo consciente no es forzarte a estar alegre; es la serenidad de mirar los hechos 
            con compasión y no convertir un mal día en una sentencia perpetua.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartWorkout}
              className="px-6 py-3.5 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] active:bg-[#334635] text-[#FAF8F5] text-sm font-semibold tracking-wide transition shadow-sm flex items-center gap-2.5"
            >
              <span>Comenzar Nueva Reflexión ABCDE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-5 py-3.5 rounded-2xl bg-white/70 hover:bg-white dark:bg-[#252B27]/80 dark:hover:bg-[#2D342F] text-[#414643] dark:text-[#D5DBD6] text-sm font-medium transition border border-[#DDD6C9] dark:border-[#333C35]"
            >
              Calibrar mi Estilo Explicativo
            </button>
          </div>
        </div>

        {/* Mindful Breathing Pacer Strip */}
        <div className="mt-10 pt-7 border-t border-[#DFD8CB]/80 dark:border-[#2C332D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full bg-[#5F7A61]/20 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-[#5F7A61] animate-breath" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#3B4D3D] dark:text-[#A8BEA7]">
                Pausa de Respiración Consciente
              </div>
              <div className="text-xs text-[#696F6B] dark:text-[#9BA19C]">
                {breathPhase}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#696F6B] dark:text-[#9BA19C]">
            <div>
              <span className="font-semibold text-[#282D2A] dark:text-[#F0F3EF] tabular-nums">{profile.totalWorkouts}</span> reflexiones guiadas
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="font-semibold text-[#4A644C] dark:text-[#A8BEA7] tabular-nums">-{avgDrop} pts</span> de alivio emocional medio
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="font-semibold text-[#282D2A] dark:text-[#F0F3EF] tabular-nums">{profile.resilienceStreak} días</span> de presencia
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Style: 3 Serene Dimensions */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-normal text-[#282D2A] dark:text-[#F0F3EF]">
            Tu Pauta de Pensamiento en 3 Dimensiones
          </h2>
          <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-1">
            Observa con ternura cómo tu mente explica los momentos difíciles y aprende a devolverle flexibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dimension 1: Permanence */}
          <div className="bg-white/80 dark:bg-[#1D221F] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 text-xs text-[#5F7A61] dark:text-[#A8BEA7]">
                <span className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  01. Permanencia
                </span>
                <span className="text-[#727874] dark:text-[#8E9590]">
                  {profile.permanenceScore < 45 ? 'Causa Transitoria' : profile.permanenceScore <= 65 ? 'En Equilibrio' : 'Causa Permanente'}
                </span>
              </div>

              <h3 className="font-serif text-lg text-[#282D2A] dark:text-[#F0F3EF]">
                ¿Temporal o Perpetuo?
              </h3>
              <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1.5 leading-relaxed">
                El desánimo te dice &ldquo;siempre será así&rdquo;. La serenidad reconoce que los contratiempos son olas que pasan (&ldquo;ocurrió esta vez&rdquo;).
              </p>

              {/* Serene Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium text-[#797F7A] dark:text-[#989E99]">
                  <span>Paso transitorio</span>
                  <span className="tabular-nums font-semibold">{profile.permanenceScore}%</span>
                  <span>Sin fin</span>
                </div>
                <div className="w-full h-2 bg-[#EFEAE2] dark:bg-[#282F2A] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 bg-[#5F7A61]"
                    style={{ width: `${Math.max(8, profile.permanenceScore)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F2ECE2] dark:border-[#282E2A] text-[11px] text-[#696F6B] dark:text-[#9BA19C] leading-normal italic">
              &ldquo;Esto también pasará. No hay tormenta que dure cien años.&rdquo;
            </div>
          </div>

          {/* Dimension 2: Pervasiveness */}
          <div className="bg-white/80 dark:bg-[#1D221F] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 text-xs text-[#5F7A61] dark:text-[#A8BEA7]">
                <span className="font-semibold flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4" />
                  02. Amplitud
                </span>
                <span className="text-[#727874] dark:text-[#8E9590]">
                  {profile.pervasivenessScore < 45 ? 'Espacio Específico' : profile.pervasivenessScore <= 65 ? 'En Equilibrio' : 'Contagio Universal'}
                </span>
              </div>

              <h3 className="font-serif text-lg text-[#282D2A] dark:text-[#F0F3EF]">
                ¿Específico o Universal?
              </h3>
              <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1.5 leading-relaxed">
                No permitas que un tropiezo en una sola área contamine toda tu identidad, tus relaciones o tu paz cotidiana.
              </p>

              {/* Serene Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium text-[#797F7A] dark:text-[#989E99]">
                  <span>Circunscrito</span>
                  <span className="tabular-nums font-semibold">{profile.pervasivenessScore}%</span>
                  <span>Toda la vida</span>
                </div>
                <div className="w-full h-2 bg-[#EFEAE2] dark:bg-[#282F2A] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 bg-[#5F7A61]"
                    style={{ width: `${Math.max(8, profile.pervasivenessScore)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F2ECE2] dark:border-[#282E2A] text-[11px] text-[#696F6B] dark:text-[#9BA19C] leading-normal italic">
              &ldquo;Un proyecto falló, pero tu vida y tu capacidad siguen intactas.&rdquo;
            </div>
          </div>

          {/* Dimension 3: Personalization */}
          <div className="bg-white/80 dark:bg-[#1D221F] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 text-xs text-[#5F7A61] dark:text-[#A8BEA7]">
                <span className="font-semibold flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  03. Compasión Serena
                </span>
                <span className="text-[#727874] dark:text-[#8E9590]">
                  {profile.personalizationScore < 45 ? 'Comprensión Múltiple' : profile.personalizationScore <= 65 ? 'En Equilibrio' : 'Autoinculpación'}
                </span>
              </div>

              <h3 className="font-serif text-lg text-[#282D2A] dark:text-[#F0F3EF]">
                ¿Factores o Inutilidad?
              </h3>
              <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1.5 leading-relaxed">
                Asume tu parte constructiva con madurez, pero sin atacarte con dureza interna. Reconoce las condiciones del entorno.
              </p>

              {/* Serene Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium text-[#797F7A] dark:text-[#989E99]">
                  <span>Factores y contexto</span>
                  <span className="tabular-nums font-semibold">{profile.personalizationScore}%</span>
                  <span>Soy un fallo</span>
                </div>
                <div className="w-full h-2 bg-[#EFEAE2] dark:bg-[#282F2A] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 bg-[#5F7A61]"
                    style={{ width: `${Math.max(8, profile.personalizationScore)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F2ECE2] dark:border-[#282E2A] text-[11px] text-[#696F6B] dark:text-[#9BA19C] leading-normal italic">
              &ldquo;Trátate a ti mismo con la misma amabilidad con que tratarías a un buen amigo.&rdquo;
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reflections with warm, gentle tactile design */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-normal text-[#282D2A] dark:text-[#F0F3EF]">
            Reflexiones Recientes en el Santuario
          </h2>
          <span className="text-xs text-[#727874] dark:text-[#8E9590]">
            Toca cualquiera para recordar la perspectiva alcanzada
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.slice(0, 4).map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="bg-white/80 dark:bg-[#1D221F] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#2C332E] hover:border-[#5F7A61]/50 cursor-pointer transition flex flex-col justify-between group shadow-xs hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#727874] dark:text-[#8E9590] mb-2">
                  <span className="capitalize">{entry.category.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(entry.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                </div>

                <h3 className="font-serif text-base text-[#282D2A] dark:text-[#F0F3EF] group-hover:text-[#4A644C] dark:group-hover:text-[#A8BEA7] transition-colors">
                  {entry.title || entry.adversity.slice(0, 55)}
                </h3>

                <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-2 line-clamp-2 italic leading-relaxed">
                  &ldquo;{entry.belief}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F2ECE2] dark:border-[#282E2A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#727874] dark:text-[#8E9590]">
                  <span>Tensión: {entry.consequences.intensity}/10</span>
                  <span>→</span>
                  <span className="text-[#4A644C] dark:text-[#A8BEA7] font-semibold">Calma: {entry.energization.newIntensity}/10</span>
                </div>

                <span className="text-xs font-medium text-[#4A644C] dark:text-[#A8BEA7] group-hover:underline flex items-center gap-1">
                  Abrir reflexión <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
