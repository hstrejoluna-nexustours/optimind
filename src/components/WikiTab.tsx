import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Maximize2, 
  Heart,
  Scale,
  ArrowRight,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { WIKI_ARTICLES } from '../data/wikiData';

interface WikiTabProps {
  onGoToGymWithExample?: () => void;
}

export const WikiTab: React.FC<WikiTabProps> = ({ onGoToGymWithExample }) => {
  const [expandedId, setExpandedId] = useState<string>('que-es-el-optimismo-aprendido');

  // Interactive Dimension Simulator within Article 3
  const [simPermanent, setSimPermanent] = useState<'temporal' | 'permanente'>('temporal');
  const [simPervasive, setSimPervasive] = useState<'especifico' | 'universal'>('especifico');
  const [simPersonal, setSimPersonal] = useState<'contexto' | 'autoculpa'>('contexto');

  // Interactive Failure Cost Risk Matrix within Article 4
  const [simCost, setSimCost] = useState<'bajo' | 'alto'>('bajo');

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? '' : id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="bg-[#F3EEE7] rounded-[1.75rem] p-8 sm:p-10 border border-[#E6DFD5] shadow-tonal">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5A44] mb-2">
          <span>Base de Conocimiento Editorial</span>
          <span aria-hidden="true">·</span>
          <span>Psicología Cognitiva Experimental</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#333E38]">
          Wiki del Optimismo Aprendido
        </h1>

        <p className="mt-2 text-[#55635C] text-xs sm:text-sm max-w-2xl leading-relaxed">
          Explora la ciencia rigurosa detrás del libro <em>Learned Optimism</em> del Dr. Martin Seligman. 
          Cuatro lecciones esenciales para desarticular distorsiones cognitivas y cultivar resiliencia auténtica.
        </p>
      </div>

      {/* Accordion Magazine Cards */}
      <div className="space-y-5">
        {WIKI_ARTICLES.map((article, index) => {
          const isExpanded = expandedId === article.id;

          return (
            <article
              key={article.id}
              className="bg-[#F3EEE7] rounded-[1.75rem] border border-[#E6DFD5] shadow-tonal overflow-hidden transition-all"
            >
              {/* Accordion Trigger Header */}
              <button
                type="button"
                onClick={() => toggleAccordion(article.id)}
                className="w-full p-6 sm:p-8 text-left flex items-start justify-between gap-4 focus:outline-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#C86D51] font-semibold">
                    <span>{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#647069] font-normal">{article.readTime}</span>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl text-[#333E38] hover:text-[#2E5A44] transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#55635C] line-clamp-2 leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-[#FBF9F5] text-[#2E5A44] border border-[#E6DFD5] shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="px-6 pb-8 sm:px-8 pt-2 border-t border-[#E6DFD5]/80 space-y-6 animate-accordion text-xs sm:text-sm text-[#333E38]">
                  {/* Summary Callout */}
                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] text-[#424F47] leading-relaxed">
                    <strong className="font-semibold text-[#2E5A44] block mb-1">
                      Tesis Central:
                    </strong>
                    {article.summary}
                  </div>

                  {/* Article Sections */}
                  <div className="space-y-6">
                    {article.sections.map((sec, secIdx) => (
                      <div key={secIdx} className="space-y-2">
                        <h3 className="font-serif text-lg font-medium text-[#2E5A44]">
                          {sec.title}
                        </h3>

                        <p className="text-[#55635C] leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                          {sec.content}
                        </p>

                        {sec.keyTakeaway && (
                          <div className="mt-2.5 p-3.5 rounded-xl bg-[#EAEFEA] border border-[#2E5A44]/20 text-xs text-[#2E5A44] font-medium flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-[#2E5A44] shrink-0 mt-0.5" />
                            <span>{sec.keyTakeaway}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* SPECIAL INTERACTIVE WIDGET FOR ARTICLE 3: "Las 3 Dimensiones Atributivas" */}
                  {article.id === 'las-3-dimensiones-del-estilo-explicativo' && (
                    <div className="mt-8 p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-5">
                      <div className="border-b border-[#E6DFD5] pb-3">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                          Laboratorio Interactivo
                        </div>
                        <h4 className="font-serif text-base text-[#333E38]">
                          Simulador de Explicaciones: Transforma el diálogo interno
                        </h4>
                      </div>

                      {/* 3 Interactive Toggle Selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Permanencia */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#2E5A44] block">
                            1. Permanencia
                          </label>
                          <div className="flex rounded-xl p-1 bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                            <button
                              type="button"
                              onClick={() => setSimPermanent('temporal')}
                              className={`flex-1 py-1.5 rounded-lg transition ${simPermanent === 'temporal' ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                            >
                              Temporal
                            </button>
                            <button
                              type="button"
                              onClick={() => setSimPermanent('permanente')}
                              className={`flex-1 py-1.5 rounded-lg transition ${simPermanent === 'permanente' ? 'bg-[#C86D51] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                            >
                              Permanente
                            </button>
                          </div>
                        </div>

                        {/* 2. Amplitud */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#2E5A44] block">
                            2. Amplitud
                          </label>
                          <div className="flex rounded-xl p-1 bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                            <button
                              type="button"
                              onClick={() => setSimPervasive('especifico')}
                              className={`flex-1 py-1.5 rounded-lg transition ${simPervasive === 'especifico' ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                            >
                              Específico
                            </button>
                            <button
                              type="button"
                              onClick={() => setSimPervasive('universal')}
                              className={`flex-1 py-1.5 rounded-lg transition ${simPervasive === 'universal' ? 'bg-[#C86D51] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                            >
                              Universal
                            </button>
                          </div>
                        </div>

                        {/* 3. Personalización */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#2E5A44] block">
                            3. Personalización
                          </label>
                          <div className="flex rounded-xl p-1 bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                            <button
                              type="button"
                              onClick={() => setSimPersonal('contexto')}
                              className={`flex-1 py-1.5 rounded-lg transition ${simPersonal === 'contexto' ? 'bg-[#2E5A44] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                            >
                              Factores
                            </button>
                            <button
                              type="button"
                              onClick={() => setSimPersonal('autoculpa')}
                              className={`flex-1 py-1.5 rounded-lg transition ${simPersonal === 'autoculpa' ? 'bg-[#C86D51] text-[#FBF9F5] font-semibold' : 'text-[#647069]'}`}
                            >
                              Autoculpa
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Resulting Thought Synthesis */}
                      <div className="p-4 rounded-xl bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                        <span className="font-semibold text-[#2E5A44] block mb-1">
                          Cómo sonaría tu mente ante una entrevista de trabajo rechazada:
                        </span>
                        <p className="font-serif text-sm italic text-[#333E38]">
                          {simPermanent === 'permanente' && simPervasive === 'universal' && simPersonal === 'autoculpa' && (
                            "«Nunca voy a conseguir un empleo digno, soy un inepto y mi vida entera es un fracaso total.» (Peligro de indefensión aprendida)"
                          )}
                          {simPermanent === 'temporal' && simPervasive === 'especifico' && simPersonal === 'contexto' && (
                            "«Esta empresa buscaba un perfil específico con otra herramienta. Esta vez no cuadró, pero puedo postularme a otras dos vacantes mañana.» (Optimismo flexible)"
                          )}
                          {(simPermanent !== 'permanente' || simPervasive !== 'universal' || simPersonal !== 'autoculpa') && 
                           (simPermanent !== 'temporal' || simPervasive !== 'especifico' || simPersonal !== 'contexto') && (
                            "«Fue un tropiezo difícil en este proceso puntual, pero hay variables que puedo ajustar para la próxima oportunidad.» (Pauta mixta en progreso)"
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SPECIAL INTERACTIVE WIDGET FOR ARTICLE 4: "El Optimismo Flexible" */}
                  {article.id === 'el-optimismo-flexible' && (
                    <div className="mt-8 p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD5] space-y-4">
                      <div className="border-b border-[#E6DFD5] pb-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                          Árbol de Decisión de Seligman
                        </div>
                        <h4 className="font-serif text-base text-[#333E38]">
                          Calculadora del Costo del Fracaso
                        </h4>
                      </div>

                      <div className="flex gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => setSimCost('bajo')}
                          className={`flex-1 py-3 px-4 rounded-xl border transition text-left flex items-start gap-2.5 ${
                            simCost === 'bajo'
                              ? 'bg-[#EAEFEA] border-[#2E5A44] text-[#2E5A44] font-semibold'
                              : 'bg-[#F3EEE7] border-[#E6DFD5] text-[#647069]'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#2E5A44]" />
                          <div>
                            <div>Costo de fracaso BAJO</div>
                            <div className="text-[11px] font-normal opacity-80 mt-0.5">Intentos sociales, hábitos, llamadas, practicar algo nuevo.</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSimCost('alto')}
                          className={`flex-1 py-3 px-4 rounded-xl border transition text-left flex items-start gap-2.5 ${
                            simCost === 'alto'
                              ? 'bg-[#F8EFEA] border-[#C86D51] text-[#C86D51] font-semibold'
                              : 'bg-[#F3EEE7] border-[#E6DFD5] text-[#647069]'
                          }`}
                        >
                          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#C86D51]" />
                          <div>
                            <div>Costo de fracaso ALTO</div>
                            <div className="text-[11px] font-normal opacity-80 mt-0.5">Patrimonio vital, salud crítica, seguridad física o leyes.</div>
                          </div>
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F3EEE7] border border-[#E6DFD5] text-xs">
                        <strong className="text-[#333E38] block mb-1">
                          Veredicto Metodológico:
                        </strong>
                        {simCost === 'bajo' ? (
                          <span className="text-[#2E5A44] font-medium leading-relaxed block">
                            🌿 <strong>Aplica Optimismo Aprendido sin vacilar:</strong> El costo de equivocarte es efímero y el aprendizaje multiplica tu experiencia. Desafía cualquier voz de pereza o miedo.
                          </span>
                        ) : (
                          <span className="text-[#C86D51] font-medium leading-relaxed block">
                            🛡️ <strong>Aplica Pesimismo Prudente / Realista:</strong> No uses autoengaños. Audita los números, prevé el peor escenario y asegura salvaguardas antes de tomar cualquier decisión irrevocable.
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
