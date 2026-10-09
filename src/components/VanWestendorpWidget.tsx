import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
  TrendingUp, 
  Award,
  DollarSign,
  HeartHandshake
} from 'lucide-react';
import { VanWestendorpResponse } from '../types';
import { sounds } from '../utils/audio';

interface VanWestendorpWidgetProps {
  onSurveyCompleted: (survey: VanWestendorpResponse) => void;
  hasCompletedSurvey: boolean;
  bonusCreditsEarned: number;
}

const STORAGE_KEY = 'optimind_van_westendorp_v1';

export const VanWestendorpWidget: React.FC<VanWestendorpWidgetProps> = ({
  onSurveyCompleted,
  hasCompletedSurvey,
  bonusCreditsEarned
}) => {
  const [tooCheap, setTooCheap] = useState<number>(3);
  const [cheap, setCheap] = useState<number>(7);
  const [expensive, setExpensive] = useState<number>(15);
  const [tooExpensive, setTooExpensive] = useState<number>(25);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(hasCompletedSurvey);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitted(hasCompletedSurvey);
  }, [hasCompletedSurvey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sounds.playSuccessChime();

    const response: VanWestendorpResponse = {
      tooCheap,
      cheap,
      expensive,
      tooExpensive,
      submittedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSurveyCompleted(response);
    }, 400);
  };

  // Calculate estimated optimal price point from user's perception
  const estimatedOptimal = ((cheap + expensive) / 2).toFixed(2);

  return (
    <div className="bg-[#F3EEE7] rounded-3xl p-7 sm:p-9 border border-[#E6DFD5] shadow-tonal space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5]/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E5A44]/10 text-[#2E5A44] text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investigación de Sensibilidad de Precios (Van Westendorp PSM)</span>
          </div>
          <h3 className="font-serif text-2xl text-[#333E38] font-normal">
            Ayúdanos a ajustar nuestro precio justo
          </h3>
          <p className="text-xs sm:text-sm text-[#55635C] mt-1 max-w-xl leading-relaxed">
            Queremos que la reestructuración cognitiva sea accesible y sostenible. Tu percepción calibra nuestro modelo económico.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-[#FBF9F5] px-4 py-2.5 rounded-2xl border border-[#E6DFD5]">
          <Award className="w-5 h-5 text-[#C86D51]" />
          <div className="text-left text-xs">
            <span className="font-bold text-[#333E38] block">+1 Ejercicio Extra</span>
            <span className="text-[#647069] text-[10px]">
              {isSubmitted ? 'Recompensa desbloqueada' : 'Al completar encuesta'}
            </span>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-[#FBF9F5] rounded-2xl p-6 sm:p-8 text-center space-y-3 border border-emerald-200/80 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E5A44] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-xl font-medium text-[#333E38]">
            ¡Muchas gracias por tu contribución honesta!
          </h4>
          <p className="text-xs text-[#55635C] max-w-md mx-auto leading-relaxed">
            Hemos acreditado <strong className="text-[#2E5A44]">+1 ejercicio mensual adicional</strong> a tu cuenta ({bonusCreditsEarned} bono activo). Tu evaluación nos ayuda a mantener OptiMind a un precio equilibrado y ético.
          </p>
          <div className="pt-2 text-xs text-[#647069] flex items-center justify-center gap-4">
            <span>Tu rango ideal percibido: <strong>${cheap} - ${expensive} USD/mes</strong></span>
            <span>•</span>
            <span>Punto medio óptimo: <strong>${estimatedOptimal} USD</strong></span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Slider 1: Demasiado barato */}
            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E6DFD5] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wide block">
                    1. Demasiado Barato
                  </span>
                  <p className="text-xs text-[#55635C] mt-0.5">
                    ¿A qué precio dudarías de su calidad o rigor científico?
                  </p>
                </div>
                <span className="font-serif text-lg font-bold text-[#333E38] bg-[#F3EEE7] px-2.5 py-1 rounded-xl">
                  ${tooCheap} <span className="text-[10px] text-[#647069]">USD</span>
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={tooCheap}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTooCheap(val);
                  if (cheap <= val) setCheap(val + 2);
                  if (expensive <= val + 2) setExpensive(val + 6);
                  if (tooExpensive <= val + 6) setTooExpensive(val + 12);
                }}
                className="w-full h-2 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer accent-[#2E5A44]"
              />
              <div className="flex justify-between text-[10px] text-[#647069]">
                <span>$1 USD</span>
                <span>$20 USD</span>
              </div>
            </div>

            {/* Slider 2: Ganga / Gran Oferta */}
            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E6DFD5] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-[#2E5A44] uppercase tracking-wide block">
                    2. Ganga / Gran Oferta
                  </span>
                  <p className="text-xs text-[#55635C] mt-0.5">
                    ¿A qué precio sería una compra excelente sin pensarlo?
                  </p>
                </div>
                <span className="font-serif text-lg font-bold text-[#2E5A44] bg-[#F3EEE7] px-2.5 py-1 rounded-xl">
                  ${cheap} <span className="text-[10px] text-[#647069]">USD</span>
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={cheap}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCheap(val);
                  if (tooCheap >= val) setTooCheap(Math.max(1, val - 2));
                  if (expensive <= val) setExpensive(val + 4);
                  if (tooExpensive <= val + 4) setTooExpensive(val + 10);
                }}
                className="w-full h-2 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer accent-[#2E5A44]"
              />
              <div className="flex justify-between text-[10px] text-[#647069]">
                <span>$2 USD</span>
                <span>$30 USD</span>
              </div>
            </div>

            {/* Slider 3: Caro */}
            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E6DFD5] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-[#C86D51] uppercase tracking-wide block">
                    3. Caro pero Consideraría
                  </span>
                  <p className="text-xs text-[#55635C] mt-0.5">
                    ¿A qué precio empezarías a dudar pero aún lo pagarías?
                  </p>
                </div>
                <span className="font-serif text-lg font-bold text-[#C86D51] bg-[#F3EEE7] px-2.5 py-1 rounded-xl">
                  ${expensive} <span className="text-[10px] text-[#647069]">USD</span>
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={expensive}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setExpensive(val);
                  if (cheap >= val) setCheap(Math.max(2, val - 3));
                  if (tooCheap >= val - 3) setTooCheap(Math.max(1, val - 6));
                  if (tooExpensive <= val) setTooExpensive(val + 8);
                }}
                className="w-full h-2 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer accent-[#C86D51]"
              />
              <div className="flex justify-between text-[10px] text-[#647069]">
                <span>$5 USD</span>
                <span>$50 USD</span>
              </div>
            </div>

            {/* Slider 4: Demasiado Caro */}
            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E6DFD5] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide block">
                    4. Demasiado Caro
                  </span>
                  <p className="text-xs text-[#55635C] mt-0.5">
                    ¿A qué precio sería prohibitivo y descartarías la app?
                  </p>
                </div>
                <span className="font-serif text-lg font-bold text-rose-800 bg-[#F3EEE7] px-2.5 py-1 rounded-xl">
                  ${tooExpensive} <span className="text-[10px] text-[#647069]">USD</span>
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={75}
                step={1}
                value={tooExpensive}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTooExpensive(val);
                  if (expensive >= val) setExpensive(Math.max(5, val - 5));
                  if (cheap >= val - 5) setCheap(Math.max(2, val - 10));
                  if (tooCheap >= val - 10) setTooCheap(Math.max(1, val - 15));
                }}
                className="w-full h-2 bg-[#E6DFD5] rounded-full appearance-none cursor-pointer accent-rose-700"
              />
              <div className="flex justify-between text-[10px] text-[#647069]">
                <span>$10 USD</span>
                <span>$75 USD</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E6DFD5]/80">
            <div className="text-xs text-[#647069]">
              Punto de precio óptimo sugerido por tu evaluación: <strong className="text-[#2E5A44]">${estimatedOptimal} USD/mes</strong> (nuestro plan Pro cuesta $9.99/mes)
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-semibold text-xs tracking-wide transition shadow-tonal-sm flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Enviar Evaluación y Desbloquear +1 Crédito Extra</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
