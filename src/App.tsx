import { useState, useEffect, useRef, useCallback } from 'react';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Editor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { useThemes } from './hooks/useThemes';
import { useFonts } from './hooks/useFonts';
import { useGeneralSettings } from './hooks/useGeneralSettings';
import { useSyncScroll } from './hooks/useSyncScroll';
import { useScrollFade } from './hooks/useScrollFade';
import type { ViewMode } from './types';

function App() {
  const [markdown, setMarkdown] = useState<string>("");
  const [debouncedMarkdown, setDebouncedMarkdown] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('yam_launch_view_mode') as ViewMode) || 'split';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [filePath, setFilePath] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);

  const editorRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const savedContentRef = useRef<string>("");
  const markdownRef = useRef<string>(markdown);
  const filePathRef = useRef<string>(filePath);
  const dirtyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep refs in sync
  useEffect(() => { markdownRef.current = markdown; }, [markdown]);

  // Debounce preview updates (150ms) to avoid re-parsing markdown on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMarkdown(markdown), 150);
    return () => clearTimeout(timer);
  }, [markdown]);
  useEffect(() => { filePathRef.current = filePath; }, [filePath]);

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
    const params = new URLSearchParams(window.location.search);
    const isOpeningFile = params.get('file') === 'true';

    const loadContent = async () => {
      if (isOpeningFile || filePath) return;

      if (customDefaultContent !== null) {
        setMarkdown(customDefaultContent);
        setDebouncedMarkdown(customDefaultContent);
        savedContentRef.current = customDefaultContent;
      } else {
        try {
          const res = await fetch('default.md');
          if (res.ok) {
            const text = await res.text();
            setMarkdown(text);
            setDebouncedMarkdown(text);
            savedContentRef.current = text;
          }
        } catch (e) {
          console.error("Failed to load default content", e);
        }
      }
    };
    loadContent();
  }, [customDefaultContent, filePath]);

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

  // Auto-hide scrollbars after 3s of no scroll
  useScrollFade(editorRef);
  useScrollFade(previewRef);

  // Handle Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDark]);

  // Dirty state tracking (debounce IPC call)
  const updateDirty = useCallback((content: string) => {
    const dirty = content !== savedContentRef.current;
    setIsDirty(dirty);
    if (window.electron?.setDirty) {
      if (dirtyTimerRef.current) clearTimeout(dirtyTimerRef.current);
      dirtyTimerRef.current = setTimeout(() => window.electron.setDirty(dirty), 300);
    }
  }, []);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value);
    updateDirty(value);
  }, [updateDirty]);

  // Window title
  useEffect(() => {
    const fileName = filePath ? filePath.split('/').pop() : 'Untitled';
    document.title = `${isDirty ? '● ' : ''}${fileName} — Yam`;
  }, [isDirty, filePath]);

  // Save handlers
  const handleSaveAs = useCallback(async (): Promise<boolean> => {
    if (!window.electron) return false;
    const content = markdownRef.current;
    const currentPath = filePathRef.current;

    const result = await window.electron.saveFileAs({ content, defaultPath: currentPath || undefined });
    if (result.success && result.filePath) {
      savedContentRef.current = content;
      setFilePath(result.filePath);
      setIsDirty(false);
      return true;
    }
    if (result.error) {
      alert(`Failed to save: ${result.error}`);
    }
    return false;
  }, []);

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!window.electron) return false;
    const currentPath = filePathRef.current;
    const content = markdownRef.current;

    if (currentPath) {
      const result = await window.electron.saveFile({ filePath: currentPath, content });
      if (result.success) {
        savedContentRef.current = content;
        setIsDirty(false);
        return true;
      } else {
        alert(`Failed to save: ${result.error}`);
        return false;
      }
    } else {
      return handleSaveAs();
    }
  }, [handleSaveAs]);

  // Handle incoming file from Electron (e.g. "Open With")
  useEffect(() => {
    if (window.electron && window.electron.onFileOpened) {
      const unsubscribe = window.electron.onFileOpened((data) => {
        setMarkdown(data.content);
        setDebouncedMarkdown(data.content);
        savedContentRef.current = data.content;
        setFilePath(data.filePath);
        setIsDirty(false);
        // Use configured view mode for file opening
        const mode = localStorage.getItem('yam_file_open_view_mode') as ViewMode || 'preview';
        setViewMode(mode);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
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
  }, [isExporting]);

  // Menu event listeners
  useEffect(() => {
    if (!window.electron) return;

    const cleanups: (() => void)[] = [];

    if (window.electron.onMenuSave) {
      cleanups.push(window.electron.onMenuSave(() => { handleSave(); }));
    }
    if (window.electron.onMenuSaveAs) {
      cleanups.push(window.electron.onMenuSaveAs(() => { handleSaveAs(); }));
    }
    if (window.electron.onMenuSaveThenClose) {
      cleanups.push(window.electron.onMenuSaveThenClose(async () => {
        const saved = await handleSave();
        if (saved && window.electron?.closeWindow) {
          window.electron.closeWindow();
        }
      }));
    }
    if (window.electron.onMenuSetViewMode) {
      cleanups.push(window.electron.onMenuSetViewMode((mode) => {
        setViewMode(mode as ViewMode);
      }));
    }
    if (window.electron.onMenuToggleSidebar) {
      cleanups.push(window.electron.onMenuToggleSidebar(() => {
        setIsToolbarVisible(prev => !prev);
      }));
    }
    if (window.electron.onMenuOpenSettings) {
      cleanups.push(window.electron.onMenuOpenSettings(() => {
        setShowSettings(true);
      }));
    }
    if (window.electron.onMenuExportPdf) {
      cleanups.push(window.electron.onMenuExportPdf(() => {
        handleExportPdf();
      }));
    }

    return () => { cleanups.forEach(fn => fn()); };
  }, [handleSave, handleSaveAs, handleExportPdf]);

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

      {/* Title Bar with optional Toolbar */}
      <div
        className="h-[38px] w-full bg-transparent flex-shrink-0 drag-region flex items-center justify-end px-3"
        style={{ WebkitAppRegion: 'drag' }}
        onDoubleClick={!isToolbarVisible ? () => setIsToolbarVisible(true) : undefined}
      >
        {isToolbarVisible && (
          <Toolbar
            font={activeFont.name}
            cycleFont={cycleFont}
            fontWeight={activeWeight}
            cycleWeight={cycleWeight}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setShowSettings={setShowSettings}
            onHide={() => setIsToolbarVisible(false)}
          />
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex overflow-hidden relative">
          <Editor
            ref={editorRef}
            markdown={markdown}
            setMarkdown={handleMarkdownChange}
            viewMode={viewMode}
          />

          <Preview
            ref={previewRef}
            markdown={debouncedMarkdown}
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
