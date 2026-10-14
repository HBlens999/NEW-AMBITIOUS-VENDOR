import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEME_PRESETS, ThemeColors, ThemePreset } from '../types/theme';

interface ThemeContextType {
  activePresetId: string;
  colors: ThemeColors;
  isDark: boolean;
  setPreset: (presetId: string) => void;
  updateCustomColor: (key: keyof ThemeColors, value: string) => void;
  resetToPreset: (presetId?: string) => void;
  presets: ThemePreset[];
}

const STORAGE_KEY_PRESET = 'ambitious_theme_preset';
const STORAGE_KEY_COLORS = 'ambitious_theme_colors';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PRESET) || 'blush-luxury';
  });

  const [colors, setColors] = useState<ThemeColors>(() => {
    const savedColors = localStorage.getItem(STORAGE_KEY_COLORS);
    if (savedColors) {
      try {
        return JSON.parse(savedColors);
      } catch {
        // Fallback to preset
      }
    }
    const preset = THEME_PRESETS.find(p => p.id === activePresetId) || THEME_PRESETS[0];
    return preset.colors;
  });

  // Apply colors to CSS custom variables on root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-main', colors.bgMain);
    root.style.setProperty('--surface-card', colors.surfaceCard);
    root.style.setProperty('--surface-soft', colors.surfaceSoft);
    root.style.setProperty('--surface-hover', colors.surfaceHover);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--color-primary', colors.colorPrimary);
    root.style.setProperty('--color-secondary', colors.colorSecondary);
    root.style.setProperty('--color-border', colors.colorBorder);
    root.style.setProperty('--color-highlight', colors.colorHighlight);
    root.style.setProperty('--hero-bg', colors.heroBg || '#0C0A0D');

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY_PRESET, activePresetId);
    localStorage.setItem(STORAGE_KEY_COLORS, JSON.stringify(colors));
  }, [colors, activePresetId]);

  const setPreset = (presetId: string) => {
    const targetPreset = THEME_PRESETS.find(p => p.id === presetId) || THEME_PRESETS[0];
    setActivePresetId(targetPreset.id);
    setColors(targetPreset.colors);
  };

  const updateCustomColor = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToPreset = (presetId?: string) => {
    const targetId = presetId || activePresetId;
    const targetPreset = THEME_PRESETS.find(p => p.id === targetId) || THEME_PRESETS[0];
    setActivePresetId(targetPreset.id);
    setColors(targetPreset.colors);
  };

  const currentPreset = THEME_PRESETS.find(p => p.id === activePresetId);
  const isDark = Boolean(currentPreset?.isDark);

  return (
    <ThemeContext.Provider
      value={{
        activePresetId,
        colors,
        isDark,
        setPreset,
        updateCustomColor,
        resetToPreset,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
