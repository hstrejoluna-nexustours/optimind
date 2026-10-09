import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  Sparkles, 
  Save, 
  Smile, 
  Frown, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Maximize2, 
  UserCheck,
  TrendingDown,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { AbcdeEntry, RefutationalCards } from '../types';
import { DisputationCards } from './DisputationCards';
import { requestOptiMindCoach, CoachResponse } from '../services/optimindApi';
import { sounds } from '../utils/audio';

interface AbcdeWizardProps {
  initialData?: Partial<AbcdeEntry>;
  onSaveEntry: (entry: AbcdeEntry) => void;
  onCancel: () => void;
  onOpenThoughtStopper: () => void;
}

export const AbcdeWizard: React.FC<AbcdeWizardProps> = ({
  initialData,
  onSaveEntry,
  onCancel,
  onOpenThoughtStopper,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<AbcdeEntry['category']>(initialData?.category || 'trabajo');
  
  // A: Adversity
  const [adversity, setAdversity] = useState(initialData?.adversity || '');
  
  // B: Belief & 3 classifications
  const [belief, setBelief] = useState(initialData?.belief || '');
  const [permanent, setPermanent] = useState<boolean>(initialData?.classifications?.permanent ?? true);
  const [universal, setUniversal] = useState<boolean>(initialData?.classifications?.universal ?? true);
  const [internal, setInternal] = useState<boolean>(initialData?.classifications?.internal ?? true);

  // C: Consequences
  const [intensityC, setIntensityC] = useState<number>(initialData?.consequences?.intensity ?? 7);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    initialData?.consequences?.emotions || ['Frustración', 'Ansiedad']
  );
  const [behavioralImpact, setBehavioralImpact] = useState<string>(
    initialData?.consequences?.behavioralImpact || 'Rumiación continua y ganas de abandonar el esfuerzo.'
  );

  // D: Disputation (4 Cards)
  const [refutations, setRefutations] = useState<RefutationalCards>(
    initialData?.refutations || {
      evidence: '',
      alternatives: '',
      decatastrophizing: '',
      utility: '',
    }
  );

  // E: Energization
  const [intensityE, setIntensityE] = useState<number>(initialData?.energization?.newIntensity ?? 3);
  const [newBelief, setNewBelief] = useState(initialData?.energization?.newBelief || '');
  const [actionPlan, setActionPlan] = useState(
    initialData?.energization?.actionPlan || '1) Dar un paseo de 10 minutos para calmar el sistema nervioso.\n2) Ejecutar una micro-tarea concreta de 15 minutos.'
  );
  const [costOfFailure, setCostOfFailure] = useState<'low' | 'high' | 'moderate'>(initialData?.costOfFailure || 'low');

  // AI Coaching feedback state
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [coachAnalysis, setCoachAnalysis] = useState<CoachResponse['analysis'] | null>(null);

  // Quick preset adversity suggestions
  const presetAdversities = [
    { title: 'Rechazo de propuesta laboral', text: 'Mi propuesta fue pospuesta en la junta directiva por recortes de presupuesto.' },
    { title: 'Dificultad en entrenamiento', text: 'Esta semana solo pude entrenar 1 día debido a horas extras en el trabajo.' },
    { title: 'Discusión interpersonal', text: 'Tuve una conversación tensa con un colega durante la entrega de un proyecto.' },
    { title: 'Error en entrega de informe', text: 'Envié un reporte financiero con un error en una de las fórmulas de cálculo.' }
  ];

  // Emotion options
  const emotionOptions = [
    'Tristeza', 'Ansiedad', 'Rabia / Enojo', 'Apatía / Pasividad', 
    'Culpa', 'Desesperanza', 'Frustración', 'Vergüenza'
  ];

  const handleToggleEmotion = (emo: string) => {
    if (selectedEmotions.includes(emo)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emo));
    } else {
      setSelectedEmotions([...selectedEmotions, emo]);
    }
  };

  // Consult OptiMind Coach
  const handleConsultCoach = async () => {
    if (!belief.trim()) return;
    setIsLoadingCoach(true);
    try {
      const res = await requestOptiMindCoach({
        adversity,
        belief,
        classifications: { permanent, universal, internal },
        consequences: { intensity: intensityC, emotions: selectedEmotions, behavioralImpact },
        costOfFailure,
      });
      if (res && res.analysis) {
        setCoachAnalysis(res.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCoach(false);
    }
  };

  // Ask AI prompt for specific disputation card
  const handleAskCardPrompt = async (cardType: keyof RefutationalCards) => {
    setIsLoadingCoach(true);
    try {
      const res = await requestOptiMindCoach({
        adversity,
        belief,
        classifications: { permanent, universal, internal },
        costOfFailure,
      });
      if (res?.analysis?.suggestedRefutations) {
        const suggestions = res.analysis.suggestedRefutations[cardType];
        if (suggestions && suggestions.length > 0) {
          const joined = suggestions.join('\n\n• ');
          setRefutations(prev => ({
            ...prev,
            [cardType]: prev[cardType] ? `${prev[cardType]}\n\n• ${joined}` : `• ${joined}`
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCoach(false);
    }
  };

  // Audit adversity for judgmental phrases
  const hasSubjectiveJudgments = () => {
    const lower = adversity.toLowerCase();
    return lower.includes('soy un') || lower.includes('por mi culpa') || lower.includes('inútil') || lower.includes('arruiné todo');
  };

  const sanitizeAdversity = () => {
    let clean = adversity
      .replace(/por mi culpa/gi, 'durante la ejecución')
      .replace(/arruiné todo/gi, 'se presentó una dificultad')
      .replace(/soy un inútil/gi, '');
    setAdversity(clean.trim());
  };

  const handleSave = () => {
    sounds.playSuccessChime();
    const entry: AbcdeEntry = {
      id: initialData?.id || `entry-${Date.now()}`,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      title: title || (adversity ? adversity.slice(0, 45) + '...' : 'Entrenamiento ABCDE'),
      category,
      adversity: adversity || 'Sin descripción de adversidad',
      belief: belief || 'Sin creencia registrada',
      classifications: { permanent, universal, internal },
      consequences: {
        intensity: intensityC,
        emotions: selectedEmotions,
        behavioralImpact,
      },
      refutations,
      energization: {
        newIntensity: intensityE,
        newBelief: newBelief || 'He reformulado esta creencia hacia factores específicos y temporales.',
        actionPlan,
      },
      costOfFailure,
      aiFeedback: coachAnalysis ? {
        tutorNote: coachAnalysis.tutorNote,
        adversityAudit: coachAnalysis.adversityAudit,
        flexibleRule: coachAnalysis.flexibleRule,
      } : undefined,
    };
    onSaveEntry(entry);
  };

  const stepsHeader = [
    { num: 1, letter: 'A', name: 'Adversidad', desc: 'Hecho objetivo' },
    { num: 2, letter: 'B', name: 'Creencia', desc: 'Diálogo automático' },
    { num: 3, letter: 'C', name: 'Consecuencias', desc: 'Emociones y acción' },
    { num: 4, letter: 'D', name: 'Discusión', desc: 'Las 4 Cartas' },
    { num: 5, letter: 'E', name: 'Energización', desc: 'Reevaluación y plan' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Protocolo Científico ABCDE
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Paso {currentStep} de 5
            </span>
          </div>

          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            Salir al Panel
          </button>
        </div>

        {/* Step Indicator Progress Pills */}
        <div className="grid grid-cols-5 gap-2">
          {stepsHeader.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num as any)}
                className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-500/20'
                    : isCompleted
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-sm">{s.letter}</span>
                  {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />}
                </div>
                <span className="text-[10px] font-semibold truncate hidden sm:block">
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: ADVERSITY (A) */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
              <span>Paso 1</span> • <span>Adversidad (A)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Describe el hecho o contratiempo objetivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              <strong>Regla de Oro de Seligman:</strong> La adversidad debe registrarse de forma neutra y fáctica, 
              tal como la filmaría una cámara de video. No incluyas interpretaciones ni juicios sobre tu valía.
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Plantillas de práctica rápida:
            </label>
            <div className="flex flex-wrap gap-2">
              {presetAdversities.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(preset.title);
                    setAdversity(preset.text);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Título del evento:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Rechazo de propuesta en el trabajo"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Categoría:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="trabajo">Trabajo / Carrera</option>
                <option value="relaciones">Relaciones / Social</option>
                <option value="salud_habitos">Salud y Hábitos</option>
                <option value="estudio">Estudios / Aprendizaje</option>
                <option value="finanzas">Finanzas</option>
                <option value="personal">Personal</option>
              </select>
            </div>
          </div>

          {/* Adversity Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ¿Qué ocurrió exactamente? (Solo los hechos):
            </label>
            <textarea
              value={adversity}
              onChange={(e) => setAdversity(e.target.value)}
              rows={4}
              placeholder="Ejemplo: Ayer en la reunión de las 10:00 el cliente expresó dudas sobre el tiempo de entrega y solicitó revisar otras opciones antes de firmar el contrato."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          {/* Judgments Detector Warning */}
          {hasSubjectiveJudgments() && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Alerta de Objetividad:</strong> Detectamos palabras de autojuicio o culpa en tu descripción (&ldquo;por mi culpa&rdquo;, &ldquo;inútil&rdquo;, etc.). En el modelo ABCDE, esos juicios pertenecen al <strong>Paso B (Creencia)</strong>, no a los hechos de la Adversidad.
                </div>
              </div>
              <button
                type="button"
                onClick={sanitizeAdversity}
                className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-bold whitespace-nowrap text-[11px] hover:bg-amber-300 transition"
              >
                Limpiar hechos
              </button>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!adversity.trim()}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition shadow-md shadow-teal-600/20 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
            >
              <span>Continuar al Paso B (Creencia)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BELIEF (B) */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
              <span>Paso 2</span> • <span>Creencia Automática (B)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Registra tu diálogo interno inmediato
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              ¿Qué te dijiste a ti mismo justo después del contratiempo? Escribe tu pensamiento espontáneo sin censura.
            </p>
          </div>

          {/* Reference Adversity reminder */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200">Hecho detonante (A):</span> {adversity}
          </div>

          {/* Belief input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tu creencia automática o pensamiento pesimista:
            </label>
            <textarea
              value={belief}
              onChange={(e) => setBelief(e.target.value)}
              rows={3}
              placeholder="Ejemplo: Nunca voy a poder cerrar un acuerdo importante. Siempre arruino los momentos clave. No tengo madera para este negocio..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          {/* 3 Interactive Classification Toggles */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Clasifica tu pensamiento en las 3 dimensiones de Martin Seligman:</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evalúa si la explicación que te diste cae en los sesgos pesimistas que inducen indefensión.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Permanence Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">1. ¿Es Permanente?</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ¿Usa palabras como &ldquo;siempre&rdquo;, &ldquo;nunca&rdquo;, &ldquo;jamás&rdquo; en lugar de &ldquo;esta vez&rdquo;?
                </p>
                <div className="flex rounded-xl p-1 bg-slate-200/60 dark:bg-slate-900 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPermanent(true)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      permanent
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Sí (Permanente)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermanent(false)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      !permanent
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    No (Temporal)
                  </button>
                </div>
              </div>

              {/* 2. Pervasiveness Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-xs font-bold">2. ¿Es Universal?</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ¿Contagia &ldquo;todo en mi vida&rdquo; o solo afecta a este proyecto/área específica?
                </p>
                <div className="flex rounded-xl p-1 bg-slate-200/60 dark:bg-slate-900 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setUniversal(true)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      universal
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Sí (Universal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUniversal(false)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      !universal
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    No (Específico)
                  </button>
                </div>
              </div>

              {/* 3. Personalization Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">3. ¿Es Interno Destructivo?</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ¿Te juzgas como una persona defectuosa (&ldquo;soy un inútil&rdquo;) o evalúas circunstancias?
                </p>
                <div className="flex rounded-xl p-1 bg-slate-200/60 dark:bg-slate-900 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setInternal(true)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      internal
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Sí (Interno)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInternal(false)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      !internal
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    No (Circunstancial)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Coach Button & Insight Box */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleConsultCoach}
              disabled={isLoadingCoach || !belief.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>{isLoadingCoach ? 'Analizando con OptiMind...' : 'Consultar Diagnóstico a OptiMind'}</span>
            </button>

            {coachAnalysis && (
              <div className="mt-3 p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-200 animate-fade-in space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{coachAnalysis.tutorNote}</span>
                </div>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  {coachAnalysis.diagnostic.summary}
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a A</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={!belief.trim()}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition shadow-md shadow-teal-600/20 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
            >
              <span>Continuar al Paso C (Consecuencias)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONSEQUENCES (C) */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
              <span>Paso 3</span> • <span>Consecuencias (C)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Emociones e impacto conductual
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Las creencias determinan las consecuencias. ¿Qué emociones surgieron tras pensar esto y qué hiciste?
            </p>
          </div>

          {/* Intensity Slider (1 to 10) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Intensidad Emocional Inicial:
              </span>
              <div className="flex items-center gap-2">
                {intensityC >= 7 ? (
                  <Frown className="w-5 h-5 text-rose-500" />
                ) : (
                  <Smile className="w-5 h-5 text-teal-500" />
                )}
                <span className="text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums">
                  {intensityC} / 10
                </span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={intensityC}
              onChange={(e) => setIntensityC(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>1 (Leve molestia)</span>
              <span>5 (Moderado)</span>
              <span>10 (Parálisis / Desborde)</span>
            </div>
          </div>

          {/* Primary Emotion Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Emociones Primarias Experimentadas:
            </label>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map((emo) => {
                const isSelected = selectedEmotions.includes(emo);
                return (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => handleToggleEmotion(emo)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {emo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Behavioral Impact Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Reacción Conductual (¿Qué hiciste o dejaste de hacer?):
            </label>
            <textarea
              value={behavioralImpact}
              onChange={(e) => setBehavioralImpact(e.target.value)}
              rows={3}
              placeholder="Ejemplo: Cancelé mis llamadas de la tarde, me aislé y pasé 2 horas rumiando el rechazo en lugar de corregir la propuesta."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          {/* Quick thought-stopper shout out */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>¿Sientes que este pensamiento sigue dando vueltas sin control ahora mismo?</span>
            </div>
            <button
              type="button"
              onClick={onOpenThoughtStopper}
              className="px-3 py-1 rounded-lg bg-amber-200 dark:bg-amber-800 font-bold text-amber-950 dark:text-amber-100 hover:bg-amber-300 transition text-[11px] whitespace-nowrap"
            >
              Activar ¡BASTA!
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a B</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition shadow-md shadow-teal-600/20 flex items-center gap-2"
            >
              <span>Continuar al Paso D (Las 4 Cartas)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DISPUTATION (D) */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          <DisputationCards
            belief={belief}
            refutations={refutations}
            onChangeRefutations={setRefutations}
            onAskAiPrompt={handleAskCardPrompt}
            isLoadingAi={isLoadingCoach}
          />

          <div className="flex justify-between pt-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a C</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition shadow-md shadow-teal-600/20 flex items-center gap-2"
            >
              <span>Continuar al Paso E (Energización)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: ENERGIZATION (E) */}
      {currentStep === 5 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <span>Paso 5</span> • <span>Energización (E)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Reevaluación del estado y plan de acción
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Tras haber disputado activamente tu creencia pesimista, observa cómo se transforma tu estado emocional y define tus próximas micro-acciones.
            </p>
          </div>

          {/* Visual Delta Chart: C vs E */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Comparativa de Intensidad Emocional
              </span>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-rose-600 dark:text-rose-400">Antes: {intensityC}/10</span>
                <span>→</span>
                <span className="text-emerald-600 dark:text-emerald-400">Ahora: {intensityE}/10</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                  -{Math.max(0, intensityC - intensityE)} pts (Alivio)
                </span>
              </div>
            </div>

            {/* Visual comparative bar */}
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Intensidad en C (Pensamiento Pesimista)</span>
                  <span className="font-bold text-rose-500">{intensityC * 10}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${intensityC * 10}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Intensidad en E (Tras Discusión con 4 Cartas)</span>
                  <span className="font-bold text-emerald-500">{intensityE * 10}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${intensityE * 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Slider to re-rate */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Re-califica tu intensidad emocional ahora mismo:
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={intensityE}
                onChange={(e) => setIntensityE(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* New Re-framed Belief */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nueva Creencia Re-estructurada (Objetiva, Temporal y Específica):
            </label>
            <textarea
              value={newBelief}
              onChange={(e) => setNewBelief(e.target.value)}
              rows={2}
              placeholder="Ejemplo: Este aplazamiento es un problema presupuestario puntual y técnico, no un juicio sobre mi valor profesional. Puedo modular el plan en fases asimilables."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          {/* Action Plan */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Plan de Micro-Acciones Inmediatas (Próximas 24 horas):
            </label>
            <textarea
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              rows={3}
              placeholder="1) Enviar un correo pidiendo retroalimentación detallada antes de las 12:00.\n2) Desglosar la propuesta en 3 fases.\n3) Repasar la presentación con un compañero."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          {/* Cost of Failure selector */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Regla del Optimismo Flexible: Costo del fracaso para esta situación
              </span>
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                {costOfFailure === 'high' ? 'Pesimismo Prudente recomendado' : 'Optimismo Aprendido recomendado'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCostOfFailure('low')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                  costOfFailure === 'low'
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                Costo Bajo (Social / Práctica)
              </button>
              <button
                type="button"
                onClick={() => setCostOfFailure('moderate')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                  costOfFailure === 'moderate'
                    ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                Costo Moderado
              </button>
              <button
                type="button"
                onClick={() => setCostOfFailure('high')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                  costOfFailure === 'high'
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-400'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                Costo Alto (Riesgo grave)
              </button>
            </div>
          </div>

          {/* Finish & Save */}
          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a D</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-extrabold text-sm transition shadow-lg shadow-teal-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en Diario de Resiliencia</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
