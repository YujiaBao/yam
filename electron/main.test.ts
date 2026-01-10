import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock electron module
const mockBrowserWindow = {
  loadURL: vi.fn(),
  loadFile: vi.fn(),
  webContents: {
    openDevTools: vi.fn(),
    on: vi.fn(),
    send: vi.fn(),
    printToPDF: vi.fn(),
  },
  on: vi.fn(),
  once: vi.fn(),
  show: vi.fn(),
  setRepresentedFilename: vi.fn(),
  isMinimized: vi.fn(),
  restore: vi.fn(),
  focus: vi.fn(),
};

// Define a type for our mock constructor to avoid 'any'
type MockBrowserWindowConstructor = {
  new (_options?: unknown): typeof mockBrowserWindow;
  fromWebContents: unknown;
  fromId: unknown;
  getAllWindows: unknown;
};

const BrowserWindowMock = vi.fn(function() {
  return mockBrowserWindow;
}) as unknown as MockBrowserWindowConstructor;

BrowserWindowMock.fromWebContents = vi.fn();
BrowserWindowMock.fromId = vi.fn();
BrowserWindowMock.getAllWindows = vi.fn(() => []);

const mockApp = {
  on: vi.fn(),
  quit: vi.fn(),
  isReady: vi.fn().mockReturnValue(true),
  getPath: vi.fn(),
};

const mockIpcMain = {
  handle: vi.fn(),
};

const mockDialog = {
  showSaveDialog: vi.fn(),
};

const mockProtocol = {
    handle: vi.fn(),
}

vi.mock('electron', () => ({
  app: mockApp,
  BrowserWindow: BrowserWindowMock,
  ipcMain: mockIpcMain,
  dialog: mockDialog,
  protocol: mockProtocol,
  net: { fetch: vi.fn() },
}));

// Mock electron-squirrel-startup
vi.mock('electron-squirrel-startup', () => ({ default: false }));

describe('Electron Main Process', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should create window with show: false and show it on ready-to-show', async () => {
    // Import main to run the side effects
    // We use a query parameter to bypass cache if needed, but resetModules should handle it
    await import('./main');

    // Find the 'ready' handler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readyHandler = mockApp.on.mock.calls.find((call: any[]) => call[0] === 'ready')?.[1];
    expect(readyHandler).toBeDefined();

    // Execute ready handler to trigger createWindow
    readyHandler();

    // Check BrowserWindow constructor calls
    // It might be called multiple times if logic dictates, but here we expect one from ready
    expect(BrowserWindowMock).toHaveBeenCalled();
    
    // Get the config passed to the last call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = (BrowserWindowMock as unknown as any).mock.calls[0][0];
    
    // This assertion should FAIL currently
    expect(config.show).toBe(false);

    // Check that we listen to 'ready-to-show'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readyToShowCall = mockBrowserWindow.once.mock.calls.find((call: any[]) => call[0] === 'ready-to-show');
    expect(readyToShowCall).toBeDefined();
    
    // Execute the ready-to-show handler
    if (readyToShowCall) {
        const readyToShowHandler = readyToShowCall[1];
        readyToShowHandler();
    }
    
    expect(mockBrowserWindow.show).toHaveBeenCalled();
  });
});