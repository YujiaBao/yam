import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock electron
Object.defineProperty(window, 'electron', {
  value: {
    onFileOpened: vi.fn(() => () => {}),
    exportPdf: vi.fn(),
    setDirty: vi.fn(),
    onMenuSave: vi.fn(() => () => {}),
    onMenuSaveAs: vi.fn(() => () => {}),
    onMenuSaveThenClose: vi.fn(() => () => {}),
    onMenuSetViewMode: vi.fn(() => () => {}),
    onMenuToggleSidebar: vi.fn(() => () => {}),
    onMenuOpenSettings: vi.fn(() => () => {}),
    onMenuExportPdf: vi.fn(() => () => {}),
  },
  configurable: true,
});

window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the welcome message in preview and editor', async () => {
    render(<App />);
    // Preview uses debounced markdown (150ms delay), allow extra time
    expect(await screen.findByRole('heading', { name: /Welcome to Yam/i }, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByDisplayValue(/# Welcome to Yam/i)).toBeInTheDocument();
  });

  it('renders the toolbar with view mode buttons', async () => {
    render(<App />);
    // Wait for app to fully load
    await screen.findByRole('heading', { name: /Welcome to Yam/i }, { timeout: 3000 });

    expect(screen.getByTitle('Editor')).toBeInTheDocument();
    expect(screen.getByTitle('Split')).toBeInTheDocument();
    expect(screen.getByTitle('Preview')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });
});
