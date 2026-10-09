import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X as XIcon, 
  ArrowRight, 
  ShieldCheck, 
  Brain, 
  Flame, 
  Cloud, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  HeartHandshake, 
  HelpCircle, 
  CheckCircle2, 
  Compass, 
  Zap, 
  Volume2
} from 'lucide-react';
import { PlanTier, VanWestendorpResponse } from '../types';
import { PRICING_PLANS, TESTIMONIALS, FAQS } from '../data/pricingData';
import { VanWestendorpWidget } from './VanWestendorpWidget';

interface MicroSaasLandingTabProps {
  currentPlan: PlanTier;
  onSelectPlanToUpgrade: (plan: PlanTier) => void;
  onGoToGym: () => void;
  onOpenClinicalReport: () => void;
  onSurveyCompleted?: (survey: VanWestendorpResponse) => void;
  hasCompletedSurvey?: boolean;
  bonusCreditsEarned?: number;
}

export const MicroSaasLandingTab: React.FC<MicroSaasLandingTabProps> = ({
  currentPlan,
  onSelectPlanToUpgrade,
  onGoToGym,
  onOpenClinicalReport,
  onSurveyCompleted,
  hasCompletedSurvey = false,
  bonusCreditsEarned = 0,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20 animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 pt-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2E5A44]/10 border border-[#2E5A44]/20 text-[#2E5A44] text-xs font-semibold shadow-tonal-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#2E5A44]" />
          <span>MicroSaaS de Salud Cognitiva • Metodología Universidad de Pensilvania</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#333E38] tracking-tight leading-[1.15] font-medium">
          Transforma la rumiación mental en <span className="text-[#2E5A44] italic">optimismo científico</span>
        </h1>

        <p className="text-base sm:text-lg text-[#55635C] max-w-2xl mx-auto leading-relaxed">
          El primer gimnasio cognitivo interactivo basado estrictamente en el modelo ABCDE del Dr. Martin Seligman. Cero positivismo tóxico, precisión socrática y persistencia en la nube.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => onSelectPlanToUpgrade('pro')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-semibold text-sm transition shadow-tonal-md flex items-center justify-center gap-2"
          >
            <span>Comenzar Prueba Pro Gratis (14 Días)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onGoToGym}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F3EEE7] hover:bg-[#EAE4DB] text-[#333E38] font-semibold text-sm border border-[#E6DFD5] transition flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4 text-[#C86D51]" />
            <span>Probar Ejercicio ABCDE Gratis</span>
          </button>
        </div>

        {/* Floating Social Proof Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#647069]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E5A44]" />
            <span>Más de 1,200 mentes entrenadas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E5A44]" />
            <span>-45% Rumiación promedio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E5A44]" />
            <span>Garantía de 30 días sin riesgo</span>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM VS SOLUTION MATRIX */}
      <section className="bg-[#F3EEE7] rounded-3xl p-8 sm:p-12 border border-[#E6DFD5] shadow-tonal space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#333E38]">
            Por qué el &ldquo;pensar positivo&rdquo; no funciona
          </h2>
          <p className="text-xs sm:text-sm text-[#647069]">
            La mente humana detecta y rechaza las afirmaciones vacías. La reestructuración requiere rigor y evidencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* The Problem */}
          <div className="bg-[#FBF9F5] p-6 rounded-2xl border border-rose-200/60 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-800 font-semibold text-sm">
              <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-xs">✕</span>
              <span>El Enfoque Tradicional Superficial</span>
            </div>
            <ul className="space-y-3 text-xs text-[#55635C]">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Afirmaciones vacías:</strong> &ldquo;Todo saldrá bien&rdquo; no convence a tu cerebro analítico ante un fracaso real.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Impotencia Aprendida:</strong> Creer que el problema es permanente (&ldquo;siempre&rdquo;) y universal (&ldquo;todo&rdquo;).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Positivismo tóxico:</strong> Invalidar emociones legítimas y forzar una sonrisa cuando hay dolor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Rumiación nocturna:</strong> Dar vueltas en bucle sin un plan de acción concreto ni disputa objetiva.</span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="bg-[#FBF9F5] p-6 rounded-2xl border border-emerald-200/60 space-y-4">
            <div className="flex items-center gap-2.5 text-[#2E5A44] font-semibold text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">✓</span>
              <span>La Metodología Científica de OptiMind</span>
            </div>
            <ul className="space-y-3 text-xs text-[#55635C]">
              <li className="flex items-start gap-2">
                <span className="text-[#2E5A44] font-bold">•</span>
                <span><strong>Auditoría de Hechos (Seligman):</strong> Separar la adversidad fáctica de las interpretaciones catastrofistas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2E5A44] font-bold">•</span>
                <span><strong>4 Cartas de Disputa:</strong> Buscar evidencia real, generar alternativas específicas y medir el costo real.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2E5A44] font-bold">•</span>
                <span><strong>Optimismo Flexible:</strong> Discernir cuándo ser optimista y cuándo usar realismo prudente según el riesgo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2E5A44] font-bold">•</span>
                <span><strong>Energización & Plan:</strong> Salir del bucle mental con un paso de acción claro y medible.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT TOUR & VALUE PILLARS */}
      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#2E5A44] uppercase tracking-wider">
            Arquitectura MicroSaaS
          </span>
          <h2 className="font-serif text-3xl text-[#333E38]">
            Todo lo que necesitas para tu fortaleza cognitiva
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E5A44] text-white flex items-center justify-center text-base">
              🧠
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#333E38]">
              Gimnasio ABCDE Interactivo
            </h3>
            <p className="text-xs text-[#55635C] leading-relaxed">
              Asistente guiado de 5 pasos con divulgación progresiva. Identifica tu creencia, evalúa su intensidad y refútala en menos de 4 minutos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C86D51] text-white flex items-center justify-center text-base">
              🌿
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#333E38]">
              Santuario & Sonido Zen
            </h3>
            <p className="text-xs text-[#55635C] leading-relaxed">
              Check-in de serenidad diario, paisajismo sonoro de lluvia generado en tiempo real y reflexiones diarias del Dr. Seligman para empezar con presencia.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E5A44] text-white flex items-center justify-center text-base">
              📄
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#333E38]">
              Reporte Clínico Descargable
            </h3>
            <p className="text-xs text-[#55635C] leading-relaxed">
              Genera informes ejecutivos de tu pauta explicativa y alivio emocional listos para imprimir o compartir con tu terapeuta cognitivo.
            </p>
          </div>
        </div>

        {/* Clinical Report Preview Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2E5A44]/10 via-[#F3EEE7] to-[#C86D51]/10 border border-[#2E5A44]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E5A44] text-[#FBF9F5] flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-[#333E38]">
                ¿Quieres ver cómo luce un Informe Clínico OptiMind?
              </h4>
              <p className="text-xs text-[#55635C]">
                Incluye métricas de permanencia, amplitud, personalización y registro de alivio emocional.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenClinicalReport}
            className="px-4 py-2 rounded-xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] text-xs font-semibold transition shrink-0 shadow-tonal-sm flex items-center gap-1.5"
          >
            <span>Ver Demo de Informe Clínico</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. INTERACTIVE PRICING TABLE */}
      <section id="pricing" className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-[#2E5A44] uppercase tracking-wider">
            Planes y Precios Transparentes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#333E38]">
            Invierte en tu tranquilidad cognitiva
          </h2>
          <p className="text-xs sm:text-sm text-[#647069]">
            Comienza gratis o accede a la suite completa con garantía de reembolso de 30 días.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center p-1.5 bg-[#F3EEE7] rounded-2xl border border-[#E6DFD5] mt-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-[#2E5A44] text-[#FBF9F5] shadow-tonal-sm'
                  : 'text-[#55635C] hover:text-[#333E38]'
              }`}
            >
              Facturación Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#2E5A44] text-[#FBF9F5] shadow-tonal-sm'
                  : 'text-[#55635C] hover:text-[#333E38]'
              }`}
            >
              <span>Facturación Anual</span>
              <span className="bg-[#C86D51] text-[#FBF9F5] text-[10px] px-2 py-0.5 rounded-full font-bold">
                Ahorra 25% con pago anual / 2 meses gratis
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            const period = billingCycle === 'yearly' ? '/año' : '/mes';

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-[#FBF9F5] border-2 border-[#2E5A44] shadow-tonal-lg relative'
                    : 'bg-[#F3EEE7] border border-[#E6DFD5]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2E5A44] text-[#FBF9F5] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-tonal-sm">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#333E38]">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#647069] mt-1 min-h-[32px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E6DFD5]">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-4xl font-bold text-[#333E38]">
                        ${price}
                      </span>
                      <span className="text-xs text-[#647069]">
                        USD {plan.priceMonthly > 0 ? period : ''}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && plan.priceMonthly > 0 && (
                      <span className="text-[11px] text-[#2E5A44] font-medium block mt-1">
                        Equivalente a ${(plan.priceYearly / 12).toFixed(1)} USD/mes
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-semibold text-[#647069] uppercase tracking-wider block">
                      Incluido en este plan:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#55635C]">
                        <Check className="w-4 h-4 text-[#2E5A44] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    {plan.notIncluded && plan.notIncluded.map((notFeat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#8C9891] opacity-70">
                        <XIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{notFeat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E6DFD5]">
                  <button
                    onClick={() => {
                      if (plan.id === 'free') {
                        onGoToGym();
                      } else {
                        onSelectPlanToUpgrade(plan.id);
                      }
                    }}
                    className={`w-full py-3 rounded-2xl font-semibold text-xs tracking-wide transition shadow-tonal-sm flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-300 text-slate-700 cursor-default'
                        : plan.popular
                        ? 'bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5]'
                        : 'bg-[#FBF9F5] hover:bg-[#EAE4DB] text-[#333E38] border border-[#E6DFD5]'
                    }`}
                  >
                    <span>{isCurrent ? 'Plan Activo' : plan.ctaText}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Pricing Research Widget (Van Westendorp PSM Survey) */}
        {onSurveyCompleted && (
          <div className="pt-4">
            <VanWestendorpWidget
              onSurveyCompleted={onSurveyCompleted}
              hasCompletedSurvey={hasCompletedSurvey}
              bonusCreditsEarned={bonusCreditsEarned}
            />
          </div>
        )}
      </section>

      {/* 5. TESTIMONIALS & CLINICAL ENDORSEMENTS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#2E5A44] uppercase tracking-wider">
            Casos de Éxito & Autoridad
          </span>
          <h2 className="font-serif text-3xl text-[#333E38]">
            Diseñado para mentes analíticas de alto rendimiento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div 
              key={item.id} 
              className="p-6 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="inline-block text-[10px] font-semibold text-[#2E5A44] bg-[#2E5A44]/10 px-2.5 py-1 rounded-full">
                  {item.metric}
                </span>
                <p className="text-xs text-[#55635C] leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#E6DFD5] flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border border-[#2E5A44]/30"
                />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#333E38] leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#647069]">
                    {item.role} • {item.institution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#2E5A44] uppercase tracking-wider">
            Respuestas Claras
          </span>
          <h2 className="font-serif text-3xl text-[#333E38]">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isExpanded = expandedFaqIndex === index;
            return (
              <div 
                key={index}
                className="rounded-2xl border border-[#E6DFD5] bg-[#F3EEE7] overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-medium text-[#333E38]"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#2E5A44] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#647069] shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 text-xs text-[#55635C] leading-relaxed border-t border-[#E6DFD5]/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="bg-[#2E5A44] text-[#FBF9F5] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-tonal-xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
            Comienza a cultivar tu resiliencia mental hoy
          </h2>
          <p className="text-sm text-[#FBF9F5]/85">
            Únete a cientos de profesionales y practicantes que superaron la impotencia aprendida con el protocolo ABCDE.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onSelectPlanToUpgrade('pro')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#FBF9F5] text-[#2E5A44] hover:bg-white font-semibold text-xs tracking-wide transition shadow-tonal-sm"
          >
            Obtener Santuario Pro (14 Días Gratis)
          </button>
          <button
            onClick={onGoToGym}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#244836] text-[#FBF9F5] hover:bg-[#1E3C2D] font-semibold text-xs border border-white/20 transition"
          >
            Entrar al Gimnasio ABCDE
          </button>
        </div>

        <div className="pt-2 text-[11px] text-[#FBF9F5]/70 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Sin compromisos de permanencia • Cancela en cualquier momento en 1 clic</span>
        </div>
      </section>
    </div>
  );
};
