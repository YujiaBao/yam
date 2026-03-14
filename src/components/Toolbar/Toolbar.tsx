import React from 'react';
import {
  Type,
  Bold,
  Settings,
  Columns,
  Eye,
  Edit3,
  EyeOff,
} from 'lucide-react';
import clsx from 'clsx';
import type { FontWeight, ViewMode } from '../../types';

interface ToolbarProps {
  font: string;
  cycleFont: () => void;
  fontWeight: FontWeight;
  cycleWeight: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setShowSettings: (show: boolean) => void;
  onHide: () => void;
}

const btnClass = 'flex items-center px-2 py-1 rounded-md text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors';

export const Toolbar: React.FC<ToolbarProps> = ({
  font,
  cycleFont,
  fontWeight,
  cycleWeight,
  viewMode,
  setViewMode,
  setShowSettings,
  onHide,
}) => {
  const viewButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'edit', icon: <Edit3 size={14} />, label: 'Editor' },
    { mode: 'split', icon: <Columns size={14} />, label: 'Split' },
    { mode: 'preview', icon: <Eye size={14} />, label: 'Preview' },
  ];

  return (
    <div className="flex items-center gap-1.5" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
      {/* View Mode Segmented Control */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
        {viewButtons.map(({ mode, icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            title={label}
            className={clsx(
              'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
              viewMode === mode
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Font cycle */}
      <button onClick={cycleFont} title={`Font: ${font}`} className={btnClass}>
        <Type size={14} />
      </button>

      {/* Weight cycle */}
      <button onClick={cycleWeight} title={`Weight: ${fontWeight}`} className={clsx(btnClass, fontWeight === 'bold' && 'text-gray-900 dark:text-gray-100')}>
        <Bold size={14} />
      </button>

      {/* Settings */}
      <button onClick={() => setShowSettings(true)} title="Settings" className={btnClass}>
        <Settings size={14} />
      </button>

      {/* Hide toolbar */}
      <button onClick={onHide} title="Hide toolbar (⌘\)" className={btnClass}>
        <EyeOff size={14} />
      </button>
    </div>
  );
};
