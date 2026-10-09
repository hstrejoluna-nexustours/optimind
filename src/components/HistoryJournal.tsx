import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  Clock, 
  Maximize2, 
  UserCheck, 
  Calendar, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { AbcdeEntry } from '../types';

interface HistoryJournalProps {
  entries: AbcdeEntry[];
  onSelectEntry: (entry: AbcdeEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNewWorkout: () => void;
}

export const HistoryJournal: React.FC<HistoryJournalProps> = ({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onNewWorkout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todas las categorías' },
    { id: 'trabajo', label: 'Trabajo / Carrera' },
    { id: 'relaciones', label: 'Relaciones' },
    { id: 'salud_habitos', label: 'Salud y Hábitos' },
    { id: 'estudio', label: 'Estudio' },
    { id: 'finanzas', label: 'Finanzas' },
    { id: 'personal', label: 'Personal' },
  ];

  const filteredEntries = entries.filter((e) => {
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch = 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.adversity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.belief.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.energization.actionPlan && e.energization.actionPlan.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Diario de Reestructuración Cognitiva
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Registro longitudinal de contratiempos trabajados con el modelo ABCDE.
          </p>
        </div>

        <button
          onClick={onNewWorkout}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md shadow-teal-600/20 whitespace-nowrap"
        >
          + Nuevo Registro ABCDE
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por adversidad, creencia o plan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No se encontraron registros
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Prueba ajustando los filtros de búsqueda o realiza un nuevo entrenamiento ABCDE.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const delta = entry.consequences.intensity - entry.energization.newIntensity;

            return (
              <div
                key={entry.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/40 transition overflow-hidden"
              >
                {/* Header Row */}
                <div 
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {entry.category}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(entry.createdAt).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      {entry.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                      &ldquo;{entry.belief}&rdquo;
                    </p>
                  </div>

                  {/* Right Metrics & Expand indicator */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs font-black">
                        <span className="text-rose-500">C: {entry.consequences.intensity}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-emerald-500">E: {entry.energization.newIntensity}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                        -{delta} pts de alivio
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Deep View */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 animate-fade-in text-xs sm:text-sm">
                    {/* A & B */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                        <span className="font-bold text-teal-700 dark:text-teal-300 block mb-1">
                          A (Adversidad Objetiva):
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                          {entry.adversity}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                          B (Creencia Automática):
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs italic">
                          &ldquo;{entry.belief}&rdquo;
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${entry.classifications.permanent ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'}`}>
                            {entry.classifications.permanent ? 'Permanente' : 'Temporal'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${entry.classifications.universal ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'}`}>
                            {entry.classifications.universal ? 'Universal' : 'Específico'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${entry.classifications.internal ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'}`}>
                            {entry.classifications.internal ? 'Interno' : 'Circunstancial'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* D: The 4 Cards Breakdown */}
                    <div className="p-4 rounded-2xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 space-y-3">
                      <span className="font-bold text-teal-800 dark:text-teal-300 text-xs block">
                        D (Discusión con las 4 Cartas):
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                            🕵️‍♂️ Evidencia Factual:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-400">
                            {entry.refutations.evidence || 'No registrada'}
                          </p>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                            🔀 Alternativas Modificables:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-400">
                            {entry.refutations.alternatives || 'No registrada'}
                          </p>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                            🔍 Descatastrofización:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-400">
                            {entry.refutations.decatastrophizing || 'No registrada'}
                          </p>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                            🎯 Utilidad / ¡BASTA!:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-400">
                            {entry.refutations.utility || 'No registrada'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* E: Energization & Action Plan */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs block">
                        E (Energización y Plan de Acción):
                      </span>
                      {entry.energization.newBelief && (
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          <strong>Nueva Creencia:</strong> {entry.energization.newBelief}
                        </p>
                      )}
                      <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line">
                        <strong>Plan:</strong> {entry.energization.actionPlan}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar registro</span>
                      </button>

                      <button
                        onClick={() => onSelectEntry(entry)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar o Reentrenar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
