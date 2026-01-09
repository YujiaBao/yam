import { render, screen } from '@testing-library/react';
import { Preview } from './Preview';
import { describe, it, expect } from 'vitest';

describe('Preview', () => {
  it('renders markdown as HTML', () => {
    render(<Preview markdown="# Heading" viewMode="preview" isDark={false} themeId="default" />);
    expect(screen.getByRole('heading', { name: /Heading/i })).toBeInTheDocument();
  });

  it('renders HTML content', () => {
    render(<Preview markdown='<div data-testid="html-content">HTML</div>' viewMode="preview" isDark={false} themeId="default" />);
    expect(screen.getByTestId('html-content')).toBeInTheDocument();
  });

  it('is hidden when viewMode is edit', () => {
    const { container } = render(<Preview markdown="" viewMode="edit" isDark={false} themeId="default" />);
    expect(container.firstChild).toHaveClass('hidden');
  });
});
