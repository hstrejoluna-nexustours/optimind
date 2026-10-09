import React, { useState } from 'react';
import { 
  Compass, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Scale,
  Feather
} from 'lucide-react';

interface RiskMatrixWidgetProps {
  onApplyScenarioToWizard?: (adversityPreset: string, beliefPreset: string, costOfFailure: 'low' | 'high' | 'moderate') => void;
}

export const RiskMatrixWidget: React.FC<RiskMatrixWidgetProps> = ({
  onApplyScenarioToWizard,
}) => {
  const [selectedCost, setSelectedCost] = useState<'low' | 'high' | 'moderate'>('low');

  const presetScenarios = [
    {
      title: 'Hacer una llamada incómoda o pedir una oportunidad',
      category: 'Social & Aprendizaje',
      costLevel: 'low' as const,
      costDescription: 'El peor desenlace es una negativa educada o un momento de incomodidad pasajera.',
      recommendation: 'Optimismo Flexible',
      adversityExample: 'El cliente no aceptó la propuesta en la primera llamada.',
      beliefExample: 'No tengo talento para esto, solo hago perder el tiempo.',
      rationale: 'El costo del rechazo es transitorio. El beneficio de intentarlo es alto y la experiencia te da soltura.',
    },
    {
      title: 'Comprometer todos los ahorros familiares en una aventura no probada',
      category: 'Patrimonio & Seguridad',
      costLevel: 'high' as const,
      costDescription: 'El peor desenlace es comprometer la estabilidad básica del hogar.',
      recommendation: 'Pesimismo Prudente',
      adversityExample: 'Las proyecciones del proyecto muestran un déficit severo a corto plazo.',
      beliefExample: 'Seguro saldrá bien solo con entusiasmo y fe.',
      rationale: 'Seligman enfatiza: cuando el costo del fracaso es irreversible, la duda metódica y el realismo cauto son los mejores protectores.',
    },
    {
      title: 'Empezar a practicar una disciplina física o un nuevo hábito',
      category: 'Crecimiento Personal',
      costLevel: 'low' as const,
      costDescription: 'El costo de tener días lentos o fallar una sesión es nulo para tu integridad.',
      recommendation: 'Optimismo Flexible',
      adversityExample: 'Solo alcancé a entrenar 1 día de los 3 que había planeado.',
      beliefExample: 'No tengo fuerza de voluntad para esto.',
      rationale: 'No hay peligro alguno. Tratar el tropiezo con benevolencia te ayuda a retomar la rutina sin culpa.',
    },
    {
      title: 'Decisión médica importante o procedimiento delicado',
      category: 'Salud & Vida',
      costLevel: 'high' as const,
      costDescription: 'Las consecuencias de actuar a ciegas pueden afectar el bienestar corporal permanente.',
      recommendation: 'Pesimismo Prudente',
      adversityExample: 'El diagnóstico plantea dudas sobre secuelas a largo plazo.',
      beliefExample: 'No pasa nada, seguro no habrá complicaciones.',
      rationale: 'El realismo prudente salva vidas: solicita segundas opiniones y revisa los protocolos con frialdad analítica.',
    }
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#1A1F1C] rounded-[2rem] p-8 sm:p-10 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs">
        <div className="flex items-center gap-3 text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium mb-2">
          <span>Discernimiento Inteligente</span>
          <span aria-hidden="true">·</span>
          <span>Regla de Oro de Martin Seligman</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#282D2A] dark:text-[#F0F3EF]">
          La Brújula del Costo del Fracaso
        </h1>
        <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-2 max-w-2xl leading-relaxed">
          El optimismo no debe aplicarse a ciegas. La sabiduría radica en calibrar el impacto real: 
          si el costo del fracaso es leve, atrévete con optimismo; si el costo es grave, acude al pesimismo prudente.
        </p>

        {/* Core quote box */}
        <div className="mt-6 p-5 rounded-2xl bg-[#F7F3EB] dark:bg-[#222724] border border-[#EBE4D7] dark:border-[#2D332F] text-xs text-[#5A635C] dark:text-[#BAC0BB] leading-relaxed italic">
          &ldquo;La guía para utilizar el optimismo aprendido es preguntarse: ¿Cuál es el costo del fracaso? 
          Si el costo es muy alto, no use optimismo. Pero si el costo del fracaso es bajo, use todo el optimismo posible.&rdquo;
        </div>
      </div>

      {/* Decision Tree Interactive Tabs */}
      <div className="bg-white/90 dark:bg-[#1A1F1C] rounded-[2rem] p-8 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs space-y-6">
        <div>
          <h2 className="font-serif text-xl text-[#282D2A] dark:text-[#F0F3EF]">
            Evalúa el costo real para tu situación actual:
          </h2>
          <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-0.5">
            Selecciona la opción que mejor describa la naturaleza de tu reto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedCost('low')}
            className={`p-5 rounded-2xl text-left transition-all border ${
              selectedCost === 'low'
                ? 'bg-[#EFF4EE] dark:bg-[#1C251E] border-[#5F7A61] shadow-2xs'
                : 'bg-[#FAF7F2] dark:bg-[#202522] border-[#EDE7DD] dark:border-[#2A312B] hover:border-[#D5CCC0]'
            }`}
          >
            <div className="text-xs text-[#4A644C] dark:text-[#A8BEA7] font-semibold mb-1">
              Costo Bajo
            </div>
            <h3 className="font-serif text-base text-[#282D2A] dark:text-[#F0F3EF]">
              Riesgo Social o Emocional
            </h3>
            <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1.5 leading-relaxed">
              Intentos, llamadas, nuevas ideas, aprender algo nuevo o pedir ayuda.
            </p>
          </button>

          <button
            onClick={() => setSelectedCost('moderate')}
            className={`p-5 rounded-2xl text-left transition-all border ${
              selectedCost === 'moderate'
                ? 'bg-[#F9F5EC] dark:bg-[#26241D] border-[#C98A42] shadow-2xs'
                : 'bg-[#FAF7F2] dark:bg-[#202522] border-[#EDE7DD] dark:border-[#2A312B] hover:border-[#D5CCC0]'
            }`}
          >
            <div className="text-xs text-[#C98A42] font-semibold mb-1">
              Costo Moderado
            </div>
            <h3 className="font-serif text-base text-[#282D2A] dark:text-[#F0F3EF]">
              Decisiones con Red de Seguridad
            </h3>
            <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1.5 leading-relaxed">
              Cambios de proyecto, compras medianas o acuerdos reversibles.
            </p>
          </button>

          <button
            onClick={() => setSelectedCost('high')}
            className={`p-5 rounded-2xl text-left transition-all border ${
              selectedCost === 'high'
                ? 'bg-[#F9EEEE] dark:bg-[#281E1E] border-[#C46A6A] shadow-2xs'
                : 'bg-[#FAF7F2] dark:bg-[#202522] border-[#EDE7DD] dark:border-[#2A312B] hover:border-[#D5CCC0]'
            }`}
          >
            <div className="text-xs text-[#C46A6A] font-semibold mb-1">
              Costo Alto
            </div>
            <h3 className="font-serif text-base text-[#282D2A] dark:text-[#F0F3EF]">
              Riesgo Vital o Patrimonial
            </h3>
            <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1.5 leading-relaxed">
              Inversiones de vida, salud crítica, seguridad física o temas legales.
            </p>
          </button>
        </div>

        {/* Verdict Box */}
        <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium">
              Veredicto de Sabiduría
            </span>
            <span className="text-xs font-semibold text-[#282D2A] dark:text-[#F0F3EF]">
              {selectedCost === 'low' ? 'Adelante con serenidad' : selectedCost === 'moderate' ? 'Avanzar con precaución' : 'Pausar y auditar riesgos'}
            </span>
          </div>

          <h3 className="font-serif text-xl text-[#282D2A] dark:text-[#F0F3EF]">
            {selectedCost === 'low' && '✨ Aplica Optimismo Flexible y Acción Serene'}
            {selectedCost === 'moderate' && '⚖️ Enfoque Híbrido: Optimismo con Salvaguarda'}
            {selectedCost === 'high' && '🛡️ Aplica Pesimismo Prudente & Realista'}
          </h3>

          <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
            {selectedCost === 'low' && (
              'El costo de equivocarte es infinitamente menor que el peso del arrepentimiento por no haberlo intentado. Si surge un contratiempo, desafía cualquier voz que te diga que es permanente.'
            )}
            {selectedCost === 'moderate' && (
              'Asegura un plan B sencillo. Una vez que tengas un piso de tranquilidad, ejecuta tu proyecto sin dejarte atrapar por la indecisión perfeccionista.'
            )}
            {selectedCost === 'high' && (
              'Aquí el pesimismo realista es una virtud noble. La prudencia y la cautela protegen lo que más valoras. No te dejes llevar por euforias vacías.'
            )}
          </p>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-normal text-[#282D2A] dark:text-[#F0F3EF]">
            Casos de Estudio de la Vida Cotidiana
          </h2>
          <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1">
            Aprende a distinguir situaciones según la matriz de Seligman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {presetScenarios.map((sc, idx) => (
            <div 
              key={idx}
              className="bg-white/80 dark:bg-[#1A1F1C] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#727874] dark:text-[#8E9590] mb-2">
                  <span>{sc.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium">{sc.recommendation}</span>
                </div>

                <h3 className="font-serif text-base text-[#282D2A] dark:text-[#F0F3EF]">
                  {sc.title}
                </h3>
                <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] mt-1.5 leading-relaxed">
                  {sc.costDescription}
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-[#F7F3EB] dark:bg-[#222724] text-xs text-[#5D635F] dark:text-[#B6BCB7] leading-relaxed">
                  {sc.rationale}
                </div>
              </div>

              {onApplyScenarioToWizard && (
                <div className="mt-5 pt-3 border-t border-[#F2ECE2] dark:border-[#282E2A] flex justify-end">
                  <button
                    onClick={() => onApplyScenarioToWizard(sc.adversityExample, sc.beliefExample, sc.costLevel)}
                    className="text-xs font-semibold text-[#4A644C] dark:text-[#A8BEA7] hover:underline flex items-center gap-1"
                  >
                    <span>Llevar a reflexión ABCDE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
