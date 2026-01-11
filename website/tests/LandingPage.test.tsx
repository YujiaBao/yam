import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LandingPage from '../src/LandingPage';

describe('Yam Landing Page', () => {
  beforeEach(() => {
    // Mock fetch for default.md (SettingsModal fetches it)
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('# Welcome'),
      })
    ));
  });

  it('renders the brand title and tagline', () => {
    render(<LandingPage />);
    const brandTitles = screen.getAllByText(/Yam/i);
    expect(brandTitles.length).toBeGreaterThan(0);
    expect(screen.getByText(/Yet Another Markdown app/i)).toBeInTheDocument();
  });

  it('contains a link to the github repo', () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/YujiaBao \/ yam/i).length).toBeGreaterThan(0);
  });

  it('contains a download button for the macOS DMG', () => {
    render(<LandingPage />);
    // There are multiple download links, we check the main CTA
    const downloadBtns = screen.getAllByRole('link', { name: /Download for macOS/i });
    expect(downloadBtns.length).toBeGreaterThan(0);
  });

  it('renders the feature carousel', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('feature-carousel')).toBeInTheDocument();
  });

  it('renders fixed-size icon containers in the feature grid', () => {
    const { container } = render(<LandingPage />);
    const iconContainers = container.querySelectorAll('.w-14.h-14');
    expect(iconContainers.length).toBe(3); 
  });
});