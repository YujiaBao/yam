import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, HelpCircle, Lock } from 'lucide-react';
import clsx from 'clsx';
import type { Theme } from '../types';
import { DEFAULT_THEMES } from '../constants/themes';

interface SettingsModalProps {
  onClose: () => void;
  cssThemes: Theme[];
  activeThemeId: string;
  activeCss: string;
  setActiveThemeId: (id: string) => void;
  onCssChange: (newCss: string) => void;
  onCreateTheme: () => void;
  onDeleteTheme: () => void;
  onImportCss: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDefaultTheme: boolean;
}

const CSS_HELP = [
  { selector: '.markdown-body', desc: 'Main content container' },
  { selector: '.markdown-body h1, h2, h3', desc: 'Headings' },
  { selector: '.markdown-body p', desc: 'Paragraphs' },
  { selector: '.markdown-body li', desc: 'List items (bullet points)' },
  { selector: '.markdown-body ul, .markdown-body ol', desc: 'List containers' },
  { selector: '.markdown-body a', desc: 'Links' },
  { selector: '.markdown-body pre', desc: 'Code blocks' },
  { selector: '.markdown-body code', desc: 'Inline code' },
  { selector: '.markdown-body blockquote', desc: 'Quotes' },
  { selector: 'body', desc: 'App background' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  cssThemes,
  activeThemeId,
  activeCss,
  setActiveThemeId,
  onCssChange,
  onCreateTheme,
  onDeleteTheme,
  onImportCss,
  isDefaultTheme
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[650px]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Settings</h2>
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className={clsx(
                "p-1 rounded-full transition-colors",
                showHelp ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              )}
              title="CSS Reference"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Theme List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Themes</span>
              <div className="flex gap-1">
                <label className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400" title="Import CSS">
                  <input type="file" className="hidden" accept=".css" onChange={onImportCss} />
                  <Upload size={14} />
                </label>
                <button onClick={onCreateTheme} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400" title="New Theme">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {cssThemes.map(t => (
                <div
                  key={t.id}
                  className={clsx(
                    "px-3 py-2 rounded-lg text-sm cursor-pointer flex items-center justify-between group",
                    activeThemeId === t.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => setActiveThemeId(t.id)}
                >
                  <span className="truncate pr-2">{t.name}</span>
                  {!DEFAULT_THEMES.some(dt => dt.id === t.id) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteTheme(); }}
                      className={clsx(
                        "opacity-0 group-hover:opacity-100 p-1 rounded-md transition-opacity",
                        activeThemeId === t.id ? "hover:bg-indigo-700" : "hover:bg-gray-300 dark:hover:bg-gray-700"
                      )}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor & Help */}
          <div className="flex-1 flex overflow-hidden">
            <div className={clsx("flex flex-col transition-all duration-300", showHelp ? "w-1/2 border-r border-gray-200 dark:border-gray-700" : "w-full")}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">{cssThemes.find(t => t.id === activeThemeId)?.name}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {isDefaultTheme ? "Default themes are read-only." : "CSS changes are saved automatically."}
                  </p>
                </div>
                {isDefaultTheme && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded text-[10px] font-bold">
                    <Lock size={10} /> READ ONLY
                  </div>
                )}
              </div>
              <textarea
                className={clsx(
                  "flex-1 w-full p-4 bg-white dark:bg-gray-900 font-mono text-xs resize-none outline-none leading-relaxed",
                  isDefaultTheme && "opacity-60 cursor-not-allowed"
                )}
                placeholder="/* Enter custom CSS */"
                value={activeCss}
                onChange={(e) => onCssChange(e.target.value)}
                readOnly={isDefaultTheme}
                spellCheck={false}
              />
            </div>

            {showHelp && (
              <div className="w-1/2 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">CSS Reference</h4>
                <div className="space-y-4">
                  {CSS_HELP.map(item => (
                    <div key={item.selector} className="group">
                      <code className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                        {item.selector}
                      </code>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 pl-1 border-l-2 border-gray-200 dark:border-gray-700">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-normal">
                    <strong>Pro Tip:</strong> Use <code>!important</code> if your styles are not applying, as they may be overridden by default themes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
