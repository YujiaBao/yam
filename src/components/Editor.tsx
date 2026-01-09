import React from 'react';
import clsx from 'clsx';
import type { ViewMode } from '../types';

interface EditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  viewMode: ViewMode;
}

export const Editor: React.FC<EditorProps> = ({ markdown, setMarkdown, viewMode }) => {
  return (
    <div className={clsx(
      "h-full flex flex-col border-r border-gray-200 dark:border-gray-800 editor-pane",
      viewMode === 'edit' ? "w-full" : viewMode === 'split' ? "w-1/2" : "w-0 hidden"
    )}>
      <textarea
        className="w-full h-full resize-none p-8 outline-none bg-transparent font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        spellCheck={false}
        placeholder="Start writing..."
      />
    </div>
  );
};
