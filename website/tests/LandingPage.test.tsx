import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '../src/LandingPage';

describe('Yam Landing Page', () => {
  it('renders the hero title and subtitle', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Modern Markdown for macOS/i)).toBeInTheDocument();
    expect(screen.getByText(/Minimalist editor with powerful customization/i)).toBeInTheDocument();
  });

  it('contains a download button for the macOS DMG', () => {
    render(<LandingPage />);
    const downloadBtn = screen.getByRole('link', { name: /Download for macOS/i });
    expect(downloadBtn).toBeInTheDocument();
    expect(downloadBtn).toHaveAttribute('href', expect.stringContaining('.dmg'));
  });

  it('renders the interactive demo window', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('demo-window')).toBeInTheDocument();
  });

  it('changes theme in the demo window when a theme button is clicked', () => {
    render(<LandingPage />);
    const nordButton = screen.getByRole('button', { name: /Nord/i });
    
    // Check if clicking Nord updates the style/class
    fireEvent.click(nordButton);
    const demoWindow = screen.getByTestId('demo-window');
    // We expect the theme background or a descriptive class to change
    expect(demoWindow).toHaveClass('theme-nord');
  });
});
