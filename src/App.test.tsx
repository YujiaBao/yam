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
    expect(await screen.findByRole('heading', { name: /Welcome to Yam/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue(/# Welcome to Yam/i)).toBeInTheDocument();
  });

  it('renders the toolbar with view mode buttons', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: /Welcome to Yam/i });

    expect(screen.getByTitle('Editor')).toBeInTheDocument();
    expect(screen.getByTitle('Split')).toBeInTheDocument();
    expect(screen.getByTitle('Preview')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });
});
