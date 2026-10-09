import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Save, 
  Smile, 
  Heart,
  Wind,
  Clock,
  Maximize2,
  HelpCircle,
  Feather
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
    initialData?.consequences?.emotions || ['Frustración', 'Inquietud']
  );
  const [behavioralImpact, setBehavioralImpact] = useState<string>(
    initialData?.consequences?.behavioralImpact || 'Me sentí desanimado y con ganas de postergar mis tareas.'
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
    initialData?.energization?.actionPlan || '1) Tomar un vaso de agua fresca y respirar hondo durante 5 minutos.\n2) Dar un paso pequeño y alcanzable hoy.'
  );
  const [costOfFailure, setCostOfFailure] = useState<'low' | 'high' | 'moderate'>(initialData?.costOfFailure || 'low');

  // AI Coaching feedback state
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [coachAnalysis, setCoachAnalysis] = useState<CoachResponse['analysis'] | null>(null);

  // Quick preset adversity suggestions
  const presetAdversities = [
    { title: 'Rechazo de propuesta laboral', text: 'Mi propuesta fue pospuesta en la junta directiva por recortes de presupuesto.' },
    { title: 'Dificultad en entrenamiento', text: 'Esta semana solo pude entrenar 1 día debido a horas extras en el trabajo.' },
    { title: 'Desacuerdo interpersonal', text: 'Tuve una conversación tensa con un colega durante la entrega de un proyecto.' },
    { title: 'Detalle omitido en informe', text: 'Envié un reporte financiero con un detalle omitido en una de las notas explicativas.' }
  ];

  // Emotion options
  const emotionOptions = [
    'Tristeza', 'Inquietud / Ansiedad', 'Enojo / Tensión', 'Apatía / Cansancio', 
    'Culpa', 'Desánimo', 'Frustración', 'Vergüenza'
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
      title: title || (adversity ? adversity.slice(0, 45) + '...' : 'Reflexión Serene ABCDE'),
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
    { num: 1, letter: 'A', name: 'Hecho', desc: 'Claridad fáctica' },
    { num: 2, letter: 'B', name: 'Creencia', desc: 'Diálogo espontáneo' },
    { num: 3, letter: 'C', name: 'Emociones', desc: 'Sentir y acoger' },
    { num: 4, letter: 'D', name: 'Perspectiva', desc: 'Las 4 Luces' },
    { num: 5, letter: 'E', name: 'Renovación', desc: 'Calma y micro-pasos' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="bg-white/80 dark:bg-[#1A1F1C] rounded-[2rem] p-6 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium">
            <span>Viaje de Transformación ABCDE</span>
            <span aria-hidden="true">·</span>
            <span>Paso {currentStep} de 5</span>
          </div>

          <button
            onClick={onCancel}
            className="text-xs text-[#727874] hover:text-[#282D2A] dark:hover:text-[#F0F3EF] transition"
          >
            Volver al Santuario
          </button>
        </div>

        {/* Step Indicator Progress Circles */}
        <div className="grid grid-cols-5 gap-2.5">
          {stepsHeader.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num as any)}
                className={`flex flex-col items-center py-2.5 px-2 rounded-2xl text-center transition-all ${
                  isActive
                    ? 'bg-[#4A644C] text-[#FAF8F5] shadow-xs font-semibold'
                    : isCompleted
                    ? 'bg-[#5F7A61]/15 text-[#3D553F] dark:text-[#A8BEA7]'
                    : 'bg-[#F2EDE5] dark:bg-[#252B27] text-[#8C928E] hover:text-[#424744]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="font-serif text-sm">{s.letter}</span>
                  {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[10px] truncate hidden sm:block mt-0.5">
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: ADVERSITY (A) */}
      {currentStep === 1 && (
        <div className="bg-white/90 dark:bg-[#1A1F1C] rounded-[2rem] p-7 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-sm space-y-6">
          <div>
            <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium tracking-wide">
              Paso 1 · Adversidad (A)
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#282D2A] dark:text-[#F0F3EF] mt-1">
              Mira el hecho con claridad y sin juicio
            </h2>
            <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-2 leading-relaxed">
              Describe lo que ocurrió con la serenidad de quien observa la lluvia por la ventana. 
              Solo hechos concretos (qué, cuándo y dónde), sin añadir autocríticas ni condenas.
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7] mb-2">
              Inspiración de situaciones comunes:
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
                  className="px-3 py-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE4D9] dark:bg-[#252B27] dark:hover:bg-[#2C332E] text-[#555B57] dark:text-[#C5CBC6] text-xs transition"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
                Nombre de esta reflexión:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Momento difícil en el trabajo"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#151916] border border-[#E2DBD0] dark:border-[#2F3631] text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
                Ámbito de vida:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#151916] border border-[#E2DBD0] dark:border-[#2F3631] text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40"
              >
                <option value="trabajo">Trabajo / Carrera</option>
                <option value="relaciones">Relaciones & Familia</option>
                <option value="salud_habitos">Salud y Cuerpo</option>
                <option value="estudio">Aprendizaje</option>
                <option value="finanzas">Finanzas</option>
                <option value="personal">Vida Interior</option>
              </select>
            </div>
          </div>

          {/* Adversity Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
              ¿Qué sucedió exactamente? (Hechos observables):
            </label>
            <textarea
              value={adversity}
              onChange={(e) => setAdversity(e.target.value)}
              rows={4}
              placeholder="Ejemplo: Ayer a las 10:00 el cliente expresó dudas sobre los plazos y solicitó revisar otras opciones antes de firmar..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#151916] border border-[#E2DBD0] dark:border-[#2F3631] text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40 leading-relaxed"
            />
          </div>

          {/* Gentle Objective Reminder */}
          {hasSubjectiveJudgments() && (
            <div className="p-4 rounded-2xl bg-[#F6EFE3] dark:bg-[#2B271F] border border-[#E5D7BE] dark:border-[#3D3528] text-xs text-[#6B5532] dark:text-[#E2C798] flex items-start justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <Feather className="w-4 h-4 text-[#C98A42] shrink-0 mt-0.5" />
                <p>
                  <strong>Sugerencia amable:</strong> Notamos frases de autojuicio (&ldquo;por mi culpa&rdquo;, &ldquo;inútil&rdquo;). 
                  Para darte paz, guárdalas para el Paso B (Creencia) y deja aquí solo los hechos objetivos.
                </p>
              </div>
              <button
                type="button"
                onClick={sanitizeAdversity}
                className="px-2.5 py-1 rounded-xl bg-[#E8DCBF] dark:bg-[#3E3423] text-[#4A3B22] dark:text-[#EEDDBF] font-medium text-[11px] hover:bg-[#DDD0AE] transition whitespace-nowrap"
              >
                Limpiar hechos
              </button>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[#F0EAE0] dark:border-[#282E2A]">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!adversity.trim()}
              className="px-6 py-3 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] text-xs font-semibold tracking-wide transition shadow-sm disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
            >
              <span>Continuar al Paso B (Creencia)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BELIEF (B) */}
      {currentStep === 2 && (
        <div className="bg-white/90 dark:bg-[#1A1F1C] rounded-[2rem] p-7 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-sm space-y-6">
          <div>
            <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium tracking-wide">
              Paso 2 · Creencia Automática (B)
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#282D2A] dark:text-[#F0F3EF] mt-1">
              Escucha tu diálogo interno con compasión
            </h2>
            <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-2 leading-relaxed">
              ¿Qué historia te contó tu mente en el primer segundo tras el tropiezo? Escríbela con honestidad; 
              no hay nada malo en sentirla, solo la estamos trayendo a la luz.
            </p>
          </div>

          {/* Reference Adversity */}
          <div className="p-4 rounded-2xl bg-[#F7F3EB] dark:bg-[#202522] border border-[#E8E1D4] dark:border-[#2A312B] text-xs text-[#5F6561] dark:text-[#9EA5A0]">
            <span className="font-semibold text-[#282D2A] dark:text-[#F0F3EF]">Hecho ocurrido (A):</span> {adversity}
          </div>

          {/* Belief input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
              Tu pensamiento espontáneo o preocupación:
            </label>
            <textarea
              value={belief}
              onChange={(e) => setBelief(e.target.value)}
              rows={3}
              placeholder="Ejemplo: Nunca voy a poder cerrar un acuerdo importante. Siempre arruino los momentos clave..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#151916] border border-[#E2DBD0] dark:border-[#2F3631] text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40 leading-relaxed"
            />
          </div>

          {/* 3 Serene Toggles */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5F7A61] dark:text-[#A8BEA7]">
                Las 3 Dimensiones de la Mente según Seligman
              </h3>
              <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-0.5">
                Revisa con calma si tu pensamiento está exagerando el peso de lo ocurrido.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Permanence */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#282D2A] dark:text-[#F0F3EF]">
                  <Clock className="w-4 h-4 text-[#5F7A61]" />
                  <span>1. ¿Temporal o Permanente?</span>
                </div>
                <div className="flex rounded-xl p-1 bg-[#EAE4D9] dark:bg-[#171B18] text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setPermanent(false)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      !permanent
                        ? 'bg-white dark:bg-[#232925] text-[#282D2A] dark:text-[#F0F3EF] shadow-xs font-semibold'
                        : 'text-[#696F6B] dark:text-[#9BA19C]'
                    }`}
                  >
                    Ocurrió esta vez
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermanent(true)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      permanent
                        ? 'bg-[#D97D7D]/20 text-[#8C3434] dark:text-[#E89E9E] font-semibold'
                        : 'text-[#696F6B] dark:text-[#9BA19C]'
                    }`}
                  >
                    Para siempre
                  </button>
                </div>
              </div>

              {/* Pervasiveness */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#282D2A] dark:text-[#F0F3EF]">
                  <Maximize2 className="w-4 h-4 text-[#5F7A61]" />
                  <span>2. ¿Específico o Universal?</span>
                </div>
                <div className="flex rounded-xl p-1 bg-[#EAE4D9] dark:bg-[#171B18] text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setUniversal(false)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      !universal
                        ? 'bg-white dark:bg-[#232925] text-[#282D2A] dark:text-[#F0F3EF] shadow-xs font-semibold'
                        : 'text-[#696F6B] dark:text-[#9BA19C]'
                    }`}
                  >
                    Solo este tema
                  </button>
                  <button
                    type="button"
                    onClick={() => setUniversal(true)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      universal
                        ? 'bg-[#D97D7D]/20 text-[#8C3434] dark:text-[#E89E9E] font-semibold'
                        : 'text-[#696F6B] dark:text-[#9BA19C]'
                    }`}
                  >
                    En toda mi vida
                  </button>
                </div>
              </div>

              {/* Personalization */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#282D2A] dark:text-[#F0F3EF]">
                  <Heart className="w-4 h-4 text-[#5F7A61]" />
                  <span>3. ¿Contexto o Autocastigo?</span>
                </div>
                <div className="flex rounded-xl p-1 bg-[#EAE4D9] dark:bg-[#171B18] text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setInternal(false)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      !internal
                        ? 'bg-white dark:bg-[#232925] text-[#282D2A] dark:text-[#F0F3EF] shadow-xs font-semibold'
                        : 'text-[#696F6B] dark:text-[#9BA19C]'
                    }`}
                  >
                    Factores externos
                  </button>
                  <button
                    type="button"
                    onClick={() => setInternal(true)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      internal
                        ? 'bg-[#D97D7D]/20 text-[#8C3434] dark:text-[#E89E9E] font-semibold'
                        : 'text-[#696F6B] dark:text-[#9BA19C]'
                    }`}
                  >
                    Soy un fallo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Coach Helper */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleConsultCoach}
              disabled={isLoadingCoach || !belief.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE4D9] dark:bg-[#252B27] dark:hover:bg-[#2C332E] text-[#424844] dark:text-[#D5DBD6] text-xs font-medium transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#5F7A61]" />
              <span>{isLoadingCoach ? 'Escuchando con OptiMind...' : 'Pedir Perspectiva Serena a OptiMind'}</span>
            </button>

            {coachAnalysis && (
              <div className="mt-3 p-4 rounded-2xl bg-[#EFF4EE] dark:bg-[#1C251E] border border-[#D5E2D4] dark:border-[#2D3C2F] text-xs text-[#2F4432] dark:text-[#B2CAB4] space-y-1.5 animate-fade-in">
                <div className="font-semibold">{coachAnalysis.tutorNote}</div>
                <p className="leading-relaxed text-[#4A5D4D] dark:text-[#9EBAA0]">
                  {coachAnalysis.diagnostic.summary}
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4 border-t border-[#F0EAE0] dark:border-[#282E2A]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#696F6B] dark:text-[#9BA19C] hover:bg-[#F2EDE5] dark:hover:bg-[#252B27] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a A</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={!belief.trim()}
              className="px-6 py-3 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] text-xs font-semibold tracking-wide transition shadow-sm disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
            >
              <span>Continuar al Paso C (Emociones)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONSEQUENCES (C) */}
      {currentStep === 3 && (
        <div className="bg-white/90 dark:bg-[#1A1F1C] rounded-[2rem] p-7 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-sm space-y-6">
          <div>
            <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium tracking-wide">
              Paso 3 · Consecuencias (C)
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#282D2A] dark:text-[#F0F3EF] mt-1">
              Acoge las emociones que surgieron
            </h2>
            <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-2 leading-relaxed">
              Lo que pensamos moldea cómo nos sentimos y cómo actuamos. Dale nombre a la emoción sin juzgarte por sentirla.
            </p>
          </div>

          {/* Calming Intensity Slider */}
          <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
                Nivel de tensión o malestar emocional:
              </span>
              <span className="font-serif text-lg text-[#282D2A] dark:text-[#F0F3EF] tabular-nums font-medium">
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
              className="w-full h-2 bg-[#E6E0D4] dark:bg-[#2C332E] rounded-full appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-[#7A807B] dark:text-[#8D938E]">
              <span>1 (Leve inquietud)</span>
              <span>5 (Malestar presente)</span>
              <span>10 (Agobio intenso)</span>
            </div>
          </div>

          {/* Emotion Tags */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
              ¿Qué sentiste principalmente?:
            </label>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map((emo) => {
                const isSelected = selectedEmotions.includes(emo);
                return (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => handleToggleEmotion(emo)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? 'bg-[#5F7A61]/20 text-[#2B3E2D] dark:text-[#A8BEA7] border border-[#5F7A61]/40'
                        : 'bg-[#F4EFE6] dark:bg-[#252B27] text-[#555B57] dark:text-[#C5CBC6] hover:bg-[#EAE4D9]'
                    }`}
                  >
                    {emo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Behavioral Impact Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
              ¿Qué hiciste o qué impulso tuviste? (Impacto en tu acción):
            </label>
            <textarea
              value={behavioralImpact}
              onChange={(e) => setBehavioralImpact(e.target.value)}
              rows={3}
              placeholder="Ejemplo: Me aislé, postergué una respuesta y me quedé rumiando durante horas en el sillón..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#151916] border border-[#E2DBD0] dark:border-[#2F3631] text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40 leading-relaxed"
            />
          </div>

          {/* Thought Stopper Soft Invite */}
          <div className="p-4 rounded-2xl bg-[#F5EFE4] dark:bg-[#26241E] border border-[#E8DDCA] dark:border-[#383327] flex items-center justify-between gap-4 text-xs text-[#5D4E35] dark:text-[#DAC5A4]">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#C98A42] shrink-0" />
              <span>¿Sientes que el pensamiento sigue dando vueltas? Puedes tomar una pausa consciente.</span>
            </div>
            <button
              type="button"
              onClick={onOpenThoughtStopper}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C1A14] font-medium text-[11px] shadow-2xs hover:bg-[#FCFAF6] transition whitespace-nowrap"
            >
              Hacer Pausa Zen
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4 border-t border-[#F0EAE0] dark:border-[#282E2A]">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#696F6B] dark:text-[#9BA19C] hover:bg-[#F2EDE5] dark:hover:bg-[#252B27] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a B</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] text-xs font-semibold tracking-wide transition shadow-sm flex items-center gap-2"
            >
              <span>Continuar al Paso D (Las 4 Luces)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DISPUTATION (D) */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <DisputationCards
            belief={belief}
            refutations={refutations}
            onChangeRefutations={setRefutations}
            onAskAiPrompt={handleAskCardPrompt}
            isLoadingAi={isLoadingCoach}
          />

          <div className="flex justify-between p-5 bg-white/80 dark:bg-[#1A1F1C] rounded-2xl border border-[#E8E2D7] dark:border-[#2C332E]">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#696F6B] dark:text-[#9BA19C] hover:bg-[#F2EDE5] dark:hover:bg-[#252B27] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a C</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] text-xs font-semibold tracking-wide transition shadow-sm flex items-center gap-2"
            >
              <span>Continuar al Paso E (Renovación)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: ENERGIZATION (E) */}
      {currentStep === 5 && (
        <div className="bg-white/90 dark:bg-[#1A1F1C] rounded-[2rem] p-7 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-sm space-y-6">
          <div>
            <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium tracking-wide">
              Paso 5 · Renovación & Calma Activa (E)
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#282D2A] dark:text-[#F0F3EF] mt-1">
              Siente el alivio y abraza un nuevo comienzo
            </h2>
            <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-2 leading-relaxed">
              Tras explorar la situación con honestidad y sabiduría, comprueba cómo se ha aligerado el peso 
              y define una pequeña acción bondadosa para retomar tu paz.
            </p>
          </div>

          {/* Serene Delta Relief Card */}
          <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#696F6B] dark:text-[#9BA19C]">Alivio en la carga emocional:</span>
              <div className="flex items-center gap-2 font-medium">
                <span>Antes: {intensityC}/10</span>
                <span>→</span>
                <span className="text-[#4A644C] dark:text-[#A8BEA7] font-semibold">Ahora: {intensityE}/10</span>
                <span className="text-xs text-[#4A644C] dark:text-[#A8BEA7] font-bold">
                  (-{Math.max(0, intensityC - intensityE)} pts)
                </span>
              </div>
            </div>

            {/* Slider to adjust final calmness */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7] mb-2">
                ¿Qué nivel de tensión sientes ahora mismo?:
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={intensityE}
                onChange={(e) => setIntensityE(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#E6E0D4] dark:bg-[#2C332E] rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Re-framed Belief */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
              Nueva Creencia Reestructurada (Temporal, Específica y Compasiva):
            </label>
            <textarea
              value={newBelief}
              onChange={(e) => setNewBelief(e.target.value)}
              rows={2}
              placeholder="Ejemplo: Este aplazamiento es un asunto presupuestario puntual y técnico, no un juicio sobre mi valor. Puedo modular el plan en fases..."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#151916] border border-[#E2DBD0] dark:border-[#2F3631] text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40 leading-relaxed"
            />
          </div>

          {/* Action Plan */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
              Micro-Acciones de Paz y Progreso (Para las próximas horas):
            </label>
            <textarea
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              rows={3}
              placeholder="1) Tomar un té caliente y caminar 10 minutos.\n2) Enviar un mensaje breve para aclarar una duda.\n3) Cerrar el día con gratitud."
              className="w-full px-4 py-3.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#151916] border border-[#E2DBD0] dark:border-[#2F3631] text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40 leading-relaxed"
            />
          </div>

          {/* Cost of Failure selector */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#282D2A] dark:text-[#F0F3EF]">
                Regla de Seligman: Costo del Fracaso
              </span>
              <span className="text-[#5F7A61] dark:text-[#A8BEA7]">
                {costOfFailure === 'high' ? 'Pesimismo Prudente recomendado' : 'Optimismo Flexible y Sereno'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCostOfFailure('low')}
                className={`flex-1 py-1.5 rounded-xl text-xs transition ${
                  costOfFailure === 'low'
                    ? 'bg-white dark:bg-[#1C211E] text-[#282D2A] dark:text-[#F0F3EF] shadow-xs font-semibold'
                    : 'text-[#696F6B] dark:text-[#9BA19C]'
                }`}
              >
                Costo Bajo (Práctica / Aprendizaje)
              </button>
              <button
                type="button"
                onClick={() => setCostOfFailure('moderate')}
                className={`flex-1 py-1.5 rounded-xl text-xs transition ${
                  costOfFailure === 'moderate'
                    ? 'bg-white dark:bg-[#1C211E] text-[#282D2A] dark:text-[#F0F3EF] shadow-xs font-semibold'
                    : 'text-[#696F6B] dark:text-[#9BA19C]'
                }`}
              >
                Costo Moderado
              </button>
              <button
                type="button"
                onClick={() => setCostOfFailure('high')}
                className={`flex-1 py-1.5 rounded-xl text-xs transition ${
                  costOfFailure === 'high'
                    ? 'bg-white dark:bg-[#1C211E] text-[#282D2A] dark:text-[#F0F3EF] shadow-xs font-semibold'
                    : 'text-[#696F6B] dark:text-[#9BA19C]'
                }`}
              >
                Costo Alto (Riesgo severo)
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-between pt-4 border-t border-[#F0EAE0] dark:border-[#282E2A]">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#696F6B] dark:text-[#9BA19C] hover:bg-[#F2EDE5] dark:hover:bg-[#252B27] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a D</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-7 py-3.5 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] text-xs font-semibold tracking-wide transition shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en el Diario Sereno</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
