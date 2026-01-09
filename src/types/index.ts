export interface Theme {
  id: string;
  name: string;
  css: string;
}

export type ViewMode = 'split' | 'edit' | 'preview';
export type FontType = 'sans' | 'serif' | 'mono';
export type FontWeight = 'light' | 'normal' | 'bold';
