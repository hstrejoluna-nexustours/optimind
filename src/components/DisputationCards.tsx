import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Sun,
  Compass,
  Feather,
  Wind
} from 'lucide-react';
import { RefutationalCards } from '../types';
import { sounds } from '../utils/audio';

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
      icon: Sun,
      number: '01',
      title: 'Luz de la Evidencia',
      subtitle: 'La mirada objetiva y fáctica',
      question: '¿Qué pruebas y hechos reales demuestran que este pensamiento es una conclusión apresurada?',
      explanation: 'No te juzgues ni te engañes. Pregúntate con serenidad: si un amigo de confianza viera esta situación, ¿qué hechos concretos le dirían que no todo está perdido?',
      placeholder: 'Ejemplo: No es verdad que siempre falle; hace apenas dos semanas completé con éxito la entrega. El desacuerdo fue solo sobre un detalle técnico puntual...',
    },
    {
      id: 'alternatives' as const,
      icon: Compass,
      number: '02',
      title: 'Luz de las Alternativas',
      subtitle: 'Otras explicaciones posibles',
      question: '¿Qué otras causas temporales, circunstanciales o externas pudieron influir en lo que pasó?',
      explanation: 'Casi ningún suceso proviene de una sola causa fija. Abre espacio a factores como el cansancio, la falta de tiempo, la complejidad imprevista o las circunstancias ajenas.',
      placeholder: 'Ejemplo: 1) Estaba agotado tras varios días sin dormir bien. 2) Las indicaciones iniciales fueron difusas para todo el equipo...',
    },
    {
      id: 'decatastrophizing' as const,
      icon: Feather,
      number: '03',
      title: 'Luz de la Perspectiva',
      subtitle: 'Descatastrofización serena',
      question: 'Aun si hubiese algo de verdad, ¿cuál es el peor desenlace realista? ¿Es realmente el fin del mundo?',
      explanation: 'Tu mente suele confundir la incomodidad con una tragedia irreparable. Respira hondo y evalúa el costo real: en la mayoría de los casos, es manejable paso a paso.',
      placeholder: 'Ejemplo: En el peor de los casos tendré que pedir una prórroga de dos días y corregir los puntos observados. Es incómodo, pero no destruye mi vida ni mi empleo...',
    },
    {
      id: 'utility' as const,
      icon: Wind,
      number: '04',
      title: 'Luz de la Utilidad & Dejar Ir',
      subtitle: 'Liberación de la rumiación',
      question: '¿Seguir dándole vueltas a este pensamiento ahora mismo te ayuda o solo drena tu paz interior?',
      explanation: 'Pensar compulsivamente en un problema no lo resuelve. Si en este momento no puedes actuar, regálate una pausa, di &ldquo;dejo ir este pensamiento por hoy&rdquo; o aplázalo para mañana.',
      placeholder: 'Ejemplo: Rumiar esto en la cama a las 11 pm solo me quitará el sueño reparador. Decido respirar tres veces, soltarlo y revisar los números mañana a las 10 am...',
    },
  ];

  const current = cardConfig.find(c => c.id === activeCard)!;
  const completedCount = Object.values(refutations).filter(text => text.trim().length > 10).length;

  const handleNext = () => {
    sounds.playBambooChime();
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
      {/* Header bar */}
      <div className="bg-white/80 dark:bg-[#1C211E] p-6 rounded-3xl border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#5F7A61] dark:text-[#A8BEA7]">
              <span>Paso D · Cuatro Luces de Perspectiva</span>
              <span aria-hidden="true">·</span>
              <span>{completedCount} de 4 completadas</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#282D2A] dark:text-[#F0F3EF] mt-1">
              Desarma la rigidez con sabiduría serena
            </h2>
            <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1 italic">
              Examinando la creencia: &ldquo;{belief}&rdquo;
            </p>
          </div>

          {/* Clean Segmented Tab Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F1EDE5] dark:bg-[#252B27] rounded-2xl overflow-x-auto">
            {cardConfig.map((card) => {
              const isSelected = activeCard === card.id;
              const hasText = refutations[card.id].trim().length > 10;

              return (
                <button
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white dark:bg-[#181D1A] text-[#282D2A] dark:text-[#F0F3EF] shadow-xs font-semibold'
                      : 'text-[#696F6B] dark:text-[#9BA19C] hover:text-[#282D2A] dark:hover:text-[#F0F3EF]'
                  }`}
                >
                  <span>{card.number}</span>
                  <span className="hidden sm:inline">{card.title.replace('Luz de ', '')}</span>
                  {hasText && <Check className="w-3 h-3 text-[#5F7A61]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Light Card Canvas */}
      <div className="bg-white/90 dark:bg-[#1D221F] rounded-[2rem] p-6 sm:p-9 border border-[#E8E2D7] dark:border-[#2C332E] shadow-sm relative overflow-hidden transition-all">
        {/* Subtle Warm Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E2B678]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE0] dark:border-[#282E2A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5F7A61]/15 dark:bg-[#5F7A61]/25 flex items-center justify-center text-[#4A644C] dark:text-[#A8BEA7]">
              <current.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium">
                {current.number} · {current.subtitle}
              </div>
              <h3 className="font-serif text-xl text-[#282D2A] dark:text-[#F0F3EF]">
                {current.title}
              </h3>
            </div>
          </div>

          {onAskAiPrompt && (
            <button
              onClick={() => onAskAiPrompt(current.id)}
              disabled={isLoadingAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE4D9] dark:bg-[#252B27] dark:hover:bg-[#2C332E] text-[#424844] dark:text-[#D5DBD6] text-xs font-medium transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5F7A61]" />
              <span>{isLoadingAi ? 'Consultando...' : 'Inspiración de OptiMind'}</span>
            </button>
          )}
        </div>

        {/* Reflection Guide Box */}
        <div className="relative z-10 mt-6 p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#232925] border border-[#EFE9DF] dark:border-[#2D352F] space-y-1.5">
          <p className="font-serif text-base text-[#282D2A] dark:text-[#F0F3EF] leading-snug">
            {current.question}
          </p>
          <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
            {current.explanation}
          </p>
        </div>

        {/* Text Input */}
        <div className="relative z-10 mt-6 space-y-2">
          <label className="block text-xs font-medium text-[#4D524F] dark:text-[#B6BCB7]">
            Tu perspectiva reflexiva:
          </label>
          <textarea
            value={refutations[current.id]}
            onChange={(e) => onChangeRefutations({
              ...refutations,
              [current.id]: e.target.value,
            })}
            rows={5}
            placeholder={current.placeholder}
            className="w-full px-4 py-3.5 rounded-2xl bg-[#FCFAF7] dark:bg-[#161A17] border border-[#E2DBD0] dark:border-[#2F3631] text-[#282D2A] dark:text-[#F0F3EF] text-sm focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40 leading-relaxed transition-all placeholder:text-[#9DA39E]"
          />
        </div>

        {/* Bottom card navigation */}
        <div className="relative z-10 mt-6 pt-5 border-t border-[#F0EAE0] dark:border-[#282E2A] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeCard === 'evidence'}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#696F6B] dark:text-[#9BA19C] hover:bg-[#F2EDE5] dark:hover:bg-[#252B27] transition disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Luz anterior</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={activeCard === 'utility'}
            className="px-5 py-2.5 rounded-xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] text-xs font-semibold tracking-wide transition shadow-xs disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <span>Siguiente Luz</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
