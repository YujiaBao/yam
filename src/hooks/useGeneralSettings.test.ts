import { renderHook, act } from '@testing-library/react';
import { useGeneralSettings } from './useGeneralSettings';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useGeneralSettings hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useGeneralSettings());
    // Defaults: launch -> split, fileOpen -> preview
    expect(result.current.launchViewMode).toBe('split');
    expect(result.current.fileOpenViewMode).toBe('preview');
    expect(result.current.customDefaultContent).toBeNull();
  });

  it('persists launchViewMode changes', () => {
    const { result } = renderHook(() => useGeneralSettings());
    
    act(() => {
      result.current.setLaunchViewMode('edit');
    });
    
    expect(result.current.launchViewMode).toBe('edit');
    expect(localStorage.getItem('yam_launch_view_mode')).toBe('edit');
  });

  it('persists fileOpenViewMode changes', () => {
    const { result } = renderHook(() => useGeneralSettings());
    
    act(() => {
      result.current.setFileOpenViewMode('split');
    });
    
    expect(result.current.fileOpenViewMode).toBe('split');
    expect(localStorage.getItem('yam_file_open_view_mode')).toBe('split');
  });

  it('persists customDefaultContent changes', () => {
    const { result } = renderHook(() => useGeneralSettings());
    
    act(() => {
      result.current.setCustomDefaultContent('# Hello');
    });
    
    expect(result.current.customDefaultContent).toBe('# Hello');
    expect(localStorage.getItem('yam_custom_default_content')).toBe('# Hello');
  });

  it('removes customDefaultContent from storage when set to null', () => {
    localStorage.setItem('yam_custom_default_content', 'temp');
    const { result } = renderHook(() => useGeneralSettings());
    
    expect(result.current.customDefaultContent).toBe('temp');

    act(() => {
      result.current.setCustomDefaultContent(null);
    });
    
    expect(result.current.customDefaultContent).toBeNull();
    expect(localStorage.getItem('yam_custom_default_content')).toBeNull();
  });
});
