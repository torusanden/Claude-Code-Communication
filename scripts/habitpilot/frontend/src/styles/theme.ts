// HabitPilot Theme System
// カラーパレットとデザイントークンの定義

export const colors = {
  // Primary Colors - 成長と達成を表現
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // メインカラー
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Success Colors - 達成感を演出
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // 成功・完了
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Neutral Colors - ベース色
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Warning & Error
  warning: {
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    500: '#ef4444',
    600: '#dc2626',
  },
};

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  default: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
};

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// Dark mode theme
export const darkTheme = {
  colors: {
    background: colors.gray[900],
    foreground: colors.gray[50],
    card: colors.gray[800],
    cardForeground: colors.gray[50],
    primary: colors.primary[400],
    primaryForeground: colors.gray[900],
    secondary: colors.gray[700],
    secondaryForeground: colors.gray[50],
    muted: colors.gray[700],
    mutedForeground: colors.gray[300],
    accent: colors.primary[500],
    accentForeground: colors.gray[50],
    destructive: colors.error[500],
    destructiveForeground: colors.gray[50],
    border: colors.gray[700],
    input: colors.gray[700],
    ring: colors.primary[500],
  },
};

// Light mode theme
export const lightTheme = {
  colors: {
    background: colors.gray[50],
    foreground: colors.gray[900],
    card: 'white',
    cardForeground: colors.gray[900],
    primary: colors.primary[500],
    primaryForeground: 'white',
    secondary: colors.gray[100],
    secondaryForeground: colors.gray[900],
    muted: colors.gray[100],
    mutedForeground: colors.gray[600],
    accent: colors.primary[100],
    accentForeground: colors.primary[900],
    destructive: colors.error[500],
    destructiveForeground: 'white',
    border: colors.gray[200],
    input: colors.gray[200],
    ring: colors.primary[500],
  },
};

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index scale
export const zIndex = {
  dropdown: 50,
  sticky: 100,
  fixed: 200,
  modalBackdrop: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  transitions,
  typography,
  darkTheme,
  lightTheme,
  breakpoints,
  zIndex,
};