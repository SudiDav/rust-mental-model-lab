import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { applyTheme, normalizeThemeMode, prefersDarkMode, resolveTheme, THEME_STORAGE_KEY, type ResolvedTheme, type ThemeMode } from './theme';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    return normalizeThemeMode(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof document !== 'undefined' && document.documentElement.dataset.themeMode) return normalizeThemeMode(document.documentElement.dataset.themeMode);
    return getStoredMode();
  });
  const [prefersDark, setPrefersDark] = useState(prefersDarkMode);
  const resolvedTheme = resolveTheme(mode, prefersDark);
  const setMode = useCallback((nextMode: ThemeMode) => setModeState(normalizeThemeMode(nextMode)), []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches);
    mediaQuery.addEventListener?.('change', onChange);
    return () => mediaQuery.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    applyTheme(mode, resolvedTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Theme changes still apply when storage is unavailable.
    }
  }, [mode, resolvedTheme]);

  const value = useMemo(() => ({ mode, resolvedTheme, setMode }), [mode, resolvedTheme, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
