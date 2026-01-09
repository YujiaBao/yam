import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { SettingsModal } from './components/SettingsModal';
import { useThemes } from './hooks/useThemes';
import type { FontType, FontWeight, ViewMode } from './types';

function App() {
  const [markdown, setMarkdown] = useState<string>('# Welcome to Yam\n\nStart typing or open a file to begin.\n\n- [x] Modern UI\n- [x] Dark Mode\n- [ ] Custom CSS\n\n<div style="color: red">Hello HTML</div>\n\n```js\nconsole.log("Hello World");\n```');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [font, setFont] = useState<FontType>('sans');
  const [fontWeight, setFontWeight] = useState<FontWeight>('normal');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
      const unsubscribe = window.electron.onFileOpened((content) => {
        setMarkdown(content);
      });
      return () => unsubscribe();
    }
  }, []);

  // Handle File Open
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      <div className="h-8 w-full bg-transparent flex-shrink-0 drag-region" style={{ WebkitAppRegion: 'drag' }} />

      <div className="flex-1 flex overflow-hidden">
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
        />

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