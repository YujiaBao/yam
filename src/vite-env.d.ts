/// <reference types="vite/client" />
import 'react';

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

interface ElectronAPI {
  exportPdf: () => Promise<{ success?: boolean; path?: string; error?: string; canceled?: boolean }>;
  onFileOpened: (callback: (data: { content: string, filePath: string }) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
