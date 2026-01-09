import type { Theme } from '../types';

export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    css: ''
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    css: `
      :root {
        --solarized-bg: #fdf6e3;
        --solarized-fg: #657b83;
        --solarized-hl: #b58900;
      }
      body { background-color: var(--solarized-bg) !important; }
      .markdown-body { 
        color: var(--solarized-fg) !important;
        --color-canvas-default: var(--solarized-bg) !important;
        --color-fg-default: var(--solarized-fg) !important;
      }
      .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: var(--solarized-hl) !important; }
      .markdown-body a { color: #268bd2 !important; }
      .markdown-body code { color: #d33682 !important; }
    `
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    css: `
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
    `
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    css: `
      body { background-color: #0d1117 !important; }
      .markdown-body { 
        color: #c9d1d9 !important;
        --color-canvas-default: #0d1117 !important;
        --color-fg-default: #c9d1d9 !important;
      }
      .markdown-body h1, .markdown-body h2 { border-bottom: 1px solid #21262d !important; }
      .markdown-body a { color: #58a6ff !important; }
    `
  },
  {
    id: 'dracula',
    name: 'Dracula',
    css: `
      body { background-color: #282a36 !important; }
      .markdown-body { 
        color: #f8f8f2 !important;
        --color-canvas-default: #282a36 !important;
        --color-fg-default: #f8f8f2 !important;
      }
      .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: #bd93f9 !important; }
      .markdown-body a { color: #8be9fd !important; }
      .markdown-body code { color: #ff79c6 !important; }
      .markdown-body blockquote { border-left-color: #bd93f9 !important; color: #f1fa8c !important; }
    `
  },
  {
    id: 'nord',
    name: 'Nord',
    css: `
      body { background-color: #2e3440 !important; }
      .markdown-body { 
        color: #d8dee9 !important;
        --color-canvas-default: #2e3440 !important;
        --color-fg-default: #d8dee9 !important;
      }
      .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: #88c0d0 !important; }
      .markdown-body a { color: #81a1c1 !important; }
      .markdown-body code { color: #ebcb8b !important; }
    `
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    css: `
      body { background-color: #193549 !important; }
      .markdown-body { 
        color: #ffffff !important;
        --color-canvas-default: #193549 !important;
        --color-fg-default: #ffffff !important;
      }
      .markdown-body h1, .markdown-body h2 { color: #ffc600 !important; }
      .markdown-body a { color: #0088ff !important; }
    `
  }
];
