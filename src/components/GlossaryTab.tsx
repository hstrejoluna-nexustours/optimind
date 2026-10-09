import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Tag, 
  BookOpen, 
  Sparkles, 
  HelpCircle,
  RotateCw,
  ChevronRight
} from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { GlossaryTerm, PlanTier } from '../types';

interface GlossaryTabProps {
  bookmarkedIds: string[];
  onToggleBookmark: (termId: string) => void;
  currentPlan?: PlanTier;
  onOpenCheckout?: (plan: PlanTier) => void;
}

export const GlossaryTab: React.FC<GlossaryTabProps> = ({
  bookmarkedIds,
  onToggleBookmark,
  currentPlan = 'free',
  onOpenCheckout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [expandedTermId, setExpandedTermId] = useState<string | null>('modelo-abcde');

  // Extract all unique tags
  const allTags = ['todos', 'guardados', ...Array.from(new Set(GLOSSARY_TERMS.flatMap(t => t.tags)))];

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.practicalExample.toLowerCase().includes(searchTerm.toLowerCase());

    const isBookmarked = bookmarkedIds.includes(item.id);

    if (selectedTag === 'guardados') {
      return matchesSearch && isBookmarked;
    }

    const matchesTag = selectedTag === 'todos' || item.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const toggleExpand = (id: string) => {
    setExpandedTermId(expandedTermId === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-[#F3EEE7] rounded-[1.75rem] p-8 sm:p-10 border border-[#E6DFD5] shadow-tonal">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5A44] mb-2">
          <span>Diccionario Científico</span>
          <span aria-hidden="true">·</span>
          <span>Conceptos Clave de Seligman</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#333E38]">
          Glosario de Términos
        </h1>

        <p className="mt-2 text-[#55635C] text-xs sm:text-sm max-w-2xl leading-relaxed">
          Consulta y guarda los conceptos fundamentales de la reestructuración cognitiva y el 
          optimismo aprendido. Haz clic en cada tarjeta para profundizar en su explicación y ejemplos prácticos.
        </p>
      </div>

      {/* Search Bar & Filter Tags */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#647069]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por término, definición o ejemplo (ej. ABCDE, Descatastrofización)..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] text-xs sm:text-sm text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30 shadow-tonal-sm"
          />
        </div>

        {/* Filter Tag Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#2E5A44] text-[#FBF9F5] border-[#2E5A44] font-semibold'
                    : 'bg-[#F3EEE7] text-[#55635C] border-[#E6DFD5] hover:bg-[#EAE4DB]'
                }`}
              >
                {tag === 'guardados' ? `★ Guardados (${bookmarkedIds.length})` : tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Glossary Cards Grid */}
      {filteredTerms.length === 0 ? (
        <div className="bg-[#F3EEE7] rounded-[1.75rem] p-12 text-center border border-[#E6DFD5]">
          <BookOpen className="w-10 h-10 mx-auto text-[#647069] mb-3" />
          <h3 className="font-serif text-lg text-[#333E38]">
            No se encontraron términos
          </h3>
          <p className="text-xs text-[#647069] mt-1">
            Prueba ajustando el texto de búsqueda o cambiando el filtro de etiquetas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTerms.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isExpanded = expandedTermId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-[#F3EEE7] rounded-[1.75rem] p-6 sm:p-7 border transition-all shadow-tonal flex flex-col justify-between ${
                  isExpanded ? 'border-[#2E5A44] ring-1 ring-[#2E5A44]/20' : 'border-[#E6DFD5] hover:border-[#2E5A44]/40'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#C86D51]">
                        {item.tags[0]}
                      </span>
                      {item.pronunciation && (
                        <span className="text-[11px] text-[#647069]">
                          ({item.pronunciation})
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(item.id);
                      }}
                      className="p-1.5 rounded-lg text-[#647069] hover:text-[#C86D51] hover:bg-[#EAE4DB] transition"
                      title={isBookmarked ? "Eliminar de guardados" : "Guardar término"}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-[#C86D51] fill-[#C86D51]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-xl text-[#333E38]">
                      {item.term}
                    </h3>
                  </div>

                  {item.isPro && (
                    <div className="mb-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-[#2E5A44]/10 text-[#2E5A44] border border-[#2E5A44]/25 px-2.5 py-0.5 rounded-full shadow-tonal-sm">
                        💎 {item.proBadge || 'Característica Pro'}
                      </span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[#55635C] mt-1 leading-relaxed">
                    {item.shortDef}
                  </p>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#E6DFD5] space-y-3 animate-accordion text-xs">
                      <div>
                        <strong className="text-[#2E5A44] block mb-1">
                          Fundamento Científico:
                        </strong>
                        <p className="text-[#55635C] leading-relaxed">
                          {item.fullExplanation}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E6DFD5]">
                        <strong className="text-[#C86D51] block mb-0.5">
                          Ejemplo Práctico:
                        </strong>
                        <p className="text-[#333E38] italic leading-relaxed">
                          {item.practicalExample}
                        </p>
                      </div>

                      {item.seligmanQuote && (
                        <div className="text-[11px] text-[#647069] italic pt-1">
                          &ldquo;{item.seligmanQuote}&rdquo; — M. Seligman
                        </div>
                      )}

                      {item.isPro && (
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#2E5A44]/10 to-[#C86D51]/10 border border-[#2E5A44]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mt-2">
                          <span className="text-[#333E38]">
                            Módulo de diagnóstico algorítmico y plantillas de alta fidelidad disponible en <strong>OptiMind Pro</strong>.
                          </span>
                          {currentPlan === 'free' && onOpenCheckout && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenCheckout('pro');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#2E5A44] hover:bg-[#254937] text-[#FBF9F5] font-semibold text-[11px] shrink-0 transition"
                            >
                              Ver Plan Pro
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Toggle Button */}
                <div className="mt-5 pt-3 border-t border-[#E6DFD5]/70 flex items-center justify-between text-xs font-semibold text-[#2E5A44]">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Contraer explicación' : 'Ver detalle completo y ejemplo'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <div className="flex gap-1 text-[10px] text-[#647069]">
                    {item.tags.slice(1).map(tag => (
                      <span key={tag}>· {tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
