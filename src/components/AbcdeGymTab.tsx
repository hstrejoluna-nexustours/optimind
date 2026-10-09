import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Save, 
  Smile, 
  Frown, 
  HelpCircle,
  Clock,
  Maximize2,
  Heart,
  TrendingDown,
  RotateCcw,
  BookOpen,
  Volume2,
  Feather,
  Shuffle
} from 'lucide-react';
import { AbcdeEntry, RefutationalCards, PlanTier } from '../types';
import { requestOptiMindCoach, CoachResponse } from '../services/optimindApi';
import { sounds } from '../utils/audio';

interface AbcdeGymTabProps {
  initialData?: Partial<AbcdeEntry>;
  onSaveEntry: (entry: AbcdeEntry) => void;
  onOpenThoughtStopper: () => void;
  savedEntries: AbcdeEntry[];
  onSelectSavedEntry: (entry: AbcdeEntry) => void;
  currentTier?: PlanTier;
  exercisesUsedThisMonth?: number;
  monthlyLimit?: number;
  bonusCredits?: number;
  onTriggerUpgradeModal?: (reason: 'limit_reached' | 'pdf_export' | 'pro_feature' | 'ai_deep') => void;
  onOpenClinicalReport?: () => void;
}

export const AbcdeGymTab: React.FC<AbcdeGymTabProps> = ({
  initialData,
  onSaveEntry,
  onOpenThoughtStopper,
  savedEntries,
  onSelectSavedEntry,
  currentTier = 'reverse_trial',
  exercisesUsedThisMonth = 1,
  monthlyLimit = 3,
  bonusCredits = 0,
  onTriggerUpgradeModal,
  onOpenClinicalReport,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<AbcdeEntry['category']>(initialData?.category || 'trabajo');
  
  // Step 1: A (Adversidad)
  const [adversity, setAdversity] = useState(initialData?.adversity || '');
  
  // Step 2: B (Creencia) & 3 Toggles
  const [belief, setBelief] = useState(initialData?.belief || '');
  const [permanent, setPermanent] = useState<boolean>(initialData?.classifications?.permanent ?? true);
  const [universal, setUniversal] = useState<boolean>(initialData?.classifications?.universal ?? true);
  const [internal, setInternal] = useState<boolean>(initialData?.classifications?.internal ?? true);

  // Step 3: C (Consecuencias)
  const [intensityC, setIntensityC] = useState<number>(initialData?.consequences?.intensity ?? 8);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    initialData?.consequences?.emotions || ['Frustración', 'Inquietud']
  );
  const [behavioralImpact, setBehavioralImpact] = useState<string>(
    initialData?.consequences?.behavioralImpact || 'Me sentí desanimado y con ganas de postergar mis tareas.'
  );

  // Step 4: D (Discusión - Las 4 Cartas)
  const [refutations, setRefutations] = useState<RefutationalCards>(
    initialData?.refutations || {
      evidence: '',
      alternatives: '',
      decatastrophizing: '',
      utility: '',
    }
  );
  const [activeDCard, setActiveDCard] = useState<'evidence' | 'alternatives' | 'decatastrophizing' | 'utility'>('evidence');

  // Step 5: E (Energización)
  const [intensityE, setIntensityE] = useState<number>(initialData?.energization?.newIntensity ?? 3);
  const [newBelief, setNewBelief] = useState(initialData?.energization?.newBelief || '');
  const [actionPlan, setActionPlan] = useState(
    initialData?.energization?.actionPlan || '1) Tomar un descanso de 15 minutos.\n2) Retomar con una tarea concreta y alcanzable.'
  );
  const [costOfFailure, setCostOfFailure] = useState<'low' | 'high' | 'moderate'>(initialData?.costOfFailure || 'low');

  // AI Guidance state
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [coachAnalysis, setCoachAnalysis] = useState<CoachResponse['analysis'] | null>(null);

  // Pre-load Seligman Example for immediate testing
  const handleLoadPreloadedExample = () => {
    sounds.playBambooChime();
    setTitle('Rechazo de propuesta técnica ante la directiva');
    setCategory('trabajo');
    setAdversity('Ayer presenté el plan de modernización de software ante el comité directivo. El director financiero cuestionó el presupuesto y decidieron aplazar la decisión hasta el próximo trimestre.');
    setBelief('Nunca van a valorar mis iniciativas. Siempre que propongo algo importante me bloquean. Soy un mal comunicador y mi carrera está estancada.');
    setPermanent(true);
    setUniversal(true);
    setInternal(true);
    setIntensityC(8);
    setSelectedEmotions(['Frustración', 'Desánimo', 'Inquietud']);
    setBehavioralImpact('Cancelé mis reuniones de la tarde, evité hablar con el equipo y me fui temprano a casa rumiando el rechazo.');
    setRefutations({
      evidence: 'No es verdad que "siempre" me bloquean: hace 3 meses aprobaron la migración y felicitaron la auditoría. El director cuestionó el flujo de caja del Q3, no mi capacidad técnica general.',
      alternatives: '1) La empresa enfrenta recortes por la subida de tipos de interés. 2) Mi propuesta era financieramente densa; debí presentar un desglose por fases en lugar de una inversión global.',
      decatastrophizing: 'El peor escenario es esperar 90 días o reestructurar el proyecto en tres entregas más pequeñas. El proyecto no se canceló; nadie cuestionó mi puesto ni mi integridad profesional.',
      utility: 'Pensar que "mi carrera está estancada" solo me paraliza y desanima al equipo. Aplico una pausa consciente para soltar la rumiación y programo 30 minutos con finanzas el jueves para revisar los números.',
    });
    setIntensityE(3);
    setNewBelief('Este aplazamiento es un problema presupuestario puntual y técnico, no un juicio sobre mi valor. Puedo modular el plan en fases asimilables.');
    setActionPlan('1) Pedir a finanzas los lineamientos presupuestarios del Q4 mañana a las 10:00.\n2) Rediseñar la propuesta en 3 hitos escalables.\n3) Agradecer la retroalimentación para involucrarlos como aliados.');
    setCostOfFailure('low');
  };

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

  const handleSave = () => {
    // If user is on Free plan and has reached monthly limit on new entry
    const totalAllowed = monthlyLimit + bonusCredits;
    const isNew = !initialData?.id;
    if (currentTier === 'free' && isNew && exercisesUsedThisMonth >= totalAllowed) {
      if (onTriggerUpgradeModal) {
        onTriggerUpgradeModal('limit_reached');
        return;
      }
    }

    sounds.playBambooChime();
    const entry: AbcdeEntry = {
      id: initialData?.id || `entry-${Date.now()}`,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      title: title || (adversity ? adversity.slice(0, 45) + '...' : 'Reflexión ABCDE'),
      category,
      adversity: adversity || 'Sin descripción',
      belief: belief || 'Sin creencia',
      classifications: { permanent, universal, internal },
      consequences: {
        intensity: intensityC,
        emotions: selectedEmotions,
        behavioralImpact,
      },
      refutations,
      energization: {
        newIntensity: intensityE,
        newBelief: newBelief || 'Creencia reestructurada con perspectiva.',
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

  const emotionList = ['Tristeza', 'Inquietud', 'Enojo', 'Apatía', 'Culpa', 'Desánimo', 'Frustración', 'Vergüenza'];

  const toggleEmotion = (emo: string) => {
    if (selectedEmotions.includes(emo)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emo));
    } else {
      setSelectedEmotions([...selectedEmotions, emo]);
    }
  };

  const cards4 = [
    {
      id: 'evidence' as const,
      icon: '🕵️‍♂️',
      title: '1. Evidencia',
      prompt: '🔍 Buscar pruebas reales que desmientan o maticen este pensamiento.',
      guide: '¿Qué hechos concretos contradicen que esto sea definitivo o insuperable?',
      placeholder: 'Ejemplo: Hace dos semanas cerré con éxito un proyecto similar. El problema de hoy fue puntual...',
    },
    {
      id: 'alternatives' as const,
      icon: '🔀',
      title: '2. Alternativas',
      prompt: '🔀 Generar explicaciones específicas, temporales y modificables.',
      guide: '¿Qué otros factores externos (cansancio, tiempo escaso, imprevistos ajenos) intervinieron?',
      placeholder: 'Ejemplo: Estaba agotado tras dormir 4 horas. Además, las instrucciones iniciales fueron difusas...',
    },
    {
      id: 'decatastrophizing' as const,
      icon: '🔍',
      title: '3. Deducciones',
      prompt: '📉 Descatastrofizar: ¿Cuál es el impacto real si esto fuera cierto?',
      guide: 'Aun si el tropiezo ocurrió, ¿es realmente el fin del mundo? ¿Qué recursos tienes?',
      placeholder: 'Ejemplo: En el peor caso pediré una prórroga de dos días. Es incómodo, pero no destruye mi empleo...',
    },
    {
      id: 'utility' as const,
      icon: '🎯',
      title: '4. Utilidad',
      prompt: '⏱️ Evaluar la utilidad de este pensamiento hoy y aplicar distracción si paraliza.',
      guide: '¿Alimentar este pensamiento ahora te da claridad o solo te agota? Elige soltarlo o aplazarlo.',
      placeholder: 'Ejemplo: Pensar en esto a las 11 pm solo me roba el descanso. Elijo soltarlo y actuar mañana a las 10 am...',
    },
  ];

  const currentD = cards4.find(c => c.id === activeDCard)!;

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Banner with Quick Sample Loader */}
      <div className="bg-[#F3EEE7] rounded-[1.75rem] p-7 sm:p-9 border border-[#E6DFD5] shadow-tonal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5A44] mb-1">
            <span>Metodología ABCDE de Seligman</span>
            <span aria-hidden="true">·</span>
            <span>Divulgación Progresiva</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#333E38]">
            Gimnasio de Optimismo ABCDE
          </h1>

          <p className="text-xs sm:text-sm text-[#55635C] mt-1">
            Trabaja un contratiempo paso a paso, manteniendo el foco en una sola dimensión cognitiva a la vez.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadPreloadedExample}
          className="px-4 py-2.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#EAE4DB] text-[#2E5A44] border border-[#2E5A44]/30 text-xs font-semibold transition flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Shuffle className="w-4 h-4 text-[#C86D51]" />
          <span>Cargar Ejemplo Predefinido</span>
        </button>
      </div>

      {/* Step Indicator Pills */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[
          { num: 1, letter: 'A', label: 'Adversidad' },
          { num: 2, letter: 'B', label: 'Creencia' },
          { num: 3, letter: 'C', label: 'Consecuencia' },
          { num: 4, letter: 'D', label: 'Discusión' },
          { num: 5, letter: 'E', label: 'Energización' },
        ].map((s) => {
          const isActive = currentStep === s.num;
          const isCompleted = currentStep > s.num;

          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num as any)}
              className={`p-3 rounded-2xl text-center transition-all border ${
                isActive
                  ? 'bg-[#2E5A44] text-[#FBF9F5] border-[#2E5A44] font-semibold shadow-tonal-sm'
                  : isCompleted
                  ? 'bg-[#EAEFEA] text-[#2E5A44] border-[#2E5A44]/20'
                  : 'bg-[#F3EEE7] text-[#647069] border-[#E6DFD5]'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="font-serif text-base">{s.letter}</span>
                {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-[10px] hidden sm:block truncate mt-0.5">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progressive Disclosure Card Container */}
      <div className="bg-[#F3EEE7] rounded-[1.75rem] p-7 sm:p-10 border border-[#E6DFD5] shadow-tonal space-y-6">
        {/* STEP 1: ADVERSIDAD (A) */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                Paso 1 de 5 · Hecho Fáctico
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#333E38] mt-1">
                Adversidad (A): ¿Qué ocurrió de forma objetiva?
              </h2>
              <p className="text-xs sm:text-sm text-[#55635C] mt-2 leading-relaxed">
                Describe únicamente los hechos observables (qué, cuándo y quién). 
                Evita emitir juicios morales sobre tu valía o atribuir intenciones ocultas.
              </p>
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-[#55635C]">
                  Título descriptivo:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Rechazo de propuesta en la junta"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55635C]">
                  Categoría:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30"
                >
                  <option value="trabajo">Trabajo / Carrera</option>
                  <option value="relaciones">Relaciones</option>
                  <option value="salud_habitos">Salud y Hábitos</option>
                  <option value="estudio">Aprendizaje</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="personal">Vida Personal</option>
                </select>
              </div>
            </div>

            {/* Adversity Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#55635C]">
                Descripción del evento objetivo:
              </label>
              <textarea
                value={adversity}
                onChange={(e) => setAdversity(e.target.value)}
                rows={4}
                placeholder="Ejemplo: Ayer en la reunión de las 10:00 el cliente expresó dudas sobre los plazos y solicitó revisar otras opciones antes de firmar..."
                className="w-full px-4 py-3 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E6DFD5]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!adversity.trim()}
                className="px-6 py-3 rounded-2xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold tracking-wide transition shadow-tonal-sm disabled:opacity-40 flex items-center gap-2"
              >
                <span>Avanzar al Paso B (Creencia)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CREENCIA (B) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                Paso 2 de 5 · Diálogo Interno
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#333E38] mt-1">
                Creencia (B): ¿Qué te dijiste a ti mismo de inmediato?
              </h2>
              <p className="text-xs sm:text-sm text-[#55635C] mt-2 leading-relaxed">
                Captura tu pensamiento automático espontáneo tal como brotó en tu mente, 
                y luego clasifícalo en las 3 dimensiones de Seligman.
              </p>
            </div>

            {/* Reference to Adversity */}
            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs text-[#55635C]">
              <strong className="text-[#2E5A44]">Hecho desencadenante (A):</strong> {adversity}
            </div>

            {/* Belief input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#55635C]">
                Tu pensamiento pesimista automático:
              </label>
              <textarea
                value={belief}
                onChange={(e) => setBelief(e.target.value)}
                rows={3}
                placeholder="Ejemplo: Siempre arruino los momentos clave. No sirvo para liderar este tipo de proyectos..."
                className="w-full px-4 py-3 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30 leading-relaxed"
              />
            </div>

            {/* 3 Interactive Toggle Chips */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-[#2E5A44]">
                Clasifica tu creencia en las 3 Dimensiones Atributivas:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Permanente? */}
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#333E38]">
                    <Clock className="w-4 h-4 text-[#2E5A44]" />
                    <span>¿Es Permanente?</span>
                  </div>
                  <div className="flex rounded-xl p-1 bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                    <button
                      type="button"
                      onClick={() => setPermanent(true)}
                      className={`flex-1 py-1 rounded-lg transition ${permanent ? 'bg-[#C86D51] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                    >
                      Sí (Siempre)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermanent(false)}
                      className={`flex-1 py-1 rounded-lg transition ${!permanent ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                    >
                      No (Esta vez)
                    </button>
                  </div>
                </div>

                {/* 2. Universal? */}
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#333E38]">
                    <Maximize2 className="w-4 h-4 text-[#2E5A44]" />
                    <span>¿Es Universal?</span>
                  </div>
                  <div className="flex rounded-xl p-1 bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                    <button
                      type="button"
                      onClick={() => setUniversal(true)}
                      className={`flex-1 py-1 rounded-lg transition ${universal ? 'bg-[#C86D51] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                    >
                      Sí (Todo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUniversal(false)}
                      className={`flex-1 py-1 rounded-lg transition ${!universal ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                    >
                      No (Específico)
                    </button>
                  </div>
                </div>

                {/* 3. Interno? */}
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#333E38]">
                    <Heart className="w-4 h-4 text-[#2E5A44]" />
                    <span>¿Es Interno?</span>
                  </div>
                  <div className="flex rounded-xl p-1 bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                    <button
                      type="button"
                      onClick={() => setInternal(true)}
                      className={`flex-1 py-1 rounded-lg transition ${internal ? 'bg-[#C86D51] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                    >
                      Sí (Soy inútil)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInternal(false)}
                      className={`flex-1 py-1 rounded-lg transition ${!internal ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                    >
                      No (Factores)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Advisor Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleConsultCoach}
                disabled={isLoadingCoach || !belief.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBF9F5] hover:bg-[#EAE4DB] border border-[#E6DFD5] text-[#2E5A44] text-xs font-semibold transition"
              >
                <Sparkles className="w-4 h-4 text-[#C86D51]" />
                <span>{isLoadingCoach ? 'Consultando a OptiMind...' : 'Auditar pensamiento con OptiMind'}</span>
              </button>

              {coachAnalysis && (
                <div className="mt-3 p-4 rounded-2xl bg-[#EAEFEA] border border-[#2E5A44]/20 text-xs text-[#2E5A44] space-y-1 animate-fade-in">
                  <div className="font-semibold">{coachAnalysis.tutorNote}</div>
                  <p className="opacity-90">{coachAnalysis.diagnostic.summary}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E6DFD5]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#647069] hover:bg-[#EAE4DB] transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a A</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={!belief.trim()}
                className="px-6 py-3 rounded-2xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold tracking-wide transition shadow-tonal-sm disabled:opacity-40 flex items-center gap-2"
              >
                <span>Avanzar al Paso C (Consecuencia)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONSECUENCIAS (C) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                Paso 3 de 5 · Emociones e Impacto
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#333E38] mt-1">
                Consecuencia (C): ¿Qué sentiste y cómo actuaste?
              </h2>
              <p className="text-xs sm:text-sm text-[#55635C] mt-2 leading-relaxed">
                Nuestras creencias determinan directamente nuestras emociones y conductas. 
                Evalúa la intensidad del malestar inicial.
              </p>
            </div>

            {/* Emotional Intensity Gauge */}
            <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#55635C]">Intensidad emocional inicial (C):</span>
                <span className="font-serif text-lg font-bold text-[#C86D51] tabular-nums">
                  {intensityC} / 10
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={intensityC}
                onChange={(e) => setIntensityC(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#647069]">
                <span>1 (Leve incomodidad)</span>
                <span>5 (Malestar medio)</span>
                <span>10 (Parálisis / Agobio total)</span>
              </div>
            </div>

            {/* Emotion Chips */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#55635C]">
                Emociones primarias experimentadas:
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionList.map((emo) => {
                  const isSelected = selectedEmotions.includes(emo);
                  return (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => toggleEmotion(emo)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                        isSelected
                          ? 'bg-[#C86D51] text-[#FBF9F5] border-[#C86D51]'
                          : 'bg-[#FBF9F5] text-[#55635C] border-[#E6DFD5] hover:bg-[#EAE4DB]'
                      }`}
                    >
                      {emo}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Behavioral Reaction */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#55635C]">
                Reacción conductual (¿Qué hiciste o qué evitaste hacer?):
              </label>
              <textarea
                value={behavioralImpact}
                onChange={(e) => setBehavioralImpact(e.target.value)}
                rows={2}
                placeholder="Ejemplo: Cancelé mis tareas de la tarde, me aislé y pasé dos horas rumiando..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30"
              />
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E6DFD5]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#647069] hover:bg-[#EAE4DB] transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a B</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-2xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold tracking-wide transition shadow-tonal-sm flex items-center gap-2"
              >
                <span>Avanzar al Paso D (Las 4 Cartas)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DISCUSIÓN (D) - THE 4 REFUTATIONAL CARDS */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                Paso 4 de 5 · Las 4 Cartas de Discusión
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#333E38] mt-1">
                Discusión (D): Desafía la creencia pesimista
              </h2>
              <p className="text-xs sm:text-sm text-[#55635C] mt-2 leading-relaxed">
                Disputa activamente la creencia pesimista: 
                <span className="italic font-medium text-[#2E5A44]"> &ldquo;{belief}&rdquo;</span>
              </p>
            </div>

            {/* 4 Cards Carousel / Tab Bar */}
            <div className="flex items-center gap-2 p-1 bg-[#FBF9F5] rounded-2xl border border-[#E6DFD5] overflow-x-auto">
              {cards4.map((card) => {
                const isSelected = activeDCard === card.id;
                const hasValue = refutations[card.id].trim().length > 10;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveDCard(card.id)}
                    className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold shadow-tonal-sm'
                        : 'text-[#647069] hover:text-[#333E38]'
                    }`}
                  >
                    <span>{card.icon}</span>
                    <span>{card.title}</span>
                    {hasValue && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Active Refutation Card Content */}
            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5A44] mb-1">
                  <span>{currentD.icon}</span>
                  <span>{currentD.prompt}</span>
                </div>
                <p className="text-xs text-[#647069] leading-relaxed">
                  {currentD.guide}
                </p>
              </div>

              <textarea
                value={refutations[currentD.id]}
                onChange={(e) => setRefutations({
                  ...refutations,
                  [currentD.id]: e.target.value
                })}
                rows={4}
                placeholder={currentD.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-[#F3EEE7] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30 leading-relaxed"
              />
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E6DFD5]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#647069] hover:bg-[#EAE4DB] transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a C</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 rounded-2xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold tracking-wide transition shadow-tonal-sm flex items-center gap-2"
              >
                <span>Avanzar al Paso E (Energización)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ENERGIZACIÓN (E) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                Paso 5 de 5 · Resolución Activa
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#333E38] mt-1">
                Energización (E): Comprueba el alivio y define el plan
              </h2>
              <p className="text-xs sm:text-sm text-[#55635C] mt-2 leading-relaxed">
                Al desarmar las distorsiones, la energía cognitiva se libera para actuar de manera constructiva.
              </p>
            </div>

            {/* Visual Comparison Chart: Emotion C vs Emotion E */}
            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#333E38]">
                  Evolución Emocional (C vs. E):
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#C86D51] font-bold">Antes (C): {intensityC}/10</span>
                  <span>→</span>
                  <span className="text-[#2E5A44] font-bold">Ahora (E): {intensityE}/10</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#EAEFEA] text-[#2E5A44] font-semibold text-[11px]">
                    -{Math.max(0, intensityC - intensityE)} pts (Alivio)
                  </span>
                </div>
              </div>

              {/* Comparative Visual Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-[#647069] mb-1">
                    <span>Intensidad en C (Pensamiento Pesimista)</span>
                    <span>{intensityC * 10}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#E6DFD5] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#C86D51] rounded-full transition-all duration-500"
                      style={{ width: `${intensityC * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[#647069] mb-1">
                    <span>Intensidad en E (Tras Discusión Racional)</span>
                    <span>{intensityE * 10}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#E6DFD5] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#2E5A44] rounded-full transition-all duration-500"
                      style={{ width: `${intensityE * 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Intensity Re-rating slider */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#55635C] mb-1.5">
                  Re-califica tu intensidad emocional en este momento:
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={intensityE}
                  onChange={(e) => setIntensityE(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Re-framed Belief & Action Plan */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#55635C] mb-1">
                  Nueva Creencia Reestructurada (Temporal, Específica y Factual):
                </label>
                <textarea
                  value={newBelief}
                  onChange={(e) => setNewBelief(e.target.value)}
                  rows={2}
                  placeholder="Ejemplo: Este aplazamiento es un problema de calendario y presupuesto puntual, no un juicio de mi valor profesional..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#55635C] mb-1">
                  Plan de Micro-Acciones Inmediatas (Próximas 24 horas):
                </label>
                <textarea
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  rows={3}
                  placeholder="1) Enviar correo con las precisiones solicitadas.\n2) Dar un paseo de 15 minutos para despejar la mente."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E6DFD5]">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-[#647069] hover:bg-[#EAE4DB] transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a D</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playBambooChime();
                    if (currentTier === 'free') {
                      onTriggerUpgradeModal?.('pdf_export');
                    } else {
                      onOpenClinicalReport?.();
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#FBF9F5] hover:bg-[#EAE4DB] text-[#2E5A44] border border-[#2E5A44]/30 text-xs font-semibold transition flex items-center justify-center gap-2 shadow-tonal-sm"
                >
                  <span>📄 Exportar PDF / Reporte</span>
                  {currentTier === 'free' && (
                    <span className="text-[10px] bg-[#C86D51] text-white px-1.5 py-0.2 rounded font-bold">
                      PRO
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold tracking-wide transition shadow-tonal-sm flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Ejercicio en tu Historial</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Entries Log at the bottom */}
      {savedEntries.length > 0 && (
        <div className="bg-[#F3EEE7] rounded-[1.75rem] p-7 sm:p-8 border border-[#E6DFD5] shadow-tonal space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#333E38]">
              Ejercicios Previos Guardados ({savedEntries.length})
            </h3>
            <span className="text-xs text-[#647069]">Haz clic en cualquiera para revisitarlo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedEntries.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectSavedEntry(entry)}
                className="bg-[#FBF9F5] rounded-2xl p-5 border border-[#E6DFD5] hover:border-[#2E5A44] cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#647069] mb-1.5">
                    <span className="capitalize text-[#C86D51] font-semibold">{entry.category.replace('_', ' ')}</span>
                    <span>{new Date(entry.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <h4 className="font-serif text-base text-[#333E38] line-clamp-1">
                    {entry.title}
                  </h4>

                  <p className="text-xs text-[#55635C] line-clamp-2 mt-1 italic">
                    &ldquo;{entry.belief}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6DFD5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-[#C86D51]">C: {entry.consequences.intensity}</span>
                    <span>→</span>
                    <span className="text-[#2E5A44] font-semibold">E: {entry.energization.newIntensity}</span>
                  </div>

                  <span className="text-[#2E5A44] font-semibold flex items-center gap-1">
                    Ver ejercicio <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
