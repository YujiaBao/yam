import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset', // Mac-like nice title bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Check if we are in dev mode
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

// Register IPC handlers once
ipcMain.handle('export-pdf', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { success: false, error: 'No window found' };

  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Export to PDF',
    defaultPath: 'document.pdf',
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
  });

  if (filePath) {
    try {
      const pdfData = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
      });
      fs.writeFileSync(filePath, pdfData);
      return { success: true, path: filePath };
    } catch (error) {
      console.error('Failed to export PDF:', error);
      return { success: false, error: String(error) };
    }
  }
  return { canceled: true };
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});