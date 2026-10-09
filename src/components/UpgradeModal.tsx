import React from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Lock, 
  FileText, 
  Brain, 
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { sounds } from '../utils/audio';

export type UpgradeTriggerReason = 'limit_reached' | 'pdf_export' | 'pro_feature' | 'ai_deep';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProTrial: () => void;
  reason: UpgradeTriggerReason;
  trialDaysLeft?: number;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onStartProTrial,
  reason,
  trialDaysLeft = 14
}) => {
  if (!isOpen) return null;

  const getReasonContent = () => {
    switch (reason) {
      case 'limit_reached':
        return {
          icon: <Brain className="w-6 h-6 text-[#C86D51]" />,
          title: 'Has alcanzado tus 3 ejercicios mensuales gratuitos',
          description: 'Tu mente se beneficia de la práctica regular. Con el Pase de Resiliencia Pro obtienes sesiones ilimitadas sin restricciones.',
          badge: 'Límite Plan Free'
        };
      case 'pdf_export':
        return {
          icon: <FileText className="w-6 h-6 text-[#2E5A44]" />,
          title: 'Exportación Clínica y Reportes Ejecutivos en PDF',
          description: 'Genera informes profesionales y anonimizados listos para compartir con tu psicólogo, terapeuta cognitivo o para tu archivo personal.',
          badge: 'Función Pro Exclusiva'
        };
      case 'ai_deep':
        return {
          icon: <Sparkles className="w-6 h-6 text-[#2E5A44]" />,
          title: 'IA de Razonamiento Profundo para las 4 Cartas',
          description: 'Disputa de distorsiones socrática en tiempo real con detección de sesgos de permanencia, amplitud y personalización.',
          badge: 'IA Cognitiva Pro'
        };
      default:
        return {
          icon: <Sparkles className="w-6 h-6 text-[#2E5A44]" />,
          title: 'Desbloquea el Acceso Pro Ilimitado',
          description: 'Aprovecha la reestructuración cognitiva completa sin limitaciones y mantén tu progreso seguro en la nube.',
          badge: 'Pase Pro'
        };
    }
  };

  const content = getReasonContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#333E38]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FBF9F5] rounded-3xl max-w-lg w-full shadow-tonal-xl border border-[#E6DFD5] overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-6 bg-[#F3EEE7] border-b border-[#E6DFD5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#2E5A44]/10 border border-[#2E5A44]/20 flex items-center justify-center">
              {content.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C86D51] block">
                {content.badge}
              </span>
              <h3 className="font-serif text-lg font-medium text-[#333E38] leading-tight">
                OptiMind Pro
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#647069] hover:bg-[#EAE4DB] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="space-y-2">
            <h4 className="font-serif text-xl sm:text-2xl text-[#333E38]">
              {content.title}
            </h4>
            <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Value Highlights */}
          <div className="bg-[#F3EEE7] rounded-2xl p-4.5 border border-[#E6DFD5] space-y-2.5 text-xs text-[#333E38]">
            <span className="text-[11px] font-bold text-[#2E5A44] uppercase tracking-wider block">
              Todo lo que incluye el Pase Pro:
            </span>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2E5A44] shrink-0" />
              <span>Ejercicios ABCDE y contratiempos ilimitados</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2E5A44] shrink-0" />
              <span>Exportación ilimitada en PDF y JSON para terapia</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2E5A44] shrink-0" />
              <span>Sincronización multi-dispositivo en Google Cloud Firestore</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2E5A44] shrink-0" />
              <span>Análisis de patrones de Estilo Explicativo (3 dimensiones)</span>
            </div>
          </div>

          {/* Reverse Trial Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center gap-3 text-xs text-[#2E5A44]">
            <Clock className="w-5 h-5 shrink-0 text-[#2E5A44]" />
            <div>
              <strong className="block font-semibold">14 Días de Reverse Trial Sin Compromiso</strong>
              <span className="text-[#55635C] text-[11px]">
                Prueba todas las funciones Pro de inmediato. Sin cobros sorpresa.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                sounds.playBambooChime();
                onStartProTrial();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-semibold text-xs sm:text-sm tracking-wide transition shadow-tonal-md flex items-center justify-center gap-2"
            >
              <span>Activar Acceso Pro (14 Días Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs text-[#647069] hover:text-[#333E38] transition font-medium"
            >
              Continuar practicando en Plan Gratuito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
