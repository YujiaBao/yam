import { renderHook, act } from '@testing-library/react';
import { useThemes } from './useThemes';
import { DEFAULT_THEMES } from '../constants/themes';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useThemes hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default themes', () => {
    const { result } = renderHook(() => useThemes());
    expect(result.current.cssThemes).toEqual(expect.arrayContaining(DEFAULT_THEMES));
    expect(result.current.activeThemeId).toBe('dracula');
  });

  it('can change active theme', () => {
    const { result } = renderHook(() => useThemes());
    act(() => {
      result.current.setActiveThemeId('solarized-light');
    });
    expect(result.current.activeThemeId).toBe('solarized-light');
  });

  it('can create a new theme', () => {
    const { result } = renderHook(() => useThemes());
    const themeName = 'New Test Theme';
    
    // Mock prompt
    window.prompt = () => themeName;

    act(() => {
      result.current.handleCreateTheme();
    });

    const newTheme = result.current.cssThemes.find(t => t.name === themeName);
    expect(newTheme).toBeDefined();
    expect(result.current.activeThemeId).toBe(newTheme?.id);
  });

  it('can delete a user theme', () => {
    const { result } = renderHook(() => useThemes());
    window.prompt = () => 'Delete Me';
    window.confirm = () => true;

    act(() => {
      result.current.handleCreateTheme();
    });

    const themeIdToDelete = result.current.activeThemeId;
    
    act(() => {
      result.current.handleDeleteTheme();
    });

    expect(result.current.cssThemes.find(t => t.id === themeIdToDelete)).toBeUndefined();
    expect(result.current.activeThemeId).toBe('default');
  });

  it('identifies default themes correctly', () => {
    const { result } = renderHook(() => useThemes());
    expect(result.current.isDefaultTheme).toBe(true); // 'default' is a default theme

    act(() => {
      result.current.setActiveThemeId('solarized-light');
    });
    expect(result.current.isDefaultTheme).toBe(true);

    window.prompt = () => 'User Theme';
    act(() => {
      result.current.handleCreateTheme();
    });
    expect(result.current.isDefaultTheme).toBe(false);
  });
});
