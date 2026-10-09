import React from 'react';
import { 
  Brain, 
  Flame, 
  PlusCircle, 
  Moon, 
  Sun, 
  Compass, 
  BarChart3, 
  History, 
  HelpCircle, 
  DownloadCloud,
  Volume2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'wizard' | 'dashboard' | 'matrix' | 'history' | 'quiz';
  onSelectTab: (tab: 'wizard' | 'dashboard' | 'matrix' | 'history' | 'quiz') => void;
  onNewEntry: () => void;
  onOpenThoughtStopper: () => void;
  onOpenDataModal: () => void;
  streak: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onNewEntry,
  onOpenThoughtStopper,
  onOpenDataModal,
  streak,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-700 via-indigo-700 to-teal-600 dark:from-teal-400 dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                  OptiMind
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Seligman Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Gimnasio de Optimismo Aprendido
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Métricas</span>
            </button>

            <button
              onClick={() => onSelectTab('wizard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'wizard'
                  ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Gimnasio ABCDE</span>
            </button>

            <button
              onClick={() => onSelectTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'matrix'
                  ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Matriz de Riesgo</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'history'
                  ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historial</span>
            </button>

            <button
              onClick={() => onSelectTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'quiz'
                  ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Test ASQ</span>
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Thought-Stopper Quick Button */}
            <button
              onClick={onOpenThoughtStopper}
              title="Freno de Rumiación: ¡BASTA! (Técnica de distracción activa)"
              className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-xs font-bold transition flex items-center gap-1.5 border border-amber-300 dark:border-amber-700/60 shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">¡BASTA!</span>
            </button>

            {/* Resilience Streak */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 text-xs font-semibold"
              title="Racha de entrenamientos cognitivos completados"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span className="tabular-nums font-bold">{streak}</span>
              <span className="hidden sm:inline text-orange-600/80 dark:text-orange-400/80">racha</span>
            </div>

            {/* New ABCDE Workout Button */}
            <button
              onClick={onNewEntry}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo ABCDE</span>
              <span className="sm:hidden">Nuevo</span>
            </button>

            {/* Data import/export */}
            <button
              onClick={onOpenDataModal}
              title="Exportar / Importar datos JSON"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <DownloadCloud className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentTab === 'dashboard' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas</span>
          </button>
          <button
            onClick={() => onSelectTab('wizard')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentTab === 'wizard' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>ABCDE</span>
          </button>
          <button
            onClick={() => onSelectTab('matrix')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentTab === 'matrix' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Matriz</span>
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentTab === 'history' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial</span>
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentTab === 'quiz' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Test</span>
          </button>
        </div>
      </div>
    </header>
  );
};
