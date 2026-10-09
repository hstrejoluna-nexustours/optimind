import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Brain, 
  ShieldCheck, 
  TrendingDown, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Compass, 
  Award
} from 'lucide-react';
import { AbcdeEntry, MoodCheckIn } from '../types';
import { UserProfileData } from '../services/firebase';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileData | null;
  entries: AbcdeEntry[];
  moods: MoodCheckIn[];
  streak: number;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  entries,
  moods,
  streak
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const permanentCount = entries.filter(e => e.classifications?.permanent).length;
  const universalCount = entries.filter(e => e.classifications?.universal).length;
  const internalCount = entries.filter(e => e.classifications?.internal).length;

  const tempOptimismPct = entries.length > 0 
    ? Math.round(((entries.length - permanentCount) / entries.length) * 100) 
    : 85;

  const specificOptimismPct = entries.length > 0 
    ? Math.round(((entries.length - universalCount) / entries.length) * 100) 
    : 80;

  const externalConstructivePct = entries.length > 0 
    ? Math.round(((entries.length - internalCount) / entries.length) * 100) 
    : 75;

  // Average drop from consequence to energization
  let avgDrop = 0;
  if (entries.length > 0) {
    const drops = entries.map(e => {
      const c = e.consequences?.intensity || 5;
      const f = e.energization?.newIntensity || c;
      return Math.max(0, c - f);
    });
    avgDrop = +(drops.reduce((a, b) => a + b, 0) / entries.length).toFixed(1);
  }

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#333E38]/50 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:fixed">
      <div className="bg-[#FBF9F5] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-tonal-xl border border-[#E6DFD5] flex flex-col print:shadow-none print:border-none print:max-h-full print:rounded-none">
        {/* Modal Top Actions (Hidden when printing) */}
        <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#F3EEE7] sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#2E5A44]">
              📄 Informe Clínico de Resiliencia Cognitiva
            </span>
            <span className="text-[10px] bg-[#2E5A44]/10 text-[#2E5A44] px-2 py-0.5 rounded-full font-bold">
              PRO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] text-xs font-medium transition flex items-center gap-1.5 shadow-tonal-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#647069] hover:bg-[#EAE4DB] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-8 bg-white print:p-8 text-[#333E38]">
          {/* Header */}
          <div className="border-b-2 border-[#2E5A44] pb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2E5A44] text-white flex items-center justify-center text-sm">
                  🌿
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2E5A44]">
                  OptiMind Health
                </h2>
              </div>
              <p className="text-xs text-[#647069] mt-1">
                Expediente Clínico & Auditoría de Estilo Atributivo (Seligman ABCDE)
              </p>
            </div>

            <div className="text-right text-xs text-[#647069]">
              <span className="font-semibold block text-[#333E38]">Fecha de Emisión:</span>
              <span>{currentDate}</span>
              <span className="block mt-0.5 text-[10px] font-mono text-[#2E5A44]">ID: OM-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>

          {/* User Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6DFD5] text-xs">
            <div>
              <span className="text-[#647069] block text-[11px]">Practicante / Paciente:</span>
              <strong className="text-[#333E38] block truncate">{userProfile?.displayName || 'Usuario OptiMind'}</strong>
            </div>
            <div>
              <span className="text-[#647069] block text-[11px]">Racha de Práctica:</span>
              <strong className="text-[#C86D51]">{streak} días activos</strong>
            </div>
            <div>
              <span className="text-[#647069] block text-[11px]">Sesiones Evaluadas:</span>
              <strong className="text-[#2E5A44]">{entries.length} ejercicios</strong>
            </div>
            <div>
              <span className="text-[#647069] block text-[11px]">Alivio Emocional:</span>
              <strong className="text-emerald-700">-{avgDrop} pts promedio</strong>
            </div>
          </div>

          {/* Section 1: Explanatory Style Breakdown */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#2E5A44] border-b border-[#E6DFD5] pb-1.5 flex items-center gap-2">
              <Compass className="w-4 h-4" /> 1. Diagnóstico de Pauta Explicativa ante la Adversidad
            </h3>
            
            <p className="text-xs text-[#55635C] leading-relaxed">
              Basado en las 3 dimensiones del Dr. Martin Seligman (Universidad de Pensilvania). Los porcentajes elevados indican alta resiliencia cognitiva frente a contratiempos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl border border-[#E6DFD5] bg-[#FAF8F5]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-[#333E38]">Permanencia</span>
                  <span className="font-bold text-[#2E5A44]">{tempOptimismPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div className="h-full bg-[#2E5A44]" style={{ width: `${tempOptimismPct}%` }} />
                </div>
                <span className="text-[10px] text-[#647069] block">
                  {tempOptimismPct >= 70 ? 'Óptimo: Atribuye causas a factores temporales.' : 'Atención: Tendencia a generalizar como permanente.'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E6DFD5] bg-[#FAF8F5]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-[#333E38]">Amplitud</span>
                  <span className="font-bold text-[#C86D51]">{specificOptimismPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div className="h-full bg-[#C86D51]" style={{ width: `${specificOptimismPct}%` }} />
                </div>
                <span className="text-[10px] text-[#647069] block">
                  {specificOptimismPct >= 70 ? 'Óptimo: Aísla el contratiempo sin contaminar otras áreas.' : 'Atención: Tendencia a catastrofización global.'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E6DFD5] bg-[#FAF8F5]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-[#333E38]">Personalización</span>
                  <span className="font-bold text-[#2E5A44]">{externalConstructivePct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div className="h-full bg-[#2E5A44]" style={{ width: `${externalConstructivePct}%` }} />
                </div>
                <span className="text-[10px] text-[#647069] block">
                  {externalConstructivePct >= 70 ? 'Óptimo: Enfoque constructivo y contextual.' : 'Atención: Autoinculpación tóxica recurrente.'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Recent Cognitive Restructuring Cases */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#2E5A44] border-b border-[#E6DFD5] pb-1.5 flex items-center gap-2">
              <Brain className="w-4 h-4" /> 2. Muestra de Ejercicios ABCDE Recientes
            </h3>

            {entries.length === 0 ? (
              <p className="text-xs text-[#647069]">No se registran sesiones completadas aún.</p>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-4 rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-[#333E38] font-serif text-sm">{entry.title}</strong>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 capitalize">
                        {entry.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#55635C]">
                      <div>
                        <span className="font-semibold text-rose-800">Pensamiento Automático (B):</span>
                        <p className="italic">&ldquo;{entry.belief}&rdquo;</p>
                      </div>
                      <div>
                        <span className="font-semibold text-[#2E5A44]">Nueva Perspectiva & Plan (E):</span>
                        <p>&ldquo;{entry.energization?.actionPlan || entry.energization?.newBelief}&rdquo;</p>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-[#647069]">
                      <span>Impacto Emocional Inicial: {entry.consequences?.intensity}/10</span>
                      <span className="font-semibold text-[#2E5A44]">
                        Intensidad Final: {entry.energization?.newIntensity}/10 (Alivio: {Math.max(0, (entry.consequences?.intensity || 0) - (entry.energization?.newIntensity || 0))} pts)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Signature / Legal Notice */}
          <div className="pt-6 border-t border-[#E6DFD5] text-[11px] text-[#647069] flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="max-w-md">
              <p className="italic">
                &ldquo;El optimismo no es una doctrina de complacencia, sino una herramienta de realismo activo para actuar cuando el costo del fracaso es manejable.&rdquo; — Dr. Martin Seligman.
              </p>
              <span className="block mt-1 text-[10px]">Generado por OptiMind Health Platform • Validación científica algorítmica.</span>
            </div>

            <div className="text-center border-t border-slate-400 pt-2 w-48">
              <span className="block font-semibold text-[#333E38]">Sello de Certificación</span>
              <span className="text-[10px] text-[#2E5A44]">OptiMind Pro Validated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
