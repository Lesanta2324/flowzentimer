import { useState, useEffect, useCallback } from 'react';

export type ColorTheme = 'ocean' | 'sunset' | 'forest' | 'lavender' | 'rose' | 'amber';

interface ThemeColors {
  label: string;
  preview: string; // for the swatch
  light: {
    primary: string;
    secondary: string;
    accent: string;
    ring: string;
    timerRing: string;
    timerRingBreak: string;
  };
  dark: {
    primary: string;
    secondary: string;
    accent: string;
    ring: string;
    timerRing: string;
    timerRingBreak: string;
  };
}

export const COLOR_THEMES: Record<ColorTheme, ThemeColors> = {
  ocean: {
    label: 'Ocean',
    preview: '#3B82F6',
    light: {
      primary: '210 70% 52%',
      secondary: '152 45% 48%',
      accent: '152 45% 48%',
      ring: '210 70% 52%',
      timerRing: '210 70% 52%',
      timerRingBreak: '152 45% 48%',
    },
    dark: {
      primary: '210 70% 58%',
      secondary: '152 45% 42%',
      accent: '152 45% 42%',
      ring: '210 70% 58%',
      timerRing: '210 70% 58%',
      timerRingBreak: '152 45% 42%',
    },
  },
  sunset: {
    label: 'Sunset',
    preview: '#F97316',
    light: {
      primary: '25 95% 53%',
      secondary: '340 75% 55%',
      accent: '340 75% 55%',
      ring: '25 95% 53%',
      timerRing: '25 95% 53%',
      timerRingBreak: '340 75% 55%',
    },
    dark: {
      primary: '25 95% 58%',
      secondary: '340 75% 50%',
      accent: '340 75% 50%',
      ring: '25 95% 58%',
      timerRing: '25 95% 58%',
      timerRingBreak: '340 75% 50%',
    },
  },
  forest: {
    label: 'Forest',
    preview: '#22C55E',
    light: {
      primary: '142 60% 45%',
      secondary: '170 55% 40%',
      accent: '170 55% 40%',
      ring: '142 60% 45%',
      timerRing: '142 60% 45%',
      timerRingBreak: '170 55% 40%',
    },
    dark: {
      primary: '142 60% 50%',
      secondary: '170 55% 45%',
      accent: '170 55% 45%',
      ring: '142 60% 50%',
      timerRing: '142 60% 50%',
      timerRingBreak: '170 55% 45%',
    },
  },
  lavender: {
    label: 'Lavender',
    preview: '#A855F7',
    light: {
      primary: '270 70% 60%',
      secondary: '290 50% 50%',
      accent: '290 50% 50%',
      ring: '270 70% 60%',
      timerRing: '270 70% 60%',
      timerRingBreak: '290 50% 50%',
    },
    dark: {
      primary: '270 70% 65%',
      secondary: '290 50% 55%',
      accent: '290 50% 55%',
      ring: '270 70% 65%',
      timerRing: '270 70% 65%',
      timerRingBreak: '290 50% 55%',
    },
  },
  rose: {
    label: 'Rose',
    preview: '#F43F5E',
    light: {
      primary: '348 83% 55%',
      secondary: '330 60% 50%',
      accent: '330 60% 50%',
      ring: '348 83% 55%',
      timerRing: '348 83% 55%',
      timerRingBreak: '330 60% 50%',
    },
    dark: {
      primary: '348 83% 60%',
      secondary: '330 60% 55%',
      accent: '330 60% 55%',
      ring: '348 83% 60%',
      timerRing: '348 83% 60%',
      timerRingBreak: '330 60% 55%',
    },
  },
  amber: {
    label: 'Amber',
    preview: '#F59E0B',
    light: {
      primary: '38 92% 50%',
      secondary: '28 80% 52%',
      accent: '28 80% 52%',
      ring: '38 92% 50%',
      timerRing: '38 92% 50%',
      timerRingBreak: '28 80% 52%',
    },
    dark: {
      primary: '38 92% 55%',
      secondary: '28 80% 57%',
      accent: '28 80% 57%',
      ring: '38 92% 55%',
      timerRing: '38 92% 55%',
      timerRingBreak: '28 80% 57%',
    },
  },
};

export function useColorTheme() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('mindful-color-theme') as ColorTheme) || 'ocean';
    }
    return 'ocean';
  });

  const applyTheme = useCallback((theme: ColorTheme) => {
    const isDark = document.documentElement.classList.contains('dark');
    const colors = COLOR_THEMES[theme][isDark ? 'dark' : 'light'];
    const root = document.documentElement.style;

    root.setProperty('--primary', colors.primary);
    root.setProperty('--secondary', colors.secondary);
    root.setProperty('--accent', colors.accent);
    root.setProperty('--ring', colors.ring);
    root.setProperty('--timer-ring', colors.timerRing);
    root.setProperty('--timer-ring-break', colors.timerRingBreak);
  }, []);

  useEffect(() => {
    applyTheme(colorTheme);
    localStorage.setItem('mindful-color-theme', colorTheme);
  }, [colorTheme, applyTheme]);

  // Re-apply when dark mode toggles
  useEffect(() => {
    const observer = new MutationObserver(() => {
      applyTheme(colorTheme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [colorTheme, applyTheme]);

  return { colorTheme, setColorTheme };
}
