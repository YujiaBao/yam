import { renderHook, act } from '@testing-library/react';
import { useFonts } from './useFonts';
import { DEFAULT_FONTS } from '../constants/fonts';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useFonts hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('queryLocalFonts', vi.fn().mockResolvedValue([
      { family: 'System Font 1', fullName: 'System Font 1 Regular' },
      { family: 'System Font 2', fullName: 'System Font 2 Bold' },
    ]));
  });

  it('initializes with default fonts if no saved fonts exist', () => {
    const { result } = renderHook(() => useFonts());
    expect(result.current.fonts).toEqual(expect.arrayContaining(DEFAULT_FONTS));
    expect(result.current.activeFontId).toBe('sans');
  });

  it('allows adding a font from system discovery', async () => {
    const { result } = renderHook(() => useFonts());
    
    let available: any[] = [];
    await act(async () => {
      available = await result.current.getSystemFonts();
    });
    
    expect(available.length).toBeGreaterThan(0);
    
    act(() => {
      result.current.handleCreateFont(available[0].family, available[0].family, ['normal']);
    });
    
    expect(result.current.fonts.some(f => f.family === 'System Font 1')).toBe(true);
  });

  it('allows deleting any font, including defaults', () => {
    const { result } = renderHook(() => useFonts());
    const initialCount = result.current.fonts.length;
    
    act(() => {
      result.current.handleDeleteFont(result.current.fonts[0].id);
    });
    
    expect(result.current.fonts.length).toBe(initialCount - 1);
  });

  it('prevents deleting the last font', () => {
    const { result } = renderHook(() => useFonts());
    
    // Manually delete until 1 remains
    while (result.current.fonts.length > 1) {
      const id = result.current.fonts[0].id;
      act(() => {
        result.current.handleDeleteFont(id);
      });
    }
    
    expect(result.current.fonts.length).toBe(1);
    const lastId = result.current.fonts[0].id;
    
    act(() => {
      result.current.handleDeleteFont(lastId);
    });
    
    expect(result.current.fonts.length).toBe(1);
    expect(result.current.fonts[0].id).toBe(lastId);
  });

  it('persists changes to localStorage', () => {
    const { result, unmount } = renderHook(() => useFonts());
    
    act(() => {
      result.current.handleCreateFont('Persistent Font', 'Arial', ['normal']);
    });
    
    unmount();
    
    const { result: newResult } = renderHook(() => useFonts());
    expect(newResult.current.fonts.some(f => f.name === 'Persistent Font')).toBe(true);
  });
});
