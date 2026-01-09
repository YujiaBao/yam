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
      .prose { color: #657b83; }
      .prose h1, .prose h2, .prose h3, .prose h4 { color: #b58900; }
      .prose a { color: #268bd2; }
      .prose code { color: #d33682; }
      body { background-color: #fdf6e3; }
    `
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    css: `
      body { background-color: #0d1117; color: #c9d1d9; }
      .prose { color: #c9d1d9; }
      .prose h1, .prose h2 { border-bottom: 1px solid #21262d; padding-bottom: .3em; }
      .prose a { color: #58a6ff; }
      .prose pre { background-color: #161b22; }
    `
  },
  {
    id: 'dracula',
    name: 'Dracula',
    css: `
      body { background-color: #282a36; color: #f8f8f2; }
      .prose { color: #f8f8f2; }
      .prose h1, .prose h2, .prose h3, .prose h4 { color: #bd93f9; }
      .prose a { color: #8be9fd; }
      .prose code { color: #ff79c6; }
      .prose pre { background-color: #44475a; }
      .prose blockquote { border-left-color: #bd93f9; color: #f1fa8c; }
    `
  },
  {
    id: 'nord',
    name: 'Nord',
    css: `
      body { background-color: #2e3440; color: #d8dee9; }
      .prose { color: #d8dee9; }
      .prose h1, .prose h2, .prose h3 { color: #88c0d0; }
      .prose a { color: #81a1c1; }
      .prose code { color: #ebcb8b; }
      .prose pre { background-color: #3b4252; }
    `
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    css: `
      body { background-color: #193549; color: #ffffff; }
      .prose { color: #ffffff; }
      .prose h1, .prose h2 { color: #ffc600; }
      .prose a { color: #0088ff; }
      .prose pre { background-color: #0050a4; }
    `
  }
];
