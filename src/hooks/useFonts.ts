import { useState, useEffect } from 'react';
import type { FontOption, FontWeight } from '../types';
import { DEFAULT_FONTS } from '../constants/fonts';

export const useFonts = () => {
  const [fonts, setFonts] = useState<FontOption[]>(() => {
    const saved = localStorage.getItem('yam_fonts_config');
    return saved ? JSON.parse(saved) : DEFAULT_FONTS;
  });

  const [activeFontId, setActiveFontId] = useState<string>(() => {
    return localStorage.getItem('yam_active_font_id') || 'sans';
  });

  const [activeWeight, setActiveWeight] = useState<FontWeight>(() => {
    return (localStorage.getItem('yam_active_weight') as FontWeight) || 'normal';
  });

  const activeFont = fonts.find(f => f.id === activeFontId) || fonts[0] || DEFAULT_FONTS[0];

  // Ensure active weight is supported by active font
  useEffect(() => {
    if (activeFont && !activeFont.weights.includes(activeWeight)) {
      setActiveWeight(activeFont.weights[0] || 'normal');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFontId, activeFont]); // activeWeight omitted to prevent loop

  useEffect(() => {
    localStorage.setItem('yam_fonts_config', JSON.stringify(fonts));
  }, [fonts]);

  useEffect(() => {
    localStorage.setItem('yam_active_font_id', activeFontId);
  }, [activeFontId]);

  useEffect(() => {
    localStorage.setItem('yam_active_weight', activeWeight);
  }, [activeWeight]);

  const getSystemFonts = async (): Promise<{ family: string; name: string }[]> => {
    try {
      if ('queryLocalFonts' in window) {
        // @ts-expect-error - QueryLocalFonts API is not yet in standard types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const availableFonts: any[] = await window.queryLocalFonts();
        // De-duplicate families and sort
        const families = Array.from(new Set(availableFonts.map((f) => f.family as string))).sort() as string[];
        return families.map(f => ({ family: f, name: f }));
      }
    } catch (err) {
      console.error('Failed to query local fonts:', err);
    }
    
    // Fallback list of common system fonts if API not available
    const fallbacks: { family: string; name: string }[] = [
      { family: 'Inter', name: 'Inter' },
      { family: 'Roboto', name: 'Roboto' },
      { family: 'Open Sans', name: 'Open Sans' },
      { family: 'Lato', name: 'Lato' },
      { family: 'Montserrat', name: 'Montserrat' },
      { family: 'Fira Code', name: 'Fira Code' },
      { family: 'JetBrains Mono', name: 'JetBrains Mono' },
      { family: 'SF Pro Display', name: 'SF Pro Display' },
      { family: 'System UI', name: 'System UI' },
    ];
    return fallbacks;
  };

  const handleCreateFont = (name: string, family: string, weights: FontWeight[]) => {
    const newFont: FontOption = {
      id: `user-font-${Date.now()}`,
      name,
      family,
      weights
    };
    setFonts([...fonts, newFont]);
    setActiveFontId(newFont.id);
  };

  const handleDeleteFont = (id: string) => {
    if (fonts.length <= 1) return; // Prevent deleting the last font

    const newFonts = fonts.filter(f => f.id !== id);
    setFonts(newFonts);
    
    if (activeFontId === id) {
      setActiveFontId(newFonts[0].id);
    }
  };

  const cycleFont = () => {
    const currentIndex = fonts.findIndex(f => f.id === activeFontId);
    const nextIndex = (currentIndex + 1) % fonts.length;
    setActiveFontId(fonts[nextIndex].id);
  };

  const cycleWeight = () => {
    if (!activeFont) return;
    const weights = activeFont.weights;
    if (weights.length === 0) return;
    const currentIndex = weights.indexOf(activeWeight);
    const nextIndex = (currentIndex + 1) % weights.length;
    setActiveWeight(weights[nextIndex]);
  };

  return {
    fonts,
    activeFont,
    activeFontId,
    activeWeight,
    setActiveFontId,
    setActiveWeight,
    getSystemFonts,
    handleCreateFont,
    handleDeleteFont,
    cycleFont,
    cycleWeight,
    isDefaultFont: DEFAULT_FONTS.some(f => f.id === activeFontId)
  };
};
