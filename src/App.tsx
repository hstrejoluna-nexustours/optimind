import React, { useState, useEffect } from 'react';
import { AbcdeEntry, ExplanatoryProfile } from './types';
import { INITIAL_ENTRIES } from './data/initialData';
import { computeExplanatoryProfile } from './services/optimindApi';
import { Navbar } from './components/Navbar';
import { DashboardMetrics } from './components/DashboardMetrics';
import { AbcdeWizard } from './components/AbcdeWizard';
import { RiskMatrixWidget } from './components/RiskMatrixWidget';
import { HistoryJournal } from './components/HistoryJournal';
import { ExplanatoryStyleQuiz } from './components/ExplanatoryStyleQuiz';
import { ThoughtStopperModal } from './components/ThoughtStopperModal';
import { JsonDataModal } from './components/JsonDataModal';
import { Brain, Heart, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'optimind_entries_v1';
const THEME_KEY = 'optimind_theme_v1';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Entries State
  const [entries, setEntries] = useState<AbcdeEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading entries from localStorage', e);
      }
    }
    return INITIAL_ENTRIES;
  });

  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'wizard' | 'matrix' | 'history' | 'quiz'>('dashboard');
  const [editingEntry, setEditingEntry] = useState<Partial<AbcdeEntry> | undefined>(undefined);
  const [isThoughtStopperOpen, setIsThoughtStopperOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  // Persist entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save entries to localStorage', e);
    }
  }, [entries]);

  // Dynamic Profile computation
  const profile: ExplanatoryProfile = computeExplanatoryProfile(entries);

  // Handlers
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNewEntry = () => {
    setEditingEntry(undefined);
    setCurrentTab('wizard');
  };

  const handleSelectEntryForEdit = (entry: AbcdeEntry) => {
    setEditingEntry(entry);
    setCurrentTab('wizard');
  };

  const handleSaveEntry = (saved: AbcdeEntry) => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      } else {
        return [saved, ...prev];
      }
    });
    setEditingEntry(undefined);
    setCurrentTab('history');
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este entrenamiento ABCDE?')) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleImportEntries = (newEntries: AbcdeEntry[]) => {
    setEntries(newEntries);
  };

  const handleResetToDefault = () => {
    setEntries(INITIAL_ENTRIES);
  };

  const handleApplyScenarioToWizard = (adversityPreset: string, beliefPreset: string, costOfFailure: 'low' | 'high' | 'moderate') => {
    setEditingEntry({
      adversity: adversityPreset,
      belief: beliefPreset,
      costOfFailure,
    });
    setCurrentTab('wizard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNewEntry={handleNewEntry}
        onOpenThoughtStopper={() => setIsThoughtStopperOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        streak={profile.resilienceStreak}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          <DashboardMetrics
            profile={profile}
            entries={entries}
            onStartWorkout={handleNewEntry}
            onOpenQuiz={() => setCurrentTab('quiz')}
            onSelectEntry={handleSelectEntryForEdit}
          />
        )}

        {currentTab === 'wizard' && (
          <AbcdeWizard
            initialData={editingEntry}
            onSaveEntry={handleSaveEntry}
            onCancel={() => setCurrentTab('dashboard')}
            onOpenThoughtStopper={() => setIsThoughtStopperOpen(true)}
          />
        )}

        {currentTab === 'matrix' && (
          <RiskMatrixWidget
            onApplyScenarioToWizard={handleApplyScenarioToWizard}
          />
        )}

        {currentTab === 'history' && (
          <HistoryJournal
            entries={entries}
            onSelectEntry={handleSelectEntryForEdit}
            onDeleteEntry={handleDeleteEntry}
            onNewWorkout={handleNewEntry}
          />
        )}

        {currentTab === 'quiz' && (
          <ExplanatoryStyleQuiz
            onGoToWizard={handleNewEntry}
          />
        )}
      </main>

      {/* Thought Stopper Modal */}
      <ThoughtStopperModal
        isOpen={isThoughtStopperOpen}
        onClose={() => setIsThoughtStopperOpen(false)}
      />

      {/* JSON Import/Export Modal */}
      <JsonDataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        entries={entries}
        onImportEntries={handleImportEntries}
        onResetToDefault={handleResetToDefault}
      />

      {/* Scientific Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>OptiMind • Gimnasio de Optimismo Aprendido</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-500 max-w-2xl mx-auto">
            Basado en las investigaciones de Martin E.P. Seligman, Ph.D. (Universidad de Pensilvania). 
            El optimismo flexible y la reestructuración cognitiva ABCDE son herramientas de entrenamiento mental 
            orientadas a la exactitud empírica y la prevención de la indefensión aprendida. Cero positivismo ciego.
          </p>
          <div className="pt-2 text-[10px] text-slate-400">
            OptiMind v2.4 • Datos guardados localmente de forma privada
          </div>
        </div>
      </footer>
    </div>
  );
}
