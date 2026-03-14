import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { describe, it, expect, vi } from 'vitest';

describe('Toolbar', () => {
  const defaultProps = {
    font: 'Sans Serif',
    cycleFont: vi.fn(),
    fontWeight: 'normal' as const,
    cycleWeight: vi.fn(),
    viewMode: 'split' as const,
    setViewMode: vi.fn(),
    setShowSettings: vi.fn(),
    onHide: vi.fn(),
  };

  it('renders view mode buttons', () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByTitle('Editor')).toBeInTheDocument();
    expect(screen.getByTitle('Split')).toBeInTheDocument();
    expect(screen.getByTitle('Preview')).toBeInTheDocument();
  });

  it('highlights active view mode', () => {
    render(<Toolbar {...defaultProps} viewMode="edit" />);
    const editBtn = screen.getByTitle('Editor');
    expect(editBtn.className).toContain('bg-white');
  });

  it('calls setViewMode when view button is clicked', () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Preview'));
    expect(defaultProps.setViewMode).toHaveBeenCalledWith('preview');
  });

  it('calls cycleFont when font button is clicked', () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Font: Sans Serif'));
    expect(defaultProps.cycleFont).toHaveBeenCalled();
  });

  it('calls cycleWeight when weight button is clicked', () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Weight: normal'));
    expect(defaultProps.cycleWeight).toHaveBeenCalled();
  });

  it('calls setShowSettings when settings button is clicked', () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Settings'));
    expect(defaultProps.setShowSettings).toHaveBeenCalledWith(true);
  });

  it('calls onHide when hide button is clicked', () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByTitle(/Hide toolbar/));
    expect(defaultProps.onHide).toHaveBeenCalled();
  });
});
