import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Brain, 
  Sparkles,
  Clock,
  Maximize2,
  UserCheck
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
    const updated = { ...answers, [currentQ.id]: option };
    setAnswers(updated);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResults(true);
      sounds.playSuccessChime();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResults(false);
  };

  // Calculate scores based on user answers
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Test de Pauta Explicativa (Mini ASQ)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Inspirado en el Cuestionario de Estilo Atribucional del Dr. Martin Seligman.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
          Responde según tu primera reacción intuitiva ante cada contratiempo. No hay respuestas &ldquo;buenas&rdquo; o &ldquo;malas&rdquo;; el objetivo es calibrar tu tendencia automática actual.
        </p>
      </div>

      {!showResults ? (
        /* Question Card */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Pregunta {currentIdx + 1} de {questions.length}</span>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-1.5 rounded-full ${
                    i === currentIdx
                      ? 'bg-teal-500'
                      : i < currentIdx
                      ? 'bg-teal-200 dark:bg-teal-800'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Escenario
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
              {currentQ.scenario}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              ¿Cuál de estas dos explicaciones se parece más a tu primer pensamiento automático?
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleSelectOption('A')}
              className="w-full p-4 rounded-2xl text-left border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition group"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center text-xs font-bold shrink-0 transition">
                  A
                </span>
                <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {currentQ.optionA.text}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleSelectOption('B')}
              className="w-full p-4 rounded-2xl text-left border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition group"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center text-xs font-bold shrink-0 transition">
                  B
                </span>
                <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {currentQ.optionB.text}
                </span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Diagnóstico de tu Pauta Explicativa
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Evaluación inicial basada en tus respuestas automáticas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Permanence */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <Clock className="w-5 h-5 mx-auto text-teal-600 dark:text-teal-400 mb-1" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Permanencia</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {scores.permanence}%
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {scores.permanence > 50 ? 'Tendencia permanente' : 'Temporal / Resiliente'}
              </p>
            </div>

            {/* Pervasiveness */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <Maximize2 className="w-5 h-5 mx-auto text-indigo-600 dark:text-indigo-400 mb-1" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Amplitud</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {scores.pervasiveness}%
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {scores.pervasiveness > 50 ? 'Tendencia universal' : 'Específico / Acotado'}
              </p>
            </div>

            {/* Personalization */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <UserCheck className="w-5 h-5 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Personalización</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {scores.personalization}%
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {scores.personalization > 50 ? 'Autoinculpación' : 'Contextual'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
            <strong className="font-bold">Recomendación de Entrenamiento:</strong>
            <p className="mt-1">
              Las habilidades de optimismo aprendido se entrenan exactamente igual que la fuerza muscular. 
              Cada vez que apliques el modelo ABCDE y uses las 4 Cartas de Refutación, estarás reconfigurando 
              tus vías neuronales para responder con flexibilidad y determinación.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir Test</span>
            </button>

            <button
              onClick={onGoToWizard}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md shadow-teal-600/25 flex items-center justify-center gap-1.5"
            >
              <span>Ir al Gimnasio ABCDE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
