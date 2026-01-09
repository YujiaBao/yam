import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  exportPdf: () => ipcRenderer.invoke('export-pdf'),
  onFileOpened: (callback: (content: string) => void) => {
    const subscription = (_event: any, value: string) => callback(value);
    ipcRenderer.on('file-opened', subscription);
    return () => {
      ipcRenderer.removeListener('file-opened', subscription);
    };
  },
});
