/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary backgrounds
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        // Accent
        accent: {
          DEFAULT: "#6366F1",
          light: "#818CF8",
        },
        // Text
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        sans: ["Inter_400Regular", "system-ui", "sans-serif"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
      },
      borderRadius: {
        squircle: "1.5rem", // 24px - iOS-style large radius
      },
    },
  },
  plugins: [],
};
