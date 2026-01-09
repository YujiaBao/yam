import { describe, it, expect } from 'vitest';
import { parseCss, generateCss } from './cssMapper';
import type { VisualSettings } from '../types';

describe('cssMapper', () => {
  const mockSettings: VisualSettings = {
    backgroundColor: '#123456',
    textColor: '#abcdef',
    headingColor: '#fedcba',
    linkColor: '#654321',
    codeColor: '#00ff00',
    fontSize: '20px',
    lineHeight: '1.8',
    paragraphMargin: '20px',
    headingMarginTop: '30px',
    headingMarginBottom: '10px',
    blockPadding: '20px',
    maxWidth: '1000px',
  };

  it('generates and parses CSS consistently', () => {
    const css = generateCss(mockSettings);
    const parsed = parseCss(css);
    
    expect(parsed.backgroundColor.toLowerCase()).toBe(mockSettings.backgroundColor.toLowerCase());
    expect(parsed.textColor.toLowerCase()).toBe(mockSettings.textColor.toLowerCase());
    expect(parsed.headingColor.toLowerCase()).toBe(mockSettings.headingColor.toLowerCase());
    expect(parsed.linkColor.toLowerCase()).toBe(mockSettings.linkColor.toLowerCase());
    expect(parsed.codeColor.toLowerCase()).toBe(mockSettings.codeColor.toLowerCase());
    expect(parsed.fontSize).toBe(mockSettings.fontSize);
    expect(parsed.lineHeight).toBe(mockSettings.lineHeight);
    expect(parsed.paragraphMargin).toBe(mockSettings.paragraphMargin);
    expect(parsed.headingMarginTop).toBe(mockSettings.headingMarginTop);
    expect(parsed.headingMarginBottom).toBe(mockSettings.headingMarginBottom);
    expect(parsed.blockPadding).toBe(mockSettings.blockPadding);
    expect(parsed.maxWidth).toBe(mockSettings.maxWidth);
  });

  it('handles default theme CSS (empty or minimal)', () => {
    const settings = parseCss('');
    expect(settings.fontSize).toBe('16px');
    expect(settings.backgroundColor).toBe('#ffffff');
  });

  it('parses complex existing themes', () => {
    const solarizedDarkCss = `
      :root {
        --solarized-bg: #002b36;
        --solarized-fg: #839496;
        --solarized-hl: #268bd2;
      }
      body { background-color: var(--solarized-bg) !important; }
      .markdown-body { 
        color: var(--solarized-fg) !important;
        --color-canvas-default: var(--solarized-bg) !important;
        --color-fg-default: var(--solarized-fg) !important;
      }
      .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: var(--solarized-hl) !important; }
      .markdown-body a { color: #2aa198 !important; }
      .markdown-body code { color: #859900 !important; }
    `;
    
    const settings = parseCss(solarizedDarkCss);
    // Since we don't resolve var() yet, we expect fallbacks or the literal 'var(...)'
    // Actually, my current parseCss tries to skip var()
    expect(settings.linkColor.toLowerCase()).toBe('#2aa198');
    expect(settings.codeColor.toLowerCase()).toBe('#859900');
  });

  it('debugs font-size parsing', () => {
    const css = '.markdown-body { font-size: 20px !important; }';
    const settings = parseCss(css);
    expect(settings.fontSize).toBe('20px');
  });
});
