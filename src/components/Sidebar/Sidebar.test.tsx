import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { describe, it, expect, vi } from 'vitest';

describe('Sidebar', () => {
  const defaultProps = {
    onFileUpload: vi.fn(),
    onExportPdf: vi.fn(),
    isExporting: false,
    theme: 'light' as const,
    setTheme: vi.fn(),
    font: 'sans' as const,
    setFont: vi.fn(),
    fontWeight: 'normal' as const,
    setFontWeight: vi.fn(),
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
    expect(screen.getByText(/Dark Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Font/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
  });

  it('calls onToggleSidebar when collapse button is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByTitle(/Collapse Sidebar/i));
    expect(defaultProps.onToggleSidebar).toHaveBeenCalled();
  });

  it('calls setTheme when theme toggle is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    // The button doesn't have the text, but the span inside it does.
    // Clicking the span or the parent button should work.
    fireEvent.click(screen.getByText(/Dark Mode/i));
    expect(defaultProps.setTheme).toHaveBeenCalledWith('dark');
  });

  it('shows exporting state', () => {
    render(<Sidebar {...defaultProps} isExporting={true} />);
    expect(screen.getByText(/Exporting.../i)).toBeInTheDocument();
  });
});