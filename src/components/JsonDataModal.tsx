import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { AbcdeEntry } from '../types';

interface JsonDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AbcdeEntry[];
  onImportEntries: (entries: AbcdeEntry[]) => void;
  onResetToDefault: () => void;
}

export const JsonDataModal: React.FC<JsonDataModalProps> = ({
  isOpen,
  onClose,
  entries,
  onImportEntries,
  onResetToDefault,
}) => {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  if (!isOpen) return null;

  const exportString = JSON.stringify(entries, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimind-abcde-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError('');
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('El JSON debe contener un arreglo de registros ([...]).');
      }
      if (parsed.length > 0 && (!parsed[0].adversity || !parsed[0].belief)) {
        throw new Error('Formato incompatible: los registros deben incluir adversidad y creencia.');
      }
      onImportEntries(parsed);
      onClose();
    } catch (e: any) {
      setImportError(e.message || 'Error al procesar el archivo JSON');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Gestión de Datos y Copias de Seguridad
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Todos tus registros ABCDE se guardan de forma privada en tu navegador (localStorage).
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('export')}
              className={`pb-2.5 transition flex items-center gap-1.5 ${
                activeTab === 'export'
                  ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Exportar Datos</span>
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`pb-2.5 transition flex items-center gap-1.5 ${
                activeTab === 'import'
                  ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Importar JSON</span>
            </button>
          </div>

          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  readOnly
                  value={exportString}
                  rows={8}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar archivo .json</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('¿Deseas restaurar los ejemplos predeterminados del Dr. Seligman?')) {
                      onResetToDefault();
                      onClose();
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar ejemplos de muestra</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pega el contenido JSON o sube un archivo:
                </label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="[{ id: '...', adversity: '...' }]"
                  rows={6}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition">
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  <span>Seleccionar archivo local</span>
                </label>

                <button
                  onClick={handleImportSubmit}
                  disabled={!importJsonText.trim()}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition disabled:opacity-40"
                >
                  Procesar e Importar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
