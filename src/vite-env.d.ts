/// <reference types="vite/client" />
import 'react';

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

interface ElectronAPI {
  exportPdf: () => Promise<{ success?: boolean; path?: string; error?: string; canceled?: boolean }>;
  saveFile: (data: { filePath: string; content: string }) => Promise<{ success: boolean; error?: string }>;
  saveFileAs: (data: { content: string; defaultPath?: string }) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  openFileDialog: () => Promise<{ filePath?: string; content?: string; canceled?: boolean }>;
  setDirty: (dirty: boolean) => Promise<void>;
  closeWindow: () => Promise<void>;
  onFileOpened: (callback: (data: { content: string, filePath: string }) => void) => () => void;
  onMenuSave: (callback: () => void) => () => void;
  onMenuSaveAs: (callback: () => void) => () => void;
  onMenuSaveThenClose: (callback: () => void) => () => void;
  onMenuSetViewMode: (callback: (mode: string) => void) => () => void;
  onMenuToggleSidebar: (callback: () => void) => () => void;
  onMenuOpenSettings: (callback: () => void) => () => void;
  onMenuExportPdf: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
