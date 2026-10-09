import React, { useState, useEffect } from 'react';
import { AbcdeEntry, MoodCheckIn } from './types';
import { INITIAL_ENTRIES } from './data/initialData';
import { Navbar, AppTab } from './components/Navbar';
import { SantuarioTab } from './components/SantuarioTab';
import { WikiTab } from './components/WikiTab';
import { GlossaryTab } from './components/GlossaryTab';
import { AbcdeGymTab } from './components/AbcdeGymTab';
import { ThoughtStopperModal } from './components/ThoughtStopperModal';
import { JsonDataModal } from './components/JsonDataModal';
import { Feather, Heart, BookOpen, Brain, Sparkles, Wind } from 'lucide-react';

const STORAGE_ENTRIES_KEY = 'optimind_entries_v2';
const STORAGE_MOODS_KEY = 'optimind_moods_v2';
const STORAGE_BOOKMARKS_KEY = 'optimind_bookmarks_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('santuario');

  // ABCDE Entries State
  const [entries, setEntries] = useState<AbcdeEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_ENTRIES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Error loading entries', e);
      }
    }
    return INITIAL_ENTRIES;
  });

  // Mood Check-in History
  const [moods, setMoods] = useState<MoodCheckIn[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_MOODS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Error loading moods', e);
      }
    }
    return [
      {
        id: 'mood-init',
        timestamp: new Date().toISOString(),
        score: 7,
        energy: 'sereno',
        note: 'Comenzando el día con presencia y disposición a aprender.'
      }
    ];
  });

  // Glossary Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Error loading bookmarks', e);
      }
    }
    return ['modelo-abcde', 'descatastrofizacion', 'regla-optimismo-flexible'];
  });

  // Active workout entry being worked on
  const [activeGymEntry, setActiveGymEntry] = useState<Partial<AbcdeEntry> | undefined>(undefined);

  // Modals
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isThoughtStopperOpen, setIsThoughtStopperOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save entries', e);
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MOODS_KEY, JSON.stringify(moods));
    } catch (e) {
      console.error('Failed to save moods', e);
    }
  }, [moods]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [bookmarks]);

  // Handlers
  const handleSaveMoodCheckIn = (newMood: MoodCheckIn) => {
    setMoods(prev => [newMood, ...prev]);
  };

  const handleToggleBookmark = (termId: string) => {
    setBookmarks(prev => 
      prev.includes(termId) ? prev.filter(id => id !== termId) : [...prev, termId]
    );
  };

  const handleSaveAbcdeEntry = (newEntry: AbcdeEntry) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === newEntry.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newEntry;
        return updated;
      }
      return [newEntry, ...prev];
    });
    setActiveGymEntry(undefined);
  };

  const handleSelectSavedEntry = (entry: AbcdeEntry) => {
    setActiveGymEntry(entry);
    setCurrentTab('gimnasio');
  };

  const handleImportAllData = (data: { entries?: AbcdeEntry[]; moods?: MoodCheckIn[]; bookmarks?: string[] }) => {
    if (data.entries && Array.isArray(data.entries)) setEntries(data.entries);
    if (data.moods && Array.isArray(data.moods)) setMoods(data.moods);
    if (data.bookmarks && Array.isArray(data.bookmarks)) setBookmarks(data.bookmarks);
  };

  const handleResetToDefault = () => {
    setEntries(INITIAL_ENTRIES);
    setBookmarks(['modelo-abcde', 'descatastrofizacion', 'regla-optimismo-flexible']);
  };

  // Resilience streak calculation
  const streak = Math.max(3, entries.length + moods.length);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#333E38] selection:bg-[#2E5A44]/15 selection:text-[#2E5A44] transition-colors">
      {/* Top Persistent Header & Navigation (4 Tabs) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        streak={streak}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-8">
        {currentTab === 'santuario' && (
          <SantuarioTab
            onGoToGym={() => {
              setActiveGymEntry(undefined);
              setCurrentTab('gimnasio');
            }}
            onGoToWiki={() => setCurrentTab('wiki')}
            onSaveMoodCheckIn={handleSaveMoodCheckIn}
            recentMoods={moods}
          />
        )}

        {currentTab === 'wiki' && (
          <WikiTab
            onGoToGymWithExample={() => {
              setActiveGymEntry(undefined);
              setCurrentTab('gimnasio');
            }}
          />
        )}

        {currentTab === 'glosario' && (
          <GlossaryTab
            bookmarkedIds={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentTab === 'gimnasio' && (
          <AbcdeGymTab
            initialData={activeGymEntry}
            onSaveEntry={handleSaveAbcdeEntry}
            onOpenThoughtStopper={() => setIsThoughtStopperOpen(true)}
            savedEntries={entries}
            onSelectSavedEntry={handleSelectSavedEntry}
          />
        )}
      </main>

      {/* Thought Stopper Modal */}
      <ThoughtStopperModal
        isOpen={isThoughtStopperOpen}
        onClose={() => setIsThoughtStopperOpen(false)}
      />

      {/* JSON Backup & Restore Modal */}
      <JsonDataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        entries={entries}
        moods={moods}
        bookmarks={bookmarks}
        onImportAllData={handleImportAllData}
        onResetToDefault={handleResetToDefault}
      />

      {/* Horizontal Visual Banding (Wainscoting-style layout container in lower third) */}
      <footer className="wainscoting-band py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2E5A44] flex items-center justify-center text-[#FBF9F5] shadow-tonal-sm">
                <span className="text-sm">🌿</span>
              </div>
              <div>
                <span className="font-serif text-lg text-[#333E38] block leading-none">
                  OptiMind
                </span>
                <span className="text-[11px] text-[#647069]">
                  Santuario & Gimnasio de Optimismo Aprendido
                </span>
              </div>
            </div>

            {/* Quick 4-tab anchor links */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-[#55635C]">
              <button 
                onClick={() => setCurrentTab('santuario')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                🌿 Santuario
              </button>
              <button 
                onClick={() => setCurrentTab('wiki')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                📖 Wiki del Optimismo
              </button>
              <button 
                onClick={() => setCurrentTab('glosario')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                📚 Glosario
              </button>
              <button 
                onClick={() => setCurrentTab('gimnasio')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                🧠 Gimnasio ABCDE
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[#647069]">
            <p className="leading-relaxed max-w-xl">
              Basado en las investigaciones de Martin Seligman (Universidad de Pensilvania). 
              Diseñado con principios de <em>Calm Technology</em>, Diseño Emocional (Don Norman) y accesibilidad WCAG AA. Cero positivismo tóxico.
            </p>
            <div className="whitespace-nowrap font-medium text-[#2E5A44]">
              Datos guardados de forma privada en tu dispositivo
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
