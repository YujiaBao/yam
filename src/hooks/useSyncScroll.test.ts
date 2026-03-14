import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSyncScroll } from './useSyncScroll';

describe('useSyncScroll hook', () => {
  let editorElem: HTMLDivElement;
  let previewElem: HTMLDivElement;

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });

    editorElem = document.createElement('div');
    previewElem = document.createElement('div');

    // Mock dimensions
    Object.defineProperty(editorElem, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(editorElem, 'clientHeight', { value: 500, configurable: true });
    Object.defineProperty(previewElem, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(previewElem, 'clientHeight', { value: 500, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('scrolls the preview when the editor is scrolled', () => {
    renderHook(() => {
      const editorRef = { current: editorElem };
      const previewRef = { current: previewElem };
      useSyncScroll(editorRef, previewRef, true);
      return { editorRef, previewRef };
    });

    // Simulate editor scroll to 50%
    // (1000 - 500) * 0.5 = 250
    editorElem.scrollTop = 250;
    
    act(() => {
      editorElem.dispatchEvent(new Event('scroll'));
    });

    // Preview should be at 50%
    // (2000 - 500) * 0.5 = 750
    expect(previewElem.scrollTop).toBe(750);
  });

  it('does not sync when disabled (e.g. not in split mode)', () => {
    renderHook(() => {
      const editorRef = { current: editorElem };
      const previewRef = { current: previewElem };
      useSyncScroll(editorRef, previewRef, false);
    });

    editorElem.scrollTop = 250;
    act(() => {
      editorElem.dispatchEvent(new Event('scroll'));
    });

    expect(previewElem.scrollTop).toBe(0);
  });
});