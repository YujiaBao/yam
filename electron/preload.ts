import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  exportPdf: () => ipcRenderer.invoke('export-pdf'),
});