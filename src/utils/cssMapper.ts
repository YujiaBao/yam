import type { VisualSettings } from '../types';

export const parseCss = (css: string): VisualSettings => {
  const settings: VisualSettings = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    headingColor: '#000000',
    linkColor: '#0366d6',
    codeColor: '#000000',
    fontSize: '16px',
    lineHeight: '1.6',
    paragraphMargin: '16px',
    headingMarginTop: '24px',
    headingMarginBottom: '16px',
    blockPadding: '16px',
    maxWidth: '800px',
  };

  if (!css) return settings;

  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');

  const getVariableValue = (name: string): string | null => {
    const lines = cleanCss.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(name.toLowerCase())) {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const val = parts[1].split(';')[0].split('!important')[0].trim();
          if (val) return val;
        }
      }
    }
    return null;
  };

  const getPropertyValue = (selectors: string[], property: string): string | null => {
    const rules = cleanCss.split('}');
    let foundValue: string | null = null;

    for (const rule of rules) {
      const parts = rule.split('{');
      if (parts.length < 2) continue;

      const selectorText = parts[0].trim().toLowerCase();
      const content = parts[1].trim();

      const ruleSelectors = selectorText.split(',').map(s => s.trim());
      const isMatch = selectors.some(s => ruleSelectors.includes(s.toLowerCase()));

      if (isMatch) {
        const lines = content.split(';');
        for (const line of lines) {
          const lineTrimmed = line.trim();
          if (lineTrimmed.toLowerCase().startsWith(property.toLowerCase() + ':')) {
            let value = lineTrimmed.split(':')[1].split('!important')[0].trim();
            
            // Resolve var()
            const varMatch = value.match(/var\((--[^)]+)\)/i);
            if (varMatch) {
              const resolved = getVariableValue(varMatch[1]);
              if (resolved) value = resolved;
            }
            
            if (value !== null && value !== '' && !value.startsWith('var(')) {
              foundValue = value;
            }
          }
        }
      }
    }
    return foundValue;
  };

  // Colors
  settings.backgroundColor = getPropertyValue(['body', '.app-container'], 'background-color') || 
                             getPropertyValue(['.markdown-body'], '--color-canvas-default') || 
                             settings.backgroundColor;
  
  settings.textColor = getPropertyValue(['.markdown-body'], 'color') || 
                       getPropertyValue(['.markdown-body'], '--color-fg-default') || 
                       settings.textColor;
  
  settings.headingColor = getPropertyValue(['.markdown-body h1', '.markdown-body h2', '.markdown-body h3'], 'color') || 
                          getPropertyValue(['.markdown-body h1'], 'color') ||
                          settings.headingColor;
  
  settings.linkColor = getPropertyValue(['.markdown-body a'], 'color') || settings.linkColor;
  
  settings.codeColor = getPropertyValue(['.markdown-body code'], 'color') || settings.codeColor;
  
  // Typography
  settings.fontSize = getPropertyValue(['.markdown-body'], 'font-size') || settings.fontSize;
  settings.lineHeight = getPropertyValue(['.markdown-body'], 'line-height') || settings.lineHeight;

  // Spacing
  settings.paragraphMargin = getPropertyValue(['.markdown-body p', '.markdown-body li'], 'margin-bottom') || 
                             getPropertyValue(['.markdown-body p'], 'margin-bottom') ||
                             settings.paragraphMargin;
  settings.headingMarginTop = getPropertyValue(['.markdown-body h1', '.markdown-body h2', '.markdown-body h3'], 'margin-top') || 
                              getPropertyValue(['.markdown-body h1'], 'margin-top') ||
                              settings.headingMarginTop;
  settings.headingMarginBottom = getPropertyValue(['.markdown-body h1', '.markdown-body h2', '.markdown-body h3'], 'margin-bottom') || 
                                 getPropertyValue(['.markdown-body h1'], 'margin-bottom') ||
                                 settings.headingMarginBottom;
  settings.blockPadding = getPropertyValue(['.markdown-body pre', '.markdown-body blockquote'], 'padding') || 
                          getPropertyValue(['.markdown-body pre'], 'padding') ||
                          settings.blockPadding;

  // Layout
  settings.maxWidth = getPropertyValue(['.markdown-body'], 'max-width') || settings.maxWidth;

  return settings;
};

export const generateCss = (settings: VisualSettings): string => {
  return `
body, .app-container { background-color: ${settings.backgroundColor} !important; }
.markdown-body { 
  color: ${settings.textColor} !important;
  --color-canvas-default: ${settings.backgroundColor} !important;
  --color-fg-default: ${settings.textColor} !important;
  font-size: ${settings.fontSize} !important;
  line-height: ${settings.lineHeight} !important;
  max-width: ${settings.maxWidth} !important;
}
.markdown-body p, .markdown-body li { margin-bottom: ${settings.paragraphMargin} !important; }
.markdown-body h1, .markdown-body h2, .markdown-body h3 { 
  color: ${settings.headingColor} !important; 
  margin-top: ${settings.headingMarginTop} !important;
  margin-bottom: ${settings.headingMarginBottom} !important;
}
.markdown-body a { color: ${settings.linkColor} !important; }
.markdown-body code { color: ${settings.codeColor} !important; }
.markdown-body pre, .markdown-body blockquote { padding: ${settings.blockPadding} !important; }
  `.trim();
};