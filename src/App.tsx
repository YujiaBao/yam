import React, { useState, useEffect, useRef } from 'react';
import {
  PanelLeft
} from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Editor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { useThemes } from './hooks/useThemes';
import { useFonts } from './hooks/useFonts';
import { useGeneralSettings } from './hooks/useGeneralSettings';
import { useSyncScroll } from './hooks/useSyncScroll';
import type { ViewMode } from './types';

function App() {
  const [markdown, setMarkdown] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('yam_launch_view_mode') as ViewMode) || 'split';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filePath, setFilePath] = useState<string>('');

  const editorRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLElement>(null);

  const {
    fonts,
    activeFont,
    activeFontId,
    activeWeight,
    setActiveFontId,
    getSystemFonts,
    handleCreateFont,
    handleDeleteFont,
    cycleFont,
    cycleWeight
  } = useFonts();

  const {
    launchViewMode,
    setLaunchViewMode,
    fileOpenViewMode,
    setFileOpenViewMode,
    customDefaultContent,
    setCustomDefaultContent
  } = useGeneralSettings();

  useEffect(() => {
    const loadContent = async () => {
      // If we already have content (e.g. from file open which might run before this?), skip.
      // But file open is async event. 
      // Let's assume on mount we want default content.
      if (customDefaultContent !== null) {
        setMarkdown(customDefaultContent);
      } else {
        try {
          const res = await fetch('default.md');
          if (res.ok) {
            setMarkdown(await res.text());
          }
        } catch (e) {
          console.error("Failed to load default content", e);
        }
      }
    };
    loadContent();
  }, [customDefaultContent]); // Run on mount or when custom content setting changes

  // Custom CSS Themes Hook
  const {
    cssThemes,
    activeThemeId,
    activeTheme,
    activeCss,
    setActiveThemeId,
    handleCssChange,
    handleCreateTheme,
    handleDuplicateTheme,
    handleRenameTheme,
    handleDeleteTheme,
    handleImportCss,
    isDefaultTheme
  } = useThemes();

  const isDark = activeTheme.isDark;

  // Synchronized Scrolling
  useSyncScroll(editorRef, previewRef, viewMode === 'split');

  // Handle Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle incoming file from Electron (e.g. "Open With")
  useEffect(() => {
    if (window.electron && window.electron.onFileOpened) {
      const unsubscribe = window.electron.onFileOpened((data) => {
        setMarkdown(data.content);
        setFilePath(data.filePath);
        // Use configured view mode for file opening
        const mode = localStorage.getItem('yam_file_open_view_mode') as ViewMode || 'preview';
        setViewMode(mode);
        // Hide sidebar for focus
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fullPath = (file as any).path; 
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

  const fontWeights = {
    light: 'font-light',
    normal: 'font-normal',
    bold: 'font-bold'
  };

  return (
    <div 
      className={`h-screen w-screen flex flex-col overflow-hidden text-gray-900 dark:text-gray-100 app-container ${fontWeights[activeWeight]}`}
      style={{ fontFamily: activeFont.family }}
    > 
      
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
            font={activeFont.name}
            cycleFont={cycleFont}
            fontWeight={activeWeight}
            cycleWeight={cycleWeight}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            onToggleSidebar={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex overflow-hidden relative">
          <Editor 
            ref={editorRef}
            markdown={markdown}
            setMarkdown={setMarkdown}
            viewMode={viewMode}
          />
          
          <Preview 
            ref={previewRef}
            markdown={markdown}
            viewMode={viewMode}
            isDark={!!isDark}
            themeId={activeThemeId}
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
              onDuplicateTheme={handleDuplicateTheme}
              onRenameTheme={handleRenameTheme}
              onDeleteTheme={handleDeleteTheme}
              onImportCss={handleImportCss}
              isDefaultTheme={isDefaultTheme}
              fonts={fonts}
              activeFontId={activeFontId}
              setActiveFontId={setActiveFontId}
              getSystemFonts={getSystemFonts}
              onCreateFont={handleCreateFont}
              onDeleteFont={handleDeleteFont}
              launchViewMode={launchViewMode}
              setLaunchViewMode={setLaunchViewMode}
              fileOpenViewMode={fileOpenViewMode}
              setFileOpenViewMode={setFileOpenViewMode}
              customDefaultContent={customDefaultContent}
              setCustomDefaultContent={setCustomDefaultContent}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
