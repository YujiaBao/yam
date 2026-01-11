import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from './SettingsModal';
import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_THEMES } from '../../constants/themes';
import { DEFAULT_FONTS } from '../../constants/fonts';

describe('SettingsModal', () => {
  const defaultProps = {
    onClose: vi.fn(),
    cssThemes: DEFAULT_THEMES,
    activeThemeId: 'default',
    activeCss: '',
    setActiveThemeId: vi.fn(),
    onCssChange: vi.fn(),
    onCreateTheme: vi.fn(),
    onDuplicateTheme: vi.fn(),
    onRenameTheme: vi.fn(),
    onDeleteTheme: vi.fn(),
    onImportCss: vi.fn(),
    isDefaultTheme: true,
    fonts: DEFAULT_FONTS,
    activeFontId: 'sans',
    setActiveFontId: vi.fn(),
    onCreateFont: vi.fn(),
    onDeleteFont: vi.fn(),
    getSystemFonts: vi.fn().mockResolvedValue([
      { family: 'System Font 1', name: 'System Font 1' },
    ]),
    launchViewMode: 'split' as const,
    setLaunchViewMode: vi.fn(),
    fileOpenViewMode: 'preview' as const,
    setFileOpenViewMode: vi.fn(),
    customDefaultContent: null,
    setCustomDefaultContent: vi.fn(),
  };

  it('renders themes list', () => {
    render(<SettingsModal {...defaultProps} />);
    // Use getAllByText because 'Default' appears in the list and the editor header
    expect(screen.getAllByText('Default').length).toBeGreaterThan(0);
    expect(screen.getByText('Solarized Light')).toBeInTheDocument();
  });

  it('can switch to fonts tab and shows font list', async () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Fonts'));
    // Specifically look for font names in the list (spans)
    const fontItems = screen.getAllByText('Sans Serif');
    expect(fontItems.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Serif').length).toBeGreaterThan(0);
  });

  it('shows system fonts when clicking plus button in fonts tab', async () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Fonts'));
    
    const plusButton = screen.getByTitle('Add Font');
    fireEvent.click(plusButton);
    
    const systemFonts = await screen.findAllByText('System Font 1');
    expect(systemFonts.length).toBeGreaterThan(0);
  });

  it('allows deleting default fonts if multiple fonts exist', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Fonts'));
    
    // Default fonts are Sans Serif, Serif, Monospace in DEFAULT_FONTS
    // We expect trash icons to be present for them now
    const trashButtons = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-trash2'));
    expect(trashButtons.length).toBeGreaterThan(0);
  });

  it('has a scrollable container for system fonts', async () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Fonts'));
    fireEvent.click(screen.getByTitle('Add Font'));
    
    // The container should have overflow-y-auto
    const systemFonts = await screen.findAllByText('System Font 1');
    const systemFontContainer = systemFonts[0].closest('.overflow-y-auto');
    expect(systemFontContainer).toHaveClass('overflow-y-auto');
  });

  it('shows read-only badge for default themes', () => {
    render(<SettingsModal {...defaultProps} />);
    expect(screen.getByText(/READ ONLY/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    // The X button is the only button with lucide-x
    const closeButton = screen.getAllByRole('button')[2]; // Themes, Fonts, X
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

    it('toggles help panel', () => {

      render(<SettingsModal {...defaultProps} />);

      const helpButton = screen.getByTitle(/CSS Reference/i);

      fireEvent.click(helpButton);

      expect(screen.getByText(/CSS Reference/i)).toBeInTheDocument();

    });

  });

  