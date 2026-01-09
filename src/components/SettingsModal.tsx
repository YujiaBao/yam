import React from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
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
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  cssThemes,
  activeThemeId,
  activeCss,
  setActiveThemeId,
  onCssChange,
  onCreateTheme,
  onDeleteTheme,
  onImportCss
}) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Theme List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-500 uppercase tracking-wider">CSS Themes</span>
              <div className="flex gap-2">
                <label className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer" title="Import CSS">
                  <input type="file" className="hidden" accept=".css" onChange={onImportCss} />
                  <Upload size={16} />
                </label>
                <button onClick={onCreateTheme} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="New Theme">
                  <Plus size={16} />
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
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => setActiveThemeId(t.id)}
                >
                  <span className="truncate">{t.name}</span>
                  {!DEFAULT_THEMES.some(dt => dt.id === t.id) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteTheme(); }}
                      className={clsx(
                        "opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity",
                        activeThemeId === t.id ? "hover:bg-indigo-700" : "hover:bg-gray-300 dark:hover:bg-gray-700"
                      )}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm font-medium">{cssThemes.find(t => t.id === activeThemeId)?.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Edit the CSS below to customize this theme. Changes are saved automatically.
              </p>
            </div>
            <textarea
              className="flex-1 w-full p-4 bg-white dark:bg-gray-900 font-mono text-sm resize-none outline-none"
              placeholder="/* Enter your custom CSS here */"
              value={activeCss}
              onChange={(e) => onCssChange(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
