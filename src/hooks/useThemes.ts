import { useState, useEffect } from 'react';
import type { Theme } from '../types';
import { DEFAULT_THEMES } from '../constants/themes';

/**
 * Custom hook for managing application CSS themes.
 */
export const useThemes = () => {
  const [userThemes, setUserThemes] = useState<Theme[]>(() => {
    const saved = localStorage.getItem('yam_user_themes');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('yam_active_theme_id') || 'default';
  });

  const allThemes = [...DEFAULT_THEMES, ...userThemes];
  const activeTheme = allThemes.find(t => t.id === activeThemeId) || DEFAULT_THEMES[0];
  const activeCss = activeTheme.css;

  useEffect(() => {
    localStorage.setItem('yam_user_themes', JSON.stringify(userThemes));
  }, [userThemes]);

  useEffect(() => {
    localStorage.setItem('yam_active_theme_id', activeThemeId);
  }, [activeThemeId]);

  const handleCssChange = (newCss: string) => {
    if (userThemes.some(t => t.id === activeThemeId)) {
      setUserThemes(themes => themes.map(t =>
        t.id === activeThemeId ? { ...t, css: newCss } : t
      ));
    }
  };

  const handleCreateTheme = () => {
    const name = prompt('Enter name for new theme:', 'My Custom Theme');
    if (!name) return;

    const newTheme: Theme = {
      id: `user-${Date.now()}`,
      name,
      css: activeCss,
      isDark: activeTheme.isDark
    };

    setUserThemes([...userThemes, newTheme]);
    setActiveThemeId(newTheme.id);
  };

  const handleDuplicateTheme = (id: string) => {
    const themeToDuplicate = allThemes.find(t => t.id === id);
    if (!themeToDuplicate) return;

    const newTheme: Theme = {
      id: `user-${Date.now()}`,
      name: `${themeToDuplicate.name} (Copy)`,
      css: themeToDuplicate.css,
      isDark: themeToDuplicate.isDark
    };

    setUserThemes([...userThemes, newTheme]);
    setActiveThemeId(newTheme.id);
  };

  const handleRenameTheme = (id: string, newName: string) => {
    setUserThemes(themes => themes.map(t =>
      t.id === id ? { ...t, name: newName } : t
    ));
  };

  const handleDeleteTheme = () => {
    if (confirm('Are you sure you want to delete this theme?')) {
      const newThemes = userThemes.filter(t => t.id !== activeThemeId);
      setUserThemes(newThemes);
      setActiveThemeId('default');
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
          id: `user-${Date.now()}`,
          name,
          css: text,
          isDark: text.includes('dark') || text.includes('background-color: #0') || text.includes('background-color: #1')
        };
        setUserThemes([...userThemes, newTheme]);
        setActiveThemeId(newTheme.id);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return {
    cssThemes: allThemes,
    activeThemeId,
    activeTheme,
    activeCss,
    setActiveThemeId,
    handleCssChange,
    handleCreateTheme,
    handleDuplicateTheme,
    handleRenameTheme,
    handleDeleteTheme,
    handleImportCss,
    isDefaultTheme: DEFAULT_THEMES.some(t => t.id === activeThemeId)
  };
};
