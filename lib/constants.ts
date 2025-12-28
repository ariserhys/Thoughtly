// Design tokens
export const Colors = {
  light: {
    bgPrimary: "#FFFFFF",
    bgSecondary: "#F9FAFB",
    textPrimary: "#111827",
    textMuted: "#6B7280",
    accent: "#6366F1",
    accentLight: "#818CF8",
    border: "#E5E7EB",
  },
  dark: {
    bgPrimary: "#0A0A0A",
    bgSecondary: "#171717",
    textPrimary: "#F9FAFB",
    textMuted: "#9CA3AF",
    accent: "#818CF8",
    accentLight: "#A5B4FC",
    border: "#262626",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  squircle: 24, // iOS-style large radius
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};
