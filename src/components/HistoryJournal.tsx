import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  Calendar, 
  ChevronDown,
  ChevronUp,
  BookOpen,
  Feather
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
    { id: 'all', label: 'Todos los ámbitos' },
    { id: 'trabajo', label: 'Trabajo / Carrera' },
    { id: 'relaciones', label: 'Relaciones' },
    { id: 'salud_habitos', label: 'Salud y Cuerpo' },
    { id: 'estudio', label: 'Aprendizaje' },
    { id: 'finanzas', label: 'Finanzas' },
    { id: 'personal', label: 'Vida Interior' },
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
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#1A1F1C] rounded-[2rem] p-8 border border-[#E8E2D7] dark:border-[#2C332E] shadow-xs">
        <div>
          <div className="text-xs text-[#5F7A61] dark:text-[#A8BEA7] font-medium tracking-wide mb-1">
            Tu Archivo de Transformación
          </div>
          <h1 className="font-serif text-3xl text-[#282D2A] dark:text-[#F0F3EF]">
            Diario de Reflexiones y Paz
          </h1>
          <p className="text-xs sm:text-sm text-[#696F6B] dark:text-[#9BA19C] mt-1.5">
            El registro de cómo has transformado el desánimo en claridad y acción serena.
          </p>
        </div>

        <button
          onClick={onNewWorkout}
          className="px-5 py-3 rounded-2xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] font-semibold text-xs transition shadow-xs whitespace-nowrap"
        >
          + Escribir Reflexión
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C928E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por hecho, pensamiento o plan..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-[#1A1F1C] border border-[#E2DBD0] dark:border-[#2E3630] text-xs sm:text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-[#1A1F1C] border border-[#E2DBD0] dark:border-[#2E3630] text-xs sm:text-sm text-[#282D2A] dark:text-[#F0F3EF] focus:outline-none focus:ring-2 focus:ring-[#5F7A61]/40"
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
        <div className="bg-white/80 dark:bg-[#1A1F1C] rounded-[2rem] p-12 text-center border border-[#E8E2D7] dark:border-[#2C332E]">
          <Feather className="w-10 h-10 mx-auto text-[#A8BEA7] mb-3" />
          <h3 className="font-serif text-lg text-[#282D2A] dark:text-[#F0F3EF]">
            Aún no hay registros que coincidan
          </h3>
          <p className="text-xs text-[#7A807B] dark:text-[#8D938E] mt-1">
            Tómate un momento para escribir tu primera reflexión o cambia el filtro.
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
                className="bg-white/85 dark:bg-[#1A1F1C] rounded-[2rem] border border-[#E8E2D7] dark:border-[#2C332E] shadow-2xs hover:border-[#5F7A61]/50 transition overflow-hidden"
              >
                {/* Header Row */}
                <div 
                  className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#7A807B] dark:text-[#8D938E]">
                      <span className="capitalize">{entry.category.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(entry.createdAt).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#282D2A] dark:text-[#F0F3EF]">
                      {entry.title}
                    </h3>

                    <p className="text-xs text-[#696F6B] dark:text-[#9BA19C] line-clamp-1 italic">
                      &ldquo;{entry.belief}&rdquo;
                    </p>
                  </div>

                  {/* Right metrics */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right text-xs">
                      <div className="text-[#696F6B] dark:text-[#9BA19C]">
                        {entry.consequences.intensity}/10 → <span className="text-[#4A644C] dark:text-[#A8BEA7] font-semibold">{entry.energization.newIntensity}/10</span>
                      </div>
                      <div className="text-[11px] text-[#4A644C] dark:text-[#A8BEA7] font-medium">
                        -{delta} pts de alivio
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F4EFE6] dark:bg-[#252B27] text-[#696F6B] dark:text-[#9BA19C]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Deep Reflection View */}
                {isExpanded && (
                  <div className="px-6 pb-7 pt-2 border-t border-[#F2ECE2] dark:border-[#282E2A] space-y-5 animate-fade-in text-xs sm:text-sm">
                    {/* A & B */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E]">
                        <span className="font-serif font-medium text-sm text-[#4A644C] dark:text-[#A8BEA7] block mb-1.5">
                          A · El Hecho Fáctico
                        </span>
                        <p className="text-xs text-[#525754] dark:text-[#C1C7C2] leading-relaxed">
                          {entry.adversity}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222724] border border-[#EFE9DF] dark:border-[#2C332E]">
                        <span className="font-serif font-medium text-sm text-[#5F7A61] dark:text-[#A8BEA7] block mb-1.5">
                          B · La Creencia Automática
                        </span>
                        <p className="text-xs text-[#525754] dark:text-[#C1C7C2] leading-relaxed italic">
                          &ldquo;{entry.belief}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* D: The 4 Lights */}
                    <div className="p-5 rounded-2xl bg-[#F5EFE4]/60 dark:bg-[#222724]/70 border border-[#EBE3D3] dark:border-[#2C332E] space-y-3">
                      <span className="font-serif font-medium text-sm text-[#3E5240] dark:text-[#A8BEA7] block">
                        D · Las 4 Luces de Sabiduría
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 bg-white dark:bg-[#1A1F1C] rounded-xl border border-[#EAE3D5] dark:border-[#2B312C]">
                          <strong className="text-[#282D2A] dark:text-[#F0F3EF] block mb-1">
                            01. Evidencia Factual:
                          </strong>
                          <p className="text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
                            {entry.refutations.evidence || 'No registrada'}
                          </p>
                        </div>

                        <div className="p-3.5 bg-white dark:bg-[#1A1F1C] rounded-xl border border-[#EAE3D5] dark:border-[#2B312C]">
                          <strong className="text-[#282D2A] dark:text-[#F0F3EF] block mb-1">
                            02. Otras Alternativas:
                          </strong>
                          <p className="text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
                            {entry.refutations.alternatives || 'No registrada'}
                          </p>
                        </div>

                        <div className="p-3.5 bg-white dark:bg-[#1A1F1C] rounded-xl border border-[#EAE3D5] dark:border-[#2B312C]">
                          <strong className="text-[#282D2A] dark:text-[#F0F3EF] block mb-1">
                            03. Descatastrofización:
                          </strong>
                          <p className="text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
                            {entry.refutations.decatastrophizing || 'No registrada'}
                          </p>
                        </div>

                        <div className="p-3.5 bg-white dark:bg-[#1A1F1C] rounded-xl border border-[#EAE3D5] dark:border-[#2B312C]">
                          <strong className="text-[#282D2A] dark:text-[#F0F3EF] block mb-1">
                            04. Utilidad & Dejar Ir:
                          </strong>
                          <p className="text-[#696F6B] dark:text-[#9BA19C] leading-relaxed">
                            {entry.refutations.utility || 'No registrada'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* E: Energization */}
                    <div className="p-5 rounded-2xl bg-[#EFF4EE] dark:bg-[#1C251E] border border-[#D7E4D6] dark:border-[#2A3B2D] space-y-2">
                      <span className="font-serif font-medium text-sm text-[#2F4432] dark:text-[#B2CAB4] block">
                        E · Renovación y Micro-Pasos
                      </span>
                      {entry.energization.newBelief && (
                        <p className="text-xs text-[#455747] dark:text-[#A7BDA9]">
                          <strong>Nueva Creencia:</strong> {entry.energization.newBelief}
                        </p>
                      )}
                      <p className="text-xs text-[#455747] dark:text-[#A7BDA9] whitespace-pre-line">
                        <strong>Plan:</strong> {entry.energization.actionPlan}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE2] dark:border-[#282E2A] text-xs">
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-[#9E5959] hover:underline flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>

                      <button
                        onClick={() => onSelectEntry(entry)}
                        className="px-4 py-2 rounded-xl bg-[#4A644C] hover:bg-[#3D543F] text-[#FAF8F5] font-semibold flex items-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Revisitar o editar</span>
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
