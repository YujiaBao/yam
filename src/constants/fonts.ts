import type { FontOption } from '../types';

export const DEFAULT_FONTS: FontOption[] = [
  {
    id: 'sans',
    name: 'Sans Serif',
    family: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    weights: ['light', 'normal', 'bold']
  },
  {
    id: 'serif',
    name: 'Serif',
    family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    weights: ['normal', 'bold']
  },
  {
    id: 'mono',
    name: 'Monospace',
    family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    weights: ['normal']
  }
];
