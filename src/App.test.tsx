import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock electron
vi.stubGlobal('window', {
  electron: {
    onFileOpened: vi.fn(() => () => {}),
    exportPdf: vi.fn(),
  },
  matchMedia: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('App', () => {
  beforeEach(() => {
    // Mock fetch for default.md
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('# Welcome to Yam'),
      })
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the welcome message in preview and editor', async () => {
    render(<App />);
    // Wait for fetch to complete
    expect(await screen.findByRole('heading', { name: /Welcome to Yam/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue(/# Welcome to Yam/i)).toBeInTheDocument();
  });

  it('renders the sidebar buttons', async () => {
    render(<App />);
    // Wait for app to load
    await screen.findByRole('heading', { name: /Welcome to Yam/i });
    
    // Sidebar is hidden by default. Click toggle to show it.
    const toggleBtn = screen.getByTitle('Show Sidebar');
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/Open File/i)).toBeInTheDocument();
    expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Font/i)).toBeInTheDocument();
  });
});