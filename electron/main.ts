import { app, BrowserWindow, ipcMain, dialog, protocol, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { handleYamLocalProtocol } from './protocol';

// Maps to track open files
// Key: Absolute file path, Value: Window ID
const openFiles = new Map<string, number>();

// Track dirty state per window
const windowDirtyState = new Map<number, boolean>();

// Track file path per window (for windows that save-as to a new path)
const windowFilePaths = new Map<number, string>();

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
  const query = filePath ? '?file=true' : '';

  if (isDev) {
    mainWindow.loadURL(`http://localhost:5173${query}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'), { search: query });
  }

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // If a file path is provided, load it when the window is ready
  if (filePath) {
    // Track this file
    openFiles.set(filePath, mainWindow.id);
    windowFilePaths.set(mainWindow.id, filePath);
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

  // Close guard for unsaved changes
  mainWindow.on('close', (e) => {
    if (windowDirtyState.get(mainWindow.id)) {
      e.preventDefault();
      dialog.showMessageBox(mainWindow, {
        type: 'warning',
        buttons: ['Save', "Don't Save", 'Cancel'],
        defaultId: 0,
        cancelId: 2,
        message: 'Do you want to save changes before closing?',
        detail: 'Your changes will be lost if you don\'t save them.',
      }).then(({ response }) => {
        if (response === 0) {
          // Save — tell renderer to save then close
          mainWindow.webContents.send('menu-save-then-close');
        } else if (response === 1) {
          // Don't Save — force close
          windowDirtyState.delete(mainWindow.id);
          mainWindow.destroy();
        }
        // Cancel (response === 2) — do nothing
      });
    }
  });

  // Cleanup on close
  mainWindow.on('closed', () => {
    const fp = windowFilePaths.get(mainWindow.id);
    if (fp) {
      openFiles.delete(fp);
    }
    if (filePath && filePath !== fp) {
      openFiles.delete(filePath);
    }
    windowDirtyState.delete(mainWindow.id);
    windowFilePaths.delete(mainWindow.id);
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

// Save file to existing path
ipcMain.handle('save-file', async (event, { filePath, content }: { filePath: string; content: string }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    if (win) {
      // Update tracking
      openFiles.set(filePath, win.id);
      windowFilePaths.set(win.id, filePath);
      win.setRepresentedFilename(filePath);
      win.setDocumentEdited(false);
      windowDirtyState.set(win.id, false);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Save file with dialog
ipcMain.handle('save-file-as', async (event, { content, defaultPath }: { content: string; defaultPath?: string }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { success: false, error: 'No window found' };

  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: 'Save As',
    defaultPath: defaultPath || 'Untitled.md',
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (canceled || !filePath) return { success: false, canceled: true };

  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    // Remove old file tracking for this window
    const oldPath = windowFilePaths.get(win.id);
    if (oldPath) openFiles.delete(oldPath);
    // Update tracking
    openFiles.set(filePath, win.id);
    windowFilePaths.set(win.id, filePath);
    win.setRepresentedFilename(filePath);
    win.setDocumentEdited(false);
    windowDirtyState.set(win.id, false);
    return { success: true, filePath };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

// Open file dialog
ipcMain.handle('open-file-dialog', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { canceled: true };

  const { filePaths, canceled } = await dialog.showOpenDialog(win, {
    title: 'Open File',
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });

  if (canceled || filePaths.length === 0) return { canceled: true };

  const selectedPath = filePaths[0];

  // Check if already open in another window
  const existingWindowId = openFiles.get(selectedPath);
  if (existingWindowId) {
    const existingWindow = BrowserWindow.fromId(existingWindowId);
    if (existingWindow) {
      existingWindow.focus();
      return { canceled: true };
    }
  }

  try {
    const content = await fs.promises.readFile(selectedPath, 'utf-8');
    // If current window is empty and clean, reuse it
    const currentPath = windowFilePaths.get(win.id);
    const isDirty = windowDirtyState.get(win.id);
    if (!currentPath && !isDirty) {
      // Reuse current window
      openFiles.set(selectedPath, win.id);
      windowFilePaths.set(win.id, selectedPath);
      win.setRepresentedFilename(selectedPath);
      return { filePath: selectedPath, content };
    }
    // Otherwise open in new window
    handleOpenFile(selectedPath);
    return { canceled: true };
  } catch (error) {
    return { canceled: true };
  }
});

// Set dirty state
ipcMain.handle('set-dirty', async (event, dirty: boolean) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    windowDirtyState.set(win.id, dirty);
    win.setDocumentEdited(dirty);
  }
});

// Force close window (after save confirmed)
ipcMain.handle('close-window', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    windowDirtyState.delete(win.id);
    win.destroy();
  }
});

// Build application menu
function buildAppMenu() {
  const isMac = process.platform === 'darwin';

  const template: Electron.MenuItemConstructorOptions[] = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' as const },
        { type: 'separator' as const },
        {
          label: 'Settings...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-open-settings');
          },
        },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const },
      ] as Electron.MenuItemConstructorOptions[],
    }] : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => createWindow(),
        },
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
              win.webContents.send('menu-open-file');
              // Trigger the open-file-dialog from main process directly
              dialog.showOpenDialog(win, {
                title: 'Open File',
                filters: [
                  { name: 'Markdown', extensions: ['md', 'markdown'] },
                  { name: 'Text', extensions: ['txt'] },
                  { name: 'All Files', extensions: ['*'] },
                ],
                properties: ['openFile'],
              }).then(({ filePaths, canceled }) => {
                if (canceled || filePaths.length === 0) return;
                const selectedPath = filePaths[0];
                handleOpenFile(selectedPath);
              });
            } else {
              // No window focused, open dialog from app
              const newWin = createWindow();
              newWin.once('ready-to-show', () => {
                dialog.showOpenDialog(newWin, {
                  title: 'Open File',
                  filters: [
                    { name: 'Markdown', extensions: ['md', 'markdown'] },
                    { name: 'Text', extensions: ['txt'] },
                    { name: 'All Files', extensions: ['*'] },
                  ],
                  properties: ['openFile'],
                }).then(({ filePaths, canceled }) => {
                  if (canceled || filePaths.length === 0) {
                    return;
                  }
                  const selectedPath = filePaths[0];
                  // Load file into the new window
                  fs.readFile(selectedPath, 'utf-8', (err, data) => {
                    if (err) return;
                    openFiles.set(selectedPath, newWin.id);
                    windowFilePaths.set(newWin.id, selectedPath);
                    newWin.setRepresentedFilename(selectedPath);
                    newWin.webContents.send('file-opened', { content: data, filePath: selectedPath });
                  });
                });
              });
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-save');
          },
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-save-as');
          },
        },
        { type: 'separator' },
        {
          label: 'Export PDF...',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-export-pdf');
          },
        },
        ...(isMac ? [] : [
          { type: 'separator' as const },
          {
            label: 'Settings...',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              const win = BrowserWindow.getFocusedWindow();
              if (win) win.webContents.send('menu-open-settings');
            },
          },
        ]),
        ...(isMac ? [] : [{ type: 'separator' as const }, { role: 'quit' as const }]),
      ] as Electron.MenuItemConstructorOptions[],
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ] as Electron.MenuItemConstructorOptions[],
    },

    // View menu
    {
      label: 'View',
      submenu: [
        {
          label: 'Editor',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-set-view-mode', 'edit');
          },
        },
        {
          label: 'Split',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-set-view-mode', 'split');
          },
        },
        {
          label: 'Preview',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-set-view-mode', 'preview');
          },
        },
        { type: 'separator' },
        {
          label: 'Toggle Toolbar',
          accelerator: 'CmdOrCtrl+\\',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('menu-toggle-sidebar');
          },
        },
      ] as Electron.MenuItemConstructorOptions[],
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' as const },
          { role: 'front' as const },
        ] : [
          { role: 'close' as const },
        ]),
      ] as Electron.MenuItemConstructorOptions[],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
  // Register 'yam-local' protocol to serve local files securely
  protocol.handle('yam-local', handleYamLocalProtocol);

  // Build and set the application menu
  buildAppMenu();

  // Handle files passed as arguments (Windows/Linux or CLI)
  const args = process.argv.slice(app.isPackaged ? 1 : 2);
  args.forEach(arg => {
    // Basic check to see if it's a file path and not a flag
    if (!arg.startsWith('-') && fs.existsSync(arg) && fs.lstatSync(arg).isFile()) {
      const fullPath = path.resolve(arg);
      // Only add if not already in queue (e.g. from open-file event)
      if (!fileOpenQueue.includes(fullPath)) {
        fileOpenQueue.push(fullPath);
      }
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

// Crash protection — log uncaught exceptions instead of crashing immediately
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
