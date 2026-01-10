import { app, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron';
import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';

// Maps to track open files
// Key: Absolute file path, Value: Window ID
const openFiles = new Map<string, number>();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Function to create a new window
const createWindow = (filePath?: string) => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // If a file path is provided, load it when the window is ready
  if (filePath) {
    // Track this file
    openFiles.set(filePath, mainWindow.id);
    mainWindow.setRepresentedFilename(filePath);

    mainWindow.webContents.on('did-finish-load', () => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Failed to read file', err);
          return;
        }
        // Send both content and the full file path
        mainWindow.webContents.send('file-opened', { content: data, filePath });
      });
    });
  }

  // Cleanup on close
  mainWindow.on('closed', () => {
    // Remove from map if it exists
    if (filePath) {
      openFiles.delete(filePath);
    }
  });

  return mainWindow;
};

// Function to handle opening a file (either focus existing or create new)
const handleOpenFile = (filePath: string) => {
  const existingWindowId = openFiles.get(filePath);
  
  if (existingWindowId) {
    const existingWindow = BrowserWindow.fromId(existingWindowId);
    if (existingWindow) {
      if (existingWindow.isMinimized()) existingWindow.restore();
      existingWindow.focus();
      return;
    }
  }

  createWindow(filePath);
};

// Global queue for files opened before app is ready
let fileOpenQueue: string[] = [];

app.on('open-file', (event, path) => {
  event.preventDefault();
  if (app.isReady()) {
    handleOpenFile(path);
  } else {
    fileOpenQueue.push(path);
  }
});

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

app.on('ready', () => {
  // Register 'yam-local' protocol to serve local files securely
  protocol.handle('yam-local', (request) => {
    const url = request.url.replace('yam-local://', '');
    try {
      const decodedPath = decodeURIComponent(url);
      return net.fetch(pathToFileURL(decodedPath).toString());
    } catch (error) {
      console.error('Failed to handle yam-local protocol:', error);
      return new Response('Not Found', { status: 404 });
    }
  });

  // Process queue
  if (fileOpenQueue.length > 0) {
    fileOpenQueue.forEach(path => handleOpenFile(path));
    fileOpenQueue = [];
  } else {
    // Open an empty window if no files requested
    createWindow();
  }
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
