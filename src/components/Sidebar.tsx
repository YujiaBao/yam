import React from 'react';
import {
  FileText,
  Moon,
  Sun,
  Type,
  Settings,
  Columns,
  Eye,
  Edit3,
  Bold,
  Download,
  PanelLeftClose
} from 'lucide-react';
import clsx from 'clsx';
import type { FontType, FontWeight, ViewMode } from '../types';

interface SidebarProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportPdf: () => void;
  isExporting: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  font: FontType;
  setFont: (font: React.SetStateAction<FontType>) => void;
  fontWeight: FontWeight;
  setFontWeight: (weight: React.SetStateAction<FontWeight>) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onToggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onFileUpload,
  onExportPdf,
  isExporting,
  theme,
  setTheme,
  font,
  setFont,
  fontWeight,
  setFontWeight,
  viewMode,
  setViewMode,
  showSettings,
  setShowSettings,
  onToggleSidebar
}) => {
  return (
    <aside className="w-16 flex-shrink-0 flex flex-col items-center py-4 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 z-10 pt-2">
      {/* Collapse Toggle */}
      <button
        onClick={onToggleSidebar}
        className="mb-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title="Collapse Sidebar"
      >
        <PanelLeftClose size={20} />
      </button>

      <nav className="flex-1 flex flex-col gap-3 w-full px-2 mt-4">
        {/* File Upload */}
        <label className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors group relative flex justify-center">
          <input type="file" className="hidden" accept=".md,.txt" onChange={onFileUpload} />
          <FileText size={20} className="text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Open File
          </span>
        </label>

        {/* Export PDF */}
        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group relative flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} className="text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </span>
        </button>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-1" />

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group relative flex justify-center"
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-gray-500 group-hover:text-indigo-600" />
          ) : (
            <Sun size={20} className="text-gray-400 group-hover:text-yellow-400" />
          )}
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>

        {/* Font Toggle */}
        <button
          onClick={() => setFont(current => {
            if (current === 'sans') return 'serif';
            if (current === 'serif') return 'mono';
            return 'sans';
          })}
          className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group relative flex justify-center"
        >
          <Type size={20} className="text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Change Font ({font})
          </span>
        </button>

        {/* Font Weight Toggle */}
        <button
          onClick={() => setFontWeight(current => {
            if (current === 'light') return 'normal';
            if (current === 'normal') return 'bold';
            return 'light';
          })}
          className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group relative flex justify-center"
        >
          <Bold size={20} className={clsx("text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400", fontWeight === 'bold' && "text-indigo-600 font-bold", fontWeight === 'light' && "font-light")} />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Weight: {fontWeight}
          </span>
        </button>
      </nav>

      <div className="mt-auto px-2 w-full flex flex-col gap-3 pb-2">
        {/* View Mode Toggles */}
        <button
          onClick={() => setViewMode('edit')}
          className={clsx(
            "p-3 rounded-xl transition-colors group relative flex justify-center",
            viewMode === 'edit' ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-200 dark:hover:bg-gray-800"
          )}
        >
          <Edit3 size={20} className={viewMode === 'edit' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"} />
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={clsx(
            "p-3 rounded-xl transition-colors group relative flex justify-center",
            viewMode === 'split' ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-200 dark:hover:bg-gray-800"
          )}
        >
          <Columns size={20} className={viewMode === 'split' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"} />
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={clsx(
            "p-3 rounded-xl transition-colors group relative flex justify-center",
            viewMode === 'preview' ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-200 dark:hover:bg-gray-800"
          )}
        >
          <Eye size={20} className={viewMode === 'preview' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"} />
        </button>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-1" />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group relative flex justify-center"
        >
          <Settings size={20} className="text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400" />
        </button>
      </div>
    </aside>
  );
};
