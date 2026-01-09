import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  exportPdf: () => ipcRenderer.invoke('export-pdf'),
  onFileOpened: (callback: (data: { content: string, filePath: string }) => void) => {
    const subscription = (_event: any, value: { content: string, filePath: string }) => callback(value);
    ipcRenderer.on('file-opened', subscription);
    return () => {
      ipcRenderer.removeListener('file-opened', subscription);
    };
  },
});