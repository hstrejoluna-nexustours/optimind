import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { PlanTier } from '../types';
import { PRICING_PLANS } from '../data/pricingData';
import { sounds } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: PlanTier;
  onConfirmUpgrade: (plan: PlanTier) => Promise<void>;
  userEmail?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  targetPlan,
  onConfirmUpgrade,
  userEmail
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay'>('card');

  if (!isOpen) return null;

  const plan = PRICING_PLANS.find(p => p.id === targetPlan) || PRICING_PLANS[1];
  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  const periodText = billingCycle === 'yearly' ? '/año (ahorro del ~27%)' : '/mes';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    sounds.playBambooChime();

    try {
      await onConfirmUpgrade(plan.id);
      setIsSuccess(true);
      sounds.playSuccessChime();
      setTimeout(() => {
        setIsSuccess(false);
        setIsProcessing(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#333E38]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FBF9F5] rounded-3xl max-w-md w-full shadow-tonal-xl border border-[#E6DFD5] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E6DFD5] flex items-center justify-between bg-[#F3EEE7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A44] text-[#FBF9F5] flex items-center justify-center font-bold text-xs shadow-tonal-sm">
              💎
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#333E38] leading-tight">
                {plan.name}
              </h3>
              <p className="text-xs text-[#647069]">
                Activa tu membresía MicroSaaS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#647069] hover:bg-[#EAE4DB] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E5A44] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-serif text-2xl text-[#333E38]">
              ¡Bienvenido a {plan.name}!
            </h4>
            <p className="text-sm text-[#55635C] max-w-xs mx-auto">
              Tu cuenta ha sido actualizada con éxito en Cloud Firestore. Ahora cuentas con ejercicios ilimitados, tutor IA y reportes clínicos.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Billing Cycle Selector */}
            <div className="flex items-center justify-between p-1.5 bg-[#F3EEE7] rounded-2xl border border-[#E6DFD5]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition ${
                  billingCycle === 'monthly'
                    ? 'bg-[#2E5A44] text-[#FBF9F5] shadow-tonal-sm'
                    : 'text-[#55635C] hover:text-[#333E38]'
                }`}
              >
                Mensual (${plan.priceMonthly}/mes)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition flex items-center justify-center gap-1 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#2E5A44] text-[#FBF9F5] shadow-tonal-sm'
                    : 'text-[#55635C] hover:text-[#333E38]'
                }`}
              >
                <span>Anual (${plan.priceYearly}/año)</span>
                <span className="text-[10px] bg-[#C86D51] text-white px-1.5 py-0.2 rounded-full font-bold">
                  -27%
                </span>
              </button>
            </div>

            {/* Price Highlight */}
            <div className="p-4 rounded-2xl bg-[#F3EEE7]/60 border border-[#E6DFD5] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#647069] block">Total a pagar:</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-bold text-[#333E38]">${price} USD</span>
                  <span className="text-xs text-[#647069]">{periodText}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block text-[11px] font-semibold text-[#2E5A44] bg-[#2E5A44]/10 px-2.5 py-1 rounded-full">
                  14 Días de prueba incluidos
                </span>
              </div>
            </div>

            {/* Simulated Payment Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#647069]">
                <span>Método de pago seguro</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">VISA / MC</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">GPay</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#55635C] block mb-1">Correo de facturación</label>
                <input
                  type="email"
                  defaultValue={userEmail || 'usuario@optimind.app'}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FBF9F5] text-xs text-[#333E38] focus:outline-none focus:border-[#2E5A44]"
                />
              </div>

              <div>
                <label className="text-xs text-[#55635C] block mb-1">Información de tarjeta</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    readOnly
                    className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-[#E6DFD5] bg-[#F3EEE7]/40 text-xs text-[#333E38] font-mono"
                  />
                  <CreditCard className="w-4 h-4 text-[#647069] absolute left-3.5 top-3" />
                  <span className="absolute right-3.5 top-2.5 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Modo Demo Seguro
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-xs text-[#55635C] block mb-1">Vencimiento</label>
                  <input
                    type="text"
                    defaultValue="12 / 28"
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-[#E6DFD5] bg-[#F3EEE7]/40 text-xs text-[#333E38] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#55635C] block mb-1">CVC</label>
                  <input
                    type="text"
                    defaultValue="888"
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-[#E6DFD5] bg-[#F3EEE7]/40 text-xs text-[#333E38] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Perks included in this plan */}
            <div className="space-y-1.5 pt-1 text-xs">
              <span className="text-[11px] font-semibold text-[#647069] uppercase tracking-wider">
                Beneficios inmediatos:
              </span>
              {plan.features.slice(0, 3).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-[#55635C]">
                  <Check className="w-3.5 h-3.5 text-[#2E5A44] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Guarantee note */}
            <div className="p-3 rounded-xl bg-[#2E5A44]/5 border border-[#2E5A44]/15 flex items-start gap-2.5 text-[11px] text-[#425248]">
              <ShieldCheck className="w-4 h-4 text-[#2E5A44] shrink-0 mt-0.5" />
              <span>
                <strong>Garantía de tranquilidad de 30 días:</strong> Si no experimentas mayor serenidad y claridad mental, te reembolsamos el 100% de tu dinero sin preguntas.
              </span>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-semibold text-xs tracking-wide transition shadow-tonal-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando suscripción segura...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirmar & Activar {plan.name} (${price} USD)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
