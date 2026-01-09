import { useState, useEffect } from 'react';
import type { Theme } from '../types';
import { DEFAULT_THEMES } from '../constants/themes';

export const useThemes = () => {
  const [cssThemes, setCssThemes] = useState<Theme[]>(() => {
    const saved = localStorage.getItem('yam_css_themes');
    return saved ? JSON.parse(saved) : DEFAULT_THEMES;
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('yam_active_theme_id') || 'default';
  });

  // Current active CSS content
  const activeCss = cssThemes.find(t => t.id === activeThemeId)?.css || '';

  // Persist themes
  useEffect(() => {
    localStorage.setItem('yam_css_themes', JSON.stringify(cssThemes));
  }, [cssThemes]);

  useEffect(() => {
    localStorage.setItem('yam_active_theme_id', activeThemeId);
  }, [activeThemeId]);

  const handleCssChange = (newCss: string) => {
    setCssThemes(themes => themes.map(t =>
      t.id === activeThemeId ? { ...t, css: newCss } : t
    ));
  };

  const handleCreateTheme = () => {
    const name = prompt('Enter name for new theme:', 'My Custom Theme');
    if (!name) return;

    const newTheme: Theme = {
      id: Date.now().toString(),
      name,
      css: activeCss // Start with current CSS
    };

    setCssThemes([...cssThemes, newTheme]);
    setActiveThemeId(newTheme.id);
  };

  const handleDeleteTheme = () => {
    if (confirm('Are you sure you want to delete this theme?')) {
      const newThemes = cssThemes.filter(t => t.id !== activeThemeId);
      setCssThemes(newThemes);
      setActiveThemeId(newThemes[0]?.id || 'default');
    }
  };

  const handleImportCss = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const name = file.name.replace('.css', '');
        const newTheme: Theme = {
          id: Date.now().toString(),
          name,
          css: text
        };
        setCssThemes([...cssThemes, newTheme]);
        setActiveThemeId(newTheme.id);
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return {
    cssThemes,
    activeThemeId,
    activeCss,
    setActiveThemeId,
    handleCssChange,
    handleCreateTheme,
    handleDeleteTheme,
    handleImportCss
  };
};
