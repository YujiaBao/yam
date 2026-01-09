import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { describe, it, expect, vi } from 'vitest';

describe('Sidebar', () => {
  const defaultProps = {
    onFileUpload: vi.fn(),
    onExportPdf: vi.fn(),
    isExporting: false,
    font: 'Sans Serif',
    cycleFont: vi.fn(),
    fontWeight: 'normal' as const,
    cycleWeight: vi.fn(),
    viewMode: 'split' as const,
    setViewMode: vi.fn(),
    showSettings: false,
    setShowSettings: vi.fn(),
    onToggleSidebar: vi.fn(),
  };

  it('renders all main buttons', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText(/Open File/i)).toBeInTheDocument();
    expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Font/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
  });

  it('calls onToggleSidebar when collapse button is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByTitle(/Collapse Sidebar/i));
    expect(defaultProps.onToggleSidebar).toHaveBeenCalled();
  });

  it('calls cycleFont when font toggle is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByText(/Change Font/i));
    expect(defaultProps.cycleFont).toHaveBeenCalled();
  });

  it('shows exporting state', () => {
    render(<Sidebar {...defaultProps} isExporting={true} />);
    expect(screen.getByText(/Exporting.../i)).toBeInTheDocument();
  });
});