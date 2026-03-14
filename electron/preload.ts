import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  exportPdf: () => ipcRenderer.invoke('export-pdf'),
  saveFile: (data: { filePath: string; content: string }) => ipcRenderer.invoke('save-file', data),
  saveFileAs: (data: { content: string; defaultPath?: string }) => ipcRenderer.invoke('save-file-as', data),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  setDirty: (dirty: boolean) => ipcRenderer.invoke('set-dirty', dirty),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  onFileOpened: (callback: (data: { content: string, filePath: string }) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = (_event: any, value: { content: string, filePath: string }) => callback(value);
    ipcRenderer.on('file-opened', subscription);
    return () => {
      ipcRenderer.removeListener('file-opened', subscription);
    };
  },
  onMenuSave: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('menu-save', subscription);
    return () => { ipcRenderer.removeListener('menu-save', subscription); };
  },
  onMenuSaveAs: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('menu-save-as', subscription);
    return () => { ipcRenderer.removeListener('menu-save-as', subscription); };
  },
  onMenuSaveThenClose: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('menu-save-then-close', subscription);
    return () => { ipcRenderer.removeListener('menu-save-then-close', subscription); };
  },
  onMenuSetViewMode: (callback: (mode: string) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = (_event: any, mode: string) => callback(mode);
    ipcRenderer.on('menu-set-view-mode', subscription);
    return () => { ipcRenderer.removeListener('menu-set-view-mode', subscription); };
  },
  onMenuToggleSidebar: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('menu-toggle-sidebar', subscription);
    return () => { ipcRenderer.removeListener('menu-toggle-sidebar', subscription); };
  },
  onMenuOpenSettings: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('menu-open-settings', subscription);
    return () => { ipcRenderer.removeListener('menu-open-settings', subscription); };
  },
  onMenuExportPdf: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('menu-export-pdf', subscription);
    return () => { ipcRenderer.removeListener('menu-export-pdf', subscription); };
  },
});
