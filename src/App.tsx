import React, { useState, useEffect } from 'react';
import {
  PanelLeft
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { SettingsModal } from './components/SettingsModal';
import { useThemes } from './hooks/useThemes';
import type { FontType, FontWeight, ViewMode } from './types';

function App() {
  const [markdown, setMarkdown] = useState<string>(`# Welcome to Yam

**Yam** (Yet Another Markdown App) is a modern, minimalist editor for macOS.

## Features Overview

### Typography & Formatting
You can use **bold**, *italic*, ~~strikethrough~~, or \`inline code\`.

### Lists
- [x] Task lists are supported
- [ ] Unchecked item
- Bullet points
  - Nested bullets
    - Deeply nested

1. Ordered lists
2. Are also supported

### Tables
| Feature | Support |
| :--- | :--- |
| GitHub Flavored | ✅ |
| HTML Rendering | ✅ |
| PDF Export | ✅ |

### Code Blocks

\`\`\`typescript
// React Component Example
const Greeting = ({ name }: { name: string }) => (
  <div className="p-4 bg-indigo-100 rounded">
    Hello, {name}!
  </div>
);
\`\`\`

### HTML Support
<div style="padding: 12px; background-color: #dbeafe; color: #1e40af; border-radius: 8px; border: 1px solid #bfdbfe;">
  <strong>HTML Support:</strong> content can be styled directly.
</div>

> "Simplicity is the ultimate sophistication."
`);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [font, setFont] = useState<FontType>('sans');
  const [fontWeight, setFontWeight] = useState<FontWeight>('normal');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filePath, setFilePath] = useState<string>('');

  // Custom CSS Themes Hook
  const {
    cssThemes,
    activeThemeId,
    activeCss,
    setActiveThemeId,
    handleCssChange,
    handleCreateTheme,
    handleDeleteTheme,
    handleImportCss
  } = useThemes();

  // Handle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle incoming file from Electron (e.g. "Open With")
  useEffect(() => {
    if (window.electron && window.electron.onFileOpened) {
      const unsubscribe = window.electron.onFileOpened((data) => {
        setMarkdown(data.content);
        setFilePath(data.filePath);
        // Automatically switch to preview mode and hide sidebar for better reading experience
        setViewMode('preview');
        setIsSidebarOpen(false);
      });
      return () => unsubscribe();
    }
  }, []);

  // Handle File Open
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For file input, we get the file object but we might not get the full path reliably in browser context
    // However, Electron sets the 'path' property on the File object
    // @ts-ignore
    const fullPath = file.path; 
    setFilePath(fullPath || '');

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setMarkdown(text);
      }
    };
    reader.readAsText(file);
  };

  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      // Check if we are running in Electron
      if (window.electron) {
        await window.electron.exportPdf();
      } else {
        alert('PDF Export is only available in the desktop app.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const fonts = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const fontWeights = {
    light: 'font-light',
    normal: 'font-normal',
    bold: 'font-bold'
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${fonts[font]} ${fontWeights[fontWeight]}`}>
      
      {/* Inject Custom CSS */}
      <style>{activeCss}</style>

      {/* Draggable Title Bar Area for macOS */}
      <div className="h-[38px] w-full bg-transparent flex-shrink-0 drag-region flex items-center px-2" style={{ WebkitAppRegion: 'drag' }}>
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors ml-[72px] no-drag z-50"
            style={{ WebkitAppRegion: 'no-drag' }}
            title="Show Sidebar"
          >
            <PanelLeft size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <Sidebar 
            onFileUpload={handleFileUpload}
            onExportPdf={handleExportPdf}
            isExporting={isExporting}
            theme={theme}
            setTheme={setTheme}
            font={font}
            setFont={setFont}
            fontWeight={fontWeight}
            setFontWeight={setFontWeight}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            onToggleSidebar={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex overflow-hidden relative">
          <Editor 
            markdown={markdown}
            setMarkdown={setMarkdown}
            viewMode={viewMode}
          />
          
          <Preview 
            markdown={markdown}
            viewMode={viewMode}
            theme={theme}
            filePath={filePath}
          />

          {showSettings && (
            <SettingsModal 
              onClose={() => setShowSettings(false)}
              cssThemes={cssThemes}
              activeThemeId={activeThemeId}
              activeCss={activeCss}
              setActiveThemeId={setActiveThemeId}
              onCssChange={handleCssChange}
              onCreateTheme={handleCreateTheme}
              onDeleteTheme={handleDeleteTheme}
              onImportCss={handleImportCss}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
