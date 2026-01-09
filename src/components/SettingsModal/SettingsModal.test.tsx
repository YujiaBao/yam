import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from './SettingsModal';
import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_THEMES } from '../../constants/themes';

describe('SettingsModal', () => {
  const defaultProps = {
    onClose: vi.fn(),
    cssThemes: DEFAULT_THEMES,
    activeThemeId: 'default',
    activeCss: '',
    setActiveThemeId: vi.fn(),
    onCssChange: vi.fn(),
    onCreateTheme: vi.fn(),
    onDeleteTheme: vi.fn(),
    onImportCss: vi.fn(),
    isDefaultTheme: true,
  };

  it('renders themes list', () => {
    render(<SettingsModal {...defaultProps} />);
    // Use getAllByText because 'Default' appears in the list and the editor header
    expect(screen.getAllByText('Default').length).toBeGreaterThan(0);
    expect(screen.getByText('Solarized Light')).toBeInTheDocument();
  });

  it('shows read-only badge for default themes', () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByText(/READ ONLY/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter custom CSS/i)).toHaveAttribute('readonly');
  });

  it('calls onClose when close button is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    // The X button is the second button in the header
    const buttons = screen.getAllByRole('button');
    // First is help, second is close
    fireEvent.click(buttons[1]);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('toggles help panel', () => {
    render(<SettingsModal {...defaultProps} />);
    const helpButton = screen.getByTitle(/CSS Reference/i);
    fireEvent.click(helpButton);
    expect(screen.getByText(/CSS Reference/i)).toBeInTheDocument();
  });
});