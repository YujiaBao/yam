import { useState, useEffect } from 'react';
import type { Theme } from '../types';
import { DEFAULT_THEMES } from '../constants/themes';

/**
 * Custom hook for managing application CSS themes.
 * Handles persistence to localStorage and separates default presets from user-created themes.
 * 
 * @returns An object containing theme state and management functions
 */
export const useThemes = () => {
  // Store only user-created themes in localStorage
  const [userThemes, setUserThemes] = useState<Theme[]>(() => {
    const saved = localStorage.getItem('yam_user_themes');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('yam_active_theme_id') || 'default';
  });

  // Combine defaults and user themes
  const allThemes = [...DEFAULT_THEMES, ...userThemes];

  // Current active theme object
  const activeTheme = allThemes.find(t => t.id === activeThemeId) || DEFAULT_THEMES[0];
  const activeCss = activeTheme.css;

  // Persist user themes
  useEffect(() => {
    localStorage.setItem('yam_user_themes', JSON.stringify(userThemes));
  }, [userThemes]);

  useEffect(() => {
    localStorage.setItem('yam_active_theme_id', activeThemeId);
  }, [activeThemeId]);

  const handleCssChange = (newCss: string) => {
    // Only allow editing if it's a user theme
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
      css: activeCss // Start with current CSS
    };

    setUserThemes([...userThemes, newTheme]);
    setActiveThemeId(newTheme.id);
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
          css: text
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
    activeCss,
    setActiveThemeId,
    handleCssChange,
    handleCreateTheme,
    handleDeleteTheme,
    handleImportCss,
    isDefaultTheme: DEFAULT_THEMES.some(t => t.id === activeThemeId)
  };
};