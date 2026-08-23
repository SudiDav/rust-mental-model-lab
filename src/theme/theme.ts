export const THEME_STORAGE_KEY = 'rust-lab-theme';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

export function normalizeThemeMode(value: string | null | undefined): ThemeMode {
  return value === 'dark' || value === 'light' || value === 'system' ? value : 'system';
}

export function resolveTheme(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === 'system') return prefersDark ? 'dark' : 'light';
  return mode;
}

export function prefersDarkMode(): boolean {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(mode: ThemeMode, resolvedTheme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolvedTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'light' ? '#f8fafc' : '#080a0f');
}
