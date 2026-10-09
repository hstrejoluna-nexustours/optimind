import React, { useState } from 'react';
import { 
  Compass, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  DollarSign,
  HeartHandshake,
  Activity,
  Briefcase,
  Scale
} from 'lucide-react';

interface RiskMatrixWidgetProps {
  onApplyScenarioToWizard?: (adversityPreset: string, beliefPreset: string, costOfFailure: 'low' | 'high' | 'moderate') => void;
}

interface ScenarioTemplate {
  title: string;
  category: string;
  icon: any;
  costLevel: 'low' | 'high' | 'moderate';
  costDescription: string;
  recommendation: 'flexible_optimism' | 'prudent_realism';
  adversityExample: string;
  beliefExample: string;
  rationale: string;
  actionItems: string[];
}

export const RiskMatrixWidget: React.FC<RiskMatrixWidgetProps> = ({
  onApplyScenarioToWizard,
}) => {
  const [selectedCost, setSelectedCost] = useState<'low' | 'high' | 'moderate'>('low');
  const [customSituation, setCustomSituation] = useState('');
  const [customCostAssessment, setCustomCostAssessment] = useState<'low' | 'high' | 'moderate'>('low');

  const presetScenarios: ScenarioTemplate[] = [
    {
      title: 'Hacer una llamada fría o pedir un aumento',
      category: 'Profesional / Social',
      icon: Briefcase,
      costLevel: 'low',
      costDescription: 'El peor desenlace es escuchar un "no" temporal o un rechazo incómodo de 5 minutos.',
      recommendation: 'flexible_optimism',
      adversityExample: 'El cliente no aceptó la propuesta en la primera llamada.',
      beliefExample: 'No tengo talento para vender, solo hago perder el tiempo.',
      rationale: 'El costo del rechazo es puramente emocional y transitorio. El beneficio potencial de intentarlo es alto y el aprendizaje acelera tu crecimiento.',
      actionItems: [
        'Aplica Optimismo Aprendido sin titubeos.',
        'Atribuye el "no" a causas temporales y específicas (momento inoportuno, falta de presupuesto actual).',
        'Haz 3 intentos adicionales hoy mismo para normalizar la exposición.',
      ]
    },
    {
      title: 'Inversión de los ahorros de toda la vida en un negocio no probado',
      category: 'Financiero / Patrimonial',
      icon: DollarSign,
      costLevel: 'high',
      costDescription: 'El peor desenlace es la quiebra personal o la pérdida irreversible de tu estabilidad económica.',
      recommendation: 'prudent_realism',
      adversityExample: 'Los números de proyección del negocio muestran un déficit del 40% en los primeros meses.',
      beliefExample: 'No pasa nada, con buena actitud y pasión todo saldrá bien.',
      rationale: 'Seligman advierte: si el costo del fracaso es catastrófico o irreversible, NO utilices optimismo ciego. Emplea Pesimismo Prudente para auditar riesgos rigurosamente.',
      actionItems: [
        'Aplica Pesimismo Prudente / Realista.',
        'Contrata una auditoría externa imparcial de riesgos.',
        'Establece un límite de pérdida estricto (stop-loss) antes de comprometer fondos.',
        'No actúes por mero entusiasmo irracional.',
      ]
    },
    {
      title: 'Comenzar a aprender un nuevo instrumento o deporte',
      category: 'Desarrollo Personal',
      icon: Activity,
      costLevel: 'low',
      costDescription: 'El costo de sonar desafinado o cometer errores técnicos es cero en términos de integridad física.',
      recommendation: 'flexible_optimism',
      adversityExample: 'No logré coordinar el ritmo en las primeras 3 clases.',
      beliefExample: 'Soy torpe por naturaleza, nunca tocaré bien.',
      rationale: 'Cero riesgo existencial. Rendirse aquí por atribución pesimista es la clásica trampa de indefensión aprendida.',
      actionItems: [
        'Aplica Optimismo Flexible.',
        'Acepta el fallo inicial como parte natural de la mielinización neuronal.',
        'Practica micro-sesiones de 10 minutos enfocadas en una sola nota.',
      ]
    },
    {
      title: 'Decisión médica delicada o cirugía invasiva opcional',
      category: 'Salud / Biológico',
      icon: Scale,
      costLevel: 'high',
      costDescription: 'El costo de una complicación puede comprometer la salud permanentemente.',
      recommendation: 'prudent_realism',
      adversityExample: 'El diagnóstico presenta dudas sobre secuelas a largo plazo.',
      beliefExample: 'Seguro todo saldrá perfecto sin pedir una segunda opinión.',
      rationale: 'Pesimismo Prudente: la duda metódica salva vidas. Exige segundas opiniones y revisa los peores escenarios antes de firmar consentimientos.',
      actionItems: [
        'Aplica Pesimismo Prudente / Realista.',
        'Solicita segundas opiniones médicas especializadas.',
        'Pregunta por tasas de complicación y planes de contingencia hospitalarios.',
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Regla del Optimismo Flexible de Seligman
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              ¿Cuándo usar Optimismo Aprendido y cuándo recurrir al Pesimismo Prudente?
            </p>
          </div>
        </div>

        {/* Seligman Core Principle Box */}
        <div className="mt-4 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs sm:text-sm text-teal-900 dark:text-teal-200 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">El axioma fundamental de Martin Seligman:</strong>
            <p className="mt-0.5">
              &ldquo;La guía para utilizar el optimismo aprendido es preguntarse: <em>¿Cuál es el costo del fracaso?</em> Si el costo es muy alto, no use optimismo. Pero si el costo del fracaso es bajo, use todo el optimismo posible.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Decision Tree Matrix Calculator */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Calculadora Rápida: Evalúa tu Situación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Low Cost */}
          <button
            onClick={() => setSelectedCost('low')}
            className={`p-5 rounded-2xl text-left border transition-all ${
              selectedCost === 'low'
                ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 ring-2 ring-teal-500/30'
                : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Costo Bajo
              </span>
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Riesgo Social, Emocional o de Práctica
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ejemplos: iniciar una conversación, enviar un CV, entrenar, proponer una idea en junta.
            </p>
          </button>

          {/* Option 2: Moderate Cost */}
          <button
            onClick={() => setSelectedCost('moderate')}
            className={`p-5 rounded-2xl text-left border transition-all ${
              selectedCost === 'moderate'
                ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-500 ring-2 ring-amber-500/30'
                : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Costo Moderado
              </span>
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Compromiso de Recursos con Red de Seguridad
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ejemplos: cambiar de proyecto interno, mudanza local, lanzar una versión beta controlada.
            </p>
          </button>

          {/* Option 3: High Cost */}
          <button
            onClick={() => setSelectedCost('high')}
            className={`p-5 rounded-2xl text-left border transition-all ${
              selectedCost === 'high'
                ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/30'
                : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                Costo Alto
              </span>
              <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Riesgo Físico, Legal o Financiero Grave
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ejemplos: apostar patrimonio, deportes extremos sin equipo, ignorar síntomas graves.
            </p>
          </button>
        </div>

        {/* Selected Result Box */}
        <div className="mt-6 p-6 rounded-2xl border transition-all bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Veredicto Metodológico
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-2">
                {selectedCost === 'low' && (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400">✨ Optimismo Flexible y Audaz</span>
                  </>
                )}
                {selectedCost === 'moderate' && (
                  <>
                    <span className="text-amber-600 dark:text-amber-400">⚖️ Enfoque Híbrido: Optimismo con Contingencia</span>
                  </>
                )}
                {selectedCost === 'high' && (
                  <>
                    <span className="text-rose-600 dark:text-rose-400">🛡️ Pesimismo Prudente / Realista Estricto</span>
                  </>
                )}
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              selectedCost === 'low'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                : selectedCost === 'moderate'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300'
            }`}>
              {selectedCost === 'low' ? 'Priorizar Acción' : selectedCost === 'moderate' ? 'Acción Calibrada' : 'Priorizar Auditoría'}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedCost === 'low' && (
              "El costo de fallar es minúsculo en comparación con el costo del arrepentimiento por no intentarlo. Si sufres un rechazo o tropiezo, disputa de inmediato cualquier creencia automática de ineptitud permanente. ¡Actúa hoy!"
            )}
            {selectedCost === 'moderate' && (
              "Prepara un plan de escape o salvaguarda mínima. Una vez cubierto ese piso de seguridad, aplica optimismo para ejecutar con determinación sin paralizarte por perfeccionismo."
            )}
            {selectedCost === 'high' && (
              "El Dr. Seligman enfatiza que en momentos de alto riesgo, los pesimistas ven la realidad con mayor exactitud métrica. Escucha las señales de peligro, elabora un análisis pre-mortem y asegura seguros antes de dar un solo paso."
            )}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ¿Tienes una creencia automática ligada a esta situación?
            </span>
            {onApplyScenarioToWizard && (
              <button
                onClick={() => onApplyScenarioToWizard(
                  `Situación evaluada con costo de fracaso: ${selectedCost.toUpperCase()}`,
                  selectedCost === 'high' ? 'Podría salir mal y debo estar alerta a las fallas.' : 'Tengo miedo a que me rechacen o no salga perfecto.',
                  selectedCost
                )}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Trabajar en el Gimnasio ABCDE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Scenarios Library */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Casos de Estudio según Seligman
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {presetScenarios.map((sc, idx) => {
            const IconComponent = sc.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {sc.category}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      sc.costLevel === 'low'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200'
                    }`}>
                      {sc.costLevel === 'low' ? 'Costo Bajo' : 'Costo Alto'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {sc.costDescription}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Criterio:</p>
                    <p className="mt-0.5 leading-relaxed">{sc.rationale}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                    {sc.recommendation === 'flexible_optimism' ? 'Optimismo Aprendido' : 'Pesimismo Prudente'}
                  </span>

                  {onApplyScenarioToWizard && (
                    <button
                      onClick={() => onApplyScenarioToWizard(sc.adversityExample, sc.beliefExample, sc.costLevel)}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 transition"
                    >
                      <span>Entrenar caso</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
