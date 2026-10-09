import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { AbcdeEntry, MoodCheckIn } from '../types';

interface JsonDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AbcdeEntry[];
  moods: MoodCheckIn[];
  bookmarks: string[];
  onImportAllData: (data: { entries?: AbcdeEntry[]; moods?: MoodCheckIn[]; bookmarks?: string[] }) => void;
  onResetToDefault: () => void;
}

export const JsonDataModal: React.FC<JsonDataModalProps> = ({
  isOpen,
  onClose,
  entries,
  moods,
  bookmarks,
  onImportAllData,
  onResetToDefault,
}) => {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  if (!isOpen) return null;

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '2.5',
    entries,
    moods,
    bookmarks,
  };

  const exportString = JSON.stringify(exportPayload, null, 2);

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
    a.download = `optimind-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError('');
    try {
      const parsed = JSON.parse(importJsonText);
      // Support either raw array of entries or structured payload
      if (Array.isArray(parsed)) {
        onImportAllData({ entries: parsed });
      } else if (parsed && typeof parsed === 'object') {
        onImportAllData({
          entries: parsed.entries,
          moods: parsed.moods,
          bookmarks: parsed.bookmarks,
        });
      } else {
        throw new Error('Formato JSON no válido.');
      }
      onClose();
    } catch (e: any) {
      setImportError(e.message || 'Error al procesar el archivo JSON.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#333E38]/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#FBF9F5] rounded-[1.75rem] p-7 sm:p-9 shadow-tonal-lg border border-[#E6DFD5]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#647069] hover:text-[#333E38] hover:bg-[#F3EEE7] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold text-[#2E5A44] mb-1">
              Privacidad & Respaldo Local
            </div>
            <h2 className="font-serif text-2xl text-[#333E38]">
              Copia de Seguridad de tus Datos
            </h2>
            <p className="text-xs text-[#55635C] mt-1.5 leading-relaxed">
              Todos tus ejercicios ABCDE, registros de ánimo y marcadores del glosario se guardan en tu navegador. 
              Puedes exportarlos o importarlos en cualquier momento.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-[#E6DFD5] gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('export')}
              className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
                activeTab === 'export'
                  ? 'border-[#2E5A44] text-[#2E5A44] font-semibold'
                  : 'border-transparent text-[#647069]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Exportar Datos</span>
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
                activeTab === 'import'
                  ? 'border-[#2E5A44] text-[#2E5A44] font-semibold'
                  : 'border-transparent text-[#647069]'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Importar JSON</span>
            </button>
          </div>

          {activeTab === 'export' ? (
            <div className="space-y-4">
              <textarea
                readOnly
                value={exportString}
                rows={7}
                className="w-full p-3 font-mono text-[11px] rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] text-[#333E38] focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-[#F3EEE7] hover:bg-[#EAE4DB] text-xs font-medium text-[#333E38] transition flex items-center gap-1.5 border border-[#E6DFD5]"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#2E5A44]" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar texto'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar .json</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('¿Deseas restaurar los ejemplos predeterminados de Martin Seligman?')) {
                      onResetToDefault();
                      onClose();
                    }
                  }}
                  className="text-xs text-[#647069] hover:text-[#333E38] flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar predeterminados</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Pega el contenido JSON aquí o sube un archivo..."
                rows={6}
                className="w-full p-3 font-mono text-[11px] rounded-2xl bg-[#F3EEE7] border border-[#E6DFD5] text-[#333E38] focus:outline-none focus:ring-2 focus:ring-[#2E5A44]/30"
              />

              {importError && (
                <div className="p-3 rounded-xl bg-[#F8EFEA] border border-[#C86D51]/30 text-xs text-[#C86D51] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="px-3.5 py-2 rounded-xl border border-[#E6DFD5] hover:bg-[#F3EEE7] text-xs font-medium text-[#333E38] cursor-pointer transition">
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  <span>Seleccionar archivo .json</span>
                </label>

                <button
                  onClick={handleImportSubmit}
                  disabled={!importJsonText.trim()}
                  className="px-5 py-2 rounded-xl bg-[#2E5A44] hover:bg-[#244836] text-[#FBF9F5] text-xs font-semibold transition disabled:opacity-40"
                >
                  Importar Datos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
