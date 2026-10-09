import React, { useState } from 'react';
import { 
  Search, 
  Shuffle, 
  AlertTriangle, 
  Target, 
  Sparkles, 
  Check, 
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { RefutationalCards } from '../types';

interface DisputationCardsProps {
  belief: string;
  refutations: RefutationalCards;
  onChangeRefutations: (updated: RefutationalCards) => void;
  onAskAiPrompt?: (cardType: keyof RefutationalCards) => void;
  isLoadingAi?: boolean;
}

export const DisputationCards: React.FC<DisputationCardsProps> = ({
  belief,
  refutations,
  onChangeRefutations,
  onAskAiPrompt,
  isLoadingAi = false,
}) => {
  const [activeCard, setActiveCard] = useState<keyof RefutationalCards>('evidence');

  const cardConfig = [
    {
      id: 'evidence' as const,
      icon: Search,
      emoji: '🕵️‍♂️',
      title: 'Carta 1: Evidencia Factual',
      subtitle: 'El detective objetivo',
      color: 'teal',
      badgeClass: 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
      question: '¿Qué hechos medibles y verificables demuestran que este pensamiento pesimista es una exageración o distorsión?',
      explanation: 'En lugar de consolarte con frases huecas, actúa como un detective científico. Si tu mente dice "nunca hago nada bien", busca pruebas en tu historial que contradigan esa generalización.',
      placeholder: 'Ejemplo: No es verdad que siempre falle; hace 2 semanas cerré la entrega a tiempo. Además, el informe fue aprobado en 4 de 5 puntos...',
    },
    {
      id: 'alternatives' as const,
      icon: Shuffle,
      emoji: '🔀',
      title: 'Carta 2: Alternativas Múltiples',
      subtitle: 'Búsqueda de causas variables',
      color: 'indigo',
      badgeClass: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      question: '¿Cuáles son al menos 2 explicaciones alternativas que sean específicas, modificables y no destructivas?',
      explanation: 'Casi ningún acontecimiento se debe a una sola causa interna permanente. Genera hipótesis que involucren factores circunstanciales, tiempo, recursos o cansancio que puedas alterar en el futuro.',
      placeholder: 'Ejemplo: 1) Estaba exhausto por haber dormido 4 horas. 2) La indicación recibida fue ambigua, no fue falta de capacidad intelectual...',
    },
    {
      id: 'decatastrophizing' as const,
      icon: AlertTriangle,
      emoji: '🔍',
      title: 'Carta 3: Descatastrofización',
      subtitle: 'Evaluación del impacto real',
      color: 'amber',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      question: 'Aún si la creencia fuera parcialmente cierta, ¿cuál es el peor desenlace realista? ¿Es realmente el fin del mundo?',
      explanation: 'Tu cerebro primitivo suele tratar un contratiempo social o laboral como una amenaza de muerte biológica. Calcula la probabilidad real del peor escenario y cómo lo manejarías.',
      placeholder: 'Ejemplo: En el peor caso tendré que rehacer la entrega el lunes y pedir disculpas. Es incómodo y frustrante, pero no pone en riesgo mi empleo ni mi vida...',
    },
    {
      id: 'utility' as const,
      icon: Target,
      emoji: '🎯',
      title: 'Carta 4: Utilidad y Freno Mental',
      subtitle: 'Cuestionamiento pragmático',
      color: 'rose',
      badgeClass: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      question: '¿Pensar en esto en este momento te ayuda a resolver algo o solo te paraliza? ¿Es momento de usar un "¡Basta!" mental?',
      explanation: 'A veces una creencia puede tener algo de verdad, pero rumiarla de forma compulsiva solo drena tus recursos ejecutivos. Si no puedes actuar ahora mismo, interrumpe el pensamiento o difiérelo.',
      placeholder: 'Ejemplo: Seguir dándole vueltas ahora a las 11 pm solo me quitará el sueño. Elijo aplicar ¡BASTA! y asignar 15 minutos mañana para tomar acción...',
    },
  ];

  const current = cardConfig.find(c => c.id === activeCard)!;
  const completedCount = Object.values(refutations).filter(text => text.trim().length > 10).length;

  const handleNext = () => {
    const idx = cardConfig.findIndex(c => c.id === activeCard);
    if (idx < cardConfig.length - 1) {
      setActiveCard(cardConfig[idx + 1].id);
    }
  };

  const handlePrev = () => {
    const idx = cardConfig.findIndex(c => c.id === activeCard);
    if (idx > 0) {
      setActiveCard(cardConfig[idx - 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Las 4 Cartas de Discusión (Herramientas D)
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              {completedCount} / 4 completadas
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Desafía de manera rigurosa tu creencia automática: <span className="italic font-medium text-slate-700 dark:text-slate-300">&ldquo;{belief}&rdquo;</span>
          </p>
        </div>

        {/* Tab switch pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {cardConfig.map((card) => {
            const hasText = refutations[card.id].trim().length > 10;
            const isSelected = activeCard === card.id;

            return (
              <button
                key={card.id}
                onClick={() => setActiveCard(card.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{card.emoji}</span>
                <span className="hidden sm:inline">{card.title.split(':')[1]}</span>
                {hasText && (
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Card Canvas */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md relative overflow-hidden transition-all">
        {/* Top Card Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {current.title}
                </h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${current.badgeClass}`}>
                  {current.subtitle}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Regla de Seligman: Exactitud y evidencia sobre el consuelo irracional.
              </p>
            </div>
          </div>

          {/* AI Helper trigger button */}
          {onAskAiPrompt && (
            <button
              onClick={() => onAskAiPrompt(current.id)}
              disabled={isLoadingAi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 hover:from-teal-500/20 hover:to-indigo-500/20 border border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs font-bold transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isLoadingAi ? 'Consultando...' : 'Pedir Pista a OptiMind'}</span>
            </button>
          )}
        </div>

        {/* Challenge prompt box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {current.question}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {current.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Input Textarea */}
        <div className="mt-5 space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Tu Discusión Activa:
          </label>
          <textarea
            value={refutations[current.id]}
            onChange={(e) => onChangeRefutations({
              ...refutations,
              [current.id]: e.target.value,
            })}
            rows={5}
            placeholder={current.placeholder}
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition leading-relaxed"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>
              {refutations[current.id].trim().length > 15 ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Refutación registrada
                </span>
              ) : (
                'Escribe al menos una frase con argumentos reales'
              )}
            </span>
            <span>{refutations[current.id].length} caracteres</span>
          </div>
        </div>

        {/* Navigation buttons between cards */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeCard === 'evidence'}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Carta Anterior</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={activeCard === 'utility'}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-xs disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
          >
            <span>Siguiente Carta</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
