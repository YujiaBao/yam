import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '../src/LandingPage';

describe('Yam Landing Page', () => {
  it('renders the brand title and tagline', () => {
    render(<LandingPage />);
    const brandTitles = screen.getAllByText(/Yam/i);
    expect(brandTitles.length).toBeGreaterThan(0);
    expect(screen.getByText(/Yet another Markdown for macOS/i)).toBeInTheDocument();
  });

  it('contains a download button for the macOS DMG', () => {
    render(<LandingPage />);
    // There are multiple download links, we check the main CTA
    const downloadBtns = screen.getAllByRole('link', { name: /Download/i });
    expect(downloadBtns.length).toBeGreaterThan(0);
  });

  it('renders the demo window with correct theme root id and left alignment', () => {
    render(<LandingPage />);
    const root = document.getElementById('demo-window-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('text-left');
  });

  it('has a download button that is not full-width on larger screens', () => {
    render(<LandingPage />);
    const downloadBtn = screen.getByRole('link', { name: /Download for macOS/i });
    // We used sm:w-auto for better responsiveness
    expect(downloadBtn).toHaveClass('sm:w-auto');
  });

  it('renders the navigation with correct layout classes', () => {
    render(<LandingPage />);
    // The inner container of the nav has the flex classes
    const navContent = screen.getByRole('navigation').firstChild;
    expect(navContent).toHaveClass('flex');
    expect(navContent).toHaveClass('justify-between');
    expect(navContent).toHaveClass('items-center');
  });

  it('renders the prominent hero icon with expected styling', () => {
    const { container } = render(<LandingPage />);
    const heroIcon = screen.getByAltText(/Yam App Icon/i);
    expect(heroIcon).toBeInTheDocument();
    // Check for the container with the prominent shadow
    const styledContainer = container.querySelector('.shadow-2xl');
    expect(styledContainer).toBeInTheDocument();
  });

  it('contains fixed-size icon containers in the feature grid', () => {
    const { container } = render(<LandingPage />);
    // Check for the presence of the specific dimension classes we used for icons
    const iconContainers = container.querySelectorAll('.w-14.h-14');
    expect(iconContainers.length).toBe(3); // Visual Themes, System Fonts, Local & Private
  });
});
