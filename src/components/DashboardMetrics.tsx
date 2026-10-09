import React from 'react';
import { 
  Clock, 
  Maximize2, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown,
  Activity,
  Layers
} from 'lucide-react';
import { ExplanatoryProfile, AbcdeEntry } from '../types';

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
  // Calculate average emotional intensity drop (C vs E)
  const avgDrop = entries.length > 0
    ? (entries.reduce((acc, e) => acc + (e.consequences.intensity - e.energization.newIntensity), 0) / entries.length).toFixed(1)
    : '4.5';

  const getDimensionStatus = (score: number) => {
    if (score < 40) return { label: 'Estilo Optimista / Resiliente', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200 dark:border-emerald-800' };
    if (score <= 65) return { label: 'Estilo Mixto / Flexible', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/60', border: 'border-amber-200 dark:border-amber-800' };
    return { label: 'Pauta Pesimista Vulnerable', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/60', border: 'border-rose-200 dark:border-rose-800' };
  };

  const permStatus = getDimensionStatus(profile.permanenceScore);
  const pervStatus = getDimensionStatus(profile.pervasivenessScore);
  const personStatus = getDimensionStatus(profile.personalizationScore);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-teal-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Metodología Científica del Dr. Martin Seligman
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Gimnasio de Optimismo Aprendido
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            El optimismo aprendido no es una actitud ingenua ni autoengaño complaciente; es una habilidad cognitiva 
            para auditar y disputar las explicaciones destructivas automáticas que tu cerebro genera ante la adversidad.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onStartWorkout}
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Iniciar Entrenamiento ABCDE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenQuiz}
              className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-sm transition border border-slate-700 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>Calibrar Perfil con Test ASQ</span>
            </button>
          </div>
        </div>

        {/* Quick summary stats in hero */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Entrenamientos Realizados</div>
            <div className="text-xl sm:text-2xl font-black text-teal-300 mt-1">{profile.totalWorkouts}</div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Alivio Emocional Promedio</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-1 flex items-center gap-1">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <span>-{avgDrop} pts</span>
            </div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Racha de Resiliencia</div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">{profile.resilienceStreak} días</div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Enfoque Primario</div>
            <div className="text-sm font-bold text-slate-200 mt-2 truncate">Optimismo Flexible</div>
          </div>
        </div>
      </div>

      {/* Explanatory Style Breakdown Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Tu Pauta Explicativa (Explanatory Style)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluada a través de las 3 dimensiones de Martin Seligman ante contratiempos.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Calculado en tiempo real con tus registros
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Permanence */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/30 transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Clock className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${permStatus.bg} ${permStatus.color} ${permStatus.border}`}>
                {permStatus.label}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              1. Permanencia (Permanence)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ¿La causa es permanente (&quot;siempre/nunca&quot;) o transitoria (&quot;esta vez/últimamente&quot;)?
            </p>

            {/* Visual Gauge Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">Temporal (0%)</span>
                <span className="text-slate-700 dark:text-slate-300">{profile.permanenceScore}%</span>
                <span className="text-rose-600 dark:text-rose-400">Permanente (100%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    profile.permanenceScore > 60 
                      ? 'bg-rose-500' 
                      : profile.permanenceScore > 35 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(8, profile.permanenceScore)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Clave de Seligman:</strong> Las personas resilientes consideran que los eventos negativos tienen causas transitorias y superables.
            </div>
          </div>

          {/* 2. Pervasiveness */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/30 transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Maximize2 className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${pervStatus.bg} ${pervStatus.color} ${pervStatus.border}`}>
                {pervStatus.label}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              2. Amplitud (Pervasiveness)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ¿La causa es universal (&quot;todo me sale mal&quot;) o específica (&quot;este proyecto falló&quot;)?
            </p>

            {/* Visual Gauge Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">Específico (0%)</span>
                <span className="text-slate-700 dark:text-slate-300">{profile.pervasivenessScore}%</span>
                <span className="text-rose-600 dark:text-rose-400">Universal (100%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    profile.pervasivenessScore > 60 
                      ? 'bg-rose-500' 
                      : profile.pervasivenessScore > 35 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(8, profile.pervasivenessScore)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Clave de Seligman:</strong> Aislar el fallo a una sola área previene que el desánimo contamine tu familia, salud o trabajo.
            </div>
          </div>

          {/* 3. Personalization */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/30 transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${personStatus.bg} ${personStatus.color} ${personStatus.border}`}>
                {personStatus.label}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              3. Personalización (Personalization)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ¿Causa interna destructiva (&quot;soy un inútil&quot;) o factores contextuales interactuantes?
            </p>

            {/* Visual Gauge Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">Contextual (0%)</span>
                <span className="text-slate-700 dark:text-slate-300">{profile.personalizationScore}%</span>
                <span className="text-rose-600 dark:text-rose-400">Autoinculpación (100%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    profile.personalizationScore > 60 
                      ? 'bg-rose-500' 
                      : profile.personalizationScore > 35 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(8, profile.personalizationScore)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Clave de Seligman:</strong> No evadas la responsabilidad genuina, pero jamás conviertas un fallo técnico en una condena de tu dignidad como persona.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workouts / Quick Access */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Últimos Entrenamientos Registrados
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Haz clic en cualquiera para examinar la reestructuración completa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.slice(0, 4).map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {entry.category}
                  </span>
                  <span>{new Date(entry.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                  {entry.title || entry.adversity.slice(0, 50)}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 italic">
                  &ldquo;{entry.belief}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-rose-500 font-bold">C: {entry.consequences.intensity}/10</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-emerald-500 font-bold">E: {entry.energization.newIntensity}/10</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    -{entry.consequences.intensity - entry.energization.newIntensity} pts
                  </span>
                </div>
                <span className="text-teal-600 dark:text-teal-400 font-semibold text-xs flex items-center gap-1">
                  Ver detalle <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
