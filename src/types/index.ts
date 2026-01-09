export interface Theme {
  id: string;
  name: string;
  css: string;
  isDark?: boolean;
}

export type ViewMode = 'split' | 'edit' | 'preview';

export type FontWeight = 'light' | 'normal' | 'bold';

export interface FontOption {
  id: string;
  name: string;
  family: string;
  weights: FontWeight[];
}

export interface VisualSettings {
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  codeColor: string;
  fontSize: string;
  lineHeight: string;
  paragraphMargin: string;
  headingMarginTop: string;
  headingMarginBottom: string;
  blockPadding: string;
  maxWidth: string;
}
