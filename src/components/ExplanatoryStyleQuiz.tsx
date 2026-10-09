import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Clock,
  Maximize2,
  Heart,
  Feather
} from 'lucide-react';
import { SELIGMAN_QUIZ_QUESTIONS } from '../data/initialData';
import { sounds } from '../utils/audio';

interface ExplanatoryStyleQuizProps {
  onApplyResultsToProfile?: (scores: { permanence: number; pervasiveness: number; personalization: number }) => void;
  onGoToWizard: () => void;
}

export const ExplanatoryStyleQuiz: React.FC<ExplanatoryStyleQuizProps> = ({
  onApplyResultsToProfile,
  onGoToWizard,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = SELIGMAN_QUIZ_QUESTIONS;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (option: 'A' | 'B') => {
    sounds.playBambooChime();
    const updated = { ...answers, [currentQ.id]: option };
    setAnswers(updated);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResults(false);
  };

  const computeScores = () => {
    let permPessimistic = 0;
    let pervPessimistic = 0;
    let internPessimistic = 0;

    questions.forEach((q) => {
      const choice = answers[q.id];
      if (choice === 'A') {
        if (q.optionA.permanent) permPessimistic++;
        if (q.optionA.universal) pervPessimistic++;
        if (q.optionA.internal) internPessimistic++;
      } else if (choice === 'B') {
        if (q.optionB.permanent) permPessimistic++;
        if (q.optionB.universal) pervPessimistic++;
        if (q.optionB.internal) internPessimistic++;
      }
    });

    const total = questions.length;
    return {
      permanence: Math.round((permPessimistic / total) * 100),
      pervasiveness: Math.round((pervPessimistic / total) * 100),
      personalization: Math.round((internPessimistic / total) * 100),
    };
  };

  const scores = computeScores();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Quiz Header */}
      <div className="bg-white/80 dark:bg-[#1A1F1C] rounded-[2rem] p-8 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs">
        <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium tracking-wide mb-1">
          Autoconocimiento Sin Juicio
        </div>
        <h1 className="font-serif text-3xl text-[#282D2A] dark:text-[#F0F3EF]">
          Test de Pauta Explicativa (Mini ASQ)
        </h1>
        <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-2 leading-relaxed">
          Inspirado en el Cuestionario de Estilo Atribucional del Dr. Martin Seligman. 
          Responde con amabilidad según tu primera intuición. No hay respuestas correctas ni incorrectas.
        </p>
      </div>

      {!showResults ? (
        /* Question Card */
        <div className="bg-white/90 dark:bg-[#1A1F1C] rounded-[2rem] p-8 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-[#7A807B] dark:text-[#8D938E]">
            <span>Pregunta {currentIdx + 1} de {questions.length}</span>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-1 rounded-full transition-colors ${
                    i === currentIdx
                      ? 'bg-[#5F7A61]'
                      : i < currentIdx
                      ? 'bg-[#A3B899]'
                      : 'bg-[#EAE4D9] dark:bg-[#282E2A]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium">
              Situación Imaginada
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#282D2A] dark:text-[#F0F3EF] mt-1.5 leading-snug">
              {currentQ.scenario}
            </h2>
            <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-2">
              ¿Qué explicación se acerca más a lo que pensarías espontáneamente?
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleSelectOption('A')}
              className="w-full p-5 rounded-2xl text-left border border-[#E2DBD0] dark:border-[#2E3630] bg-[#FAF7F2] dark:bg-[#202522] hover:border-[#5F7A61] hover:bg-[#F2ECE2] dark:hover:bg-[#262C28] transition-all group"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-white dark:bg-[#181C19] border border-[#DDD6C8] dark:border-[#323933] group-hover:border-[#5F7A61] flex items-center justify-center text-xs font-serif shrink-0 transition-colors">
                  A
                </span>
                <span className="text-xs sm:text-sm text-[#282D2A] dark:text-[#F0F3EF] leading-relaxed">
                  {currentQ.optionA.text}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleSelectOption('B')}
              className="w-full p-5 rounded-2xl text-left border border-[#E2DBD0] dark:border-[#2E3630] bg-[#FAF7F2] dark:bg-[#202522] hover:border-[#5F7A61] hover:bg-[#F2ECE2] dark:hover:bg-[#262C28] transition-all group"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-white dark:bg-[#181C19] border border-[#DDD6C8] dark:border-[#323933] group-hover:border-[#5F7A61] flex items-center justify-center text-xs font-serif shrink-0 transition-colors">
                  B
                </span>
                <span className="text-xs sm:text-sm text-[#282D2A] dark:text-[#F0F3EF] leading-relaxed">
                  {currentQ.optionB.text}
                </span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-white/90 dark:bg-[#1A1F1C] rounded-[2rem] p-8 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-sm space-y-6 animate-fade-in">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#5F7A61]/15 text-[#4A644C] dark:text-[#A8BEA7] flex items-center justify-center mb-2">
              <Feather className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#282D2A] dark:text-[#F0F3EF]">
              Tu Tendencia Explicativa
            </h2>
            <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C]">
              Una foto amable de tu pauta inicial para guiar tus reflexiones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] text-center">
              <Clock className="w-5 h-5 mx-auto text-[#5F7A61] mb-1" />
              <div className="text-xs font-serif text-[#282D2A] dark:text-[#F0F3EF]">Permanencia</div>
              <div className="text-2xl font-serif text-[#282D2A] dark:text-[#F0F3EF] mt-1 tabular-nums">
                {scores.permanence}%
              </div>
              <p className="text-[11px] text-[#7A807B] dark:text-[#8D938E] mt-1">
                {scores.permanence > 50 ? 'Tiende a ver causas duraderas' : 'Reconoce causas pasajeras'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] text-center">
              <Maximize2 className="w-5 h-5 mx-auto text-[#5F7A61] mb-1" />
              <div className="text-xs font-serif text-[#282D2A] dark:text-[#F0F3EF]">Amplitud</div>
              <div className="text-2xl font-serif text-[#282D2A] dark:text-[#F0F3EF] mt-1 tabular-nums">
                {scores.pervasiveness}%
              </div>
              <p className="text-[11px] text-[#7A807B] dark:text-[#8D938E] mt-1">
                {scores.pervasiveness > 50 ? 'Tiende a generalizar' : 'Mantiene el hecho acotado'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] text-center">
              <Heart className="w-5 h-5 mx-auto text-[#5F7A61] mb-1" />
              <div className="text-xs font-serif text-[#282D2A] dark:text-[#F0F3EF]">Compasión</div>
              <div className="text-2xl font-serif text-[#282D2A] dark:text-[#F0F3EF] mt-1 tabular-nums">
                {scores.personalization}%
              </div>
              <p className="text-[11px] text-[#7A807B] dark:text-[#8D938E] mt-1">
                {scores.personalization > 50 ? 'Tiende a autoinculparse' : 'Sopesa circunstancias'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F3EB] dark:bg-[#232925] border border-[#EBE4D7] dark:border-[#2D332F] text-xs text-[#5A635C] dark:text-[#BAC0BB] leading-relaxed">
            <strong className="font-serif text-sm block mb-1 text-[#282D2A] dark:text-[#F0F3EF]">
              Consejo de Martin Seligman:
            </strong>
            El optimismo consciente es un hábito maleable. Cada vez que tomes unos minutos para 
            desglosar una situación con las 4 Luces en el Santuario ABCDE, estarás tejiendo mayor 
            paz mental y resiliencia para toda la vida.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-2xl border border-[#DED7CA] dark:border-[#2E3630] text-[#555B57] dark:text-[#C5CBC6] font-medium text-xs hover:bg-[#F4EFE6] dark:hover:bg-[#252B27] transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir preguntas</span>
            </button>

            <button
              onClick={onGoToWizard}
              className="flex-1 py-3 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Comenzar Reflexión ABCDE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
