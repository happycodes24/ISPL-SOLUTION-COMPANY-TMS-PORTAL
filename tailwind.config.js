/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        iav: {
          red: "#D82B25",
          crimson: "#BF1E26",
          ink: "#1A1A1D",
          charcoal: "#393939",
        },
        surface: {
          light: "#FFFFFF",
          muted: "#F6F7F9",
          dark: "#16181D",
          night: "#0E0F12",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(17, 18, 22, 0.12)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px rgba(216,43,37,0.15), 0 10px 30px -8px rgba(216,43,37,0.35)",
      },
      backgroundImage: {
        "iav-grad": "linear-gradient(135deg, #D82B25 0%, #BF1E26 100%)",
        "iav-grad-soft": "linear-gradient(135deg, rgba(216,43,37,0.12) 0%, rgba(191,30,38,0.06) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "chevron-pulse": {
          "0%, 100%": { opacity: "0.35", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-4px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease forwards",
        shimmer: "shimmer 1.6s infinite",
        "chevron-pulse": "chevron-pulse 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
