import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the welcome message in preview and editor', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Welcome to Yam/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue(/# Welcome to Yam/i)).toBeInTheDocument();
  });

  it('renders the sidebar buttons', () => {
    render(<App />);
    expect(screen.getByText(/Open File/i)).toBeInTheDocument();
    
    // "Dark Mode" might appear in the markdown text too, so we check for at least one instance
    const darkModes = screen.getAllByText(/Dark Mode/i);
    expect(darkModes.length).toBeGreaterThan(0);
    
    // Check for "Export PDF" button
    expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
  });
});
