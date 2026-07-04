/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#DC2626",
          hover: "#EF4444",
          active: "#B91C1C",
        },
        accent: {
          DEFAULT: "#06B6D4",
          hover: "#22D3EE",
          active: "#0891B2",
        },
        dark: {
          950: "var(--color-bg)",
          900: "var(--color-bg-secondary)",
          800: "var(--color-border)",
          700: "var(--color-border-light)",
          400: "var(--color-text-secondary)",
          100: "var(--color-text)",
        },

        light: {
          50: "#FFFFFF",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "var(--color-text-muted)",
          800: "#27272A",
          900: "#18181B",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "pulse-dot": "pulse-dot 2s infinite",
        "scroll-bounce": "scroll-bounce 2s infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)" },
          "50%": { boxShadow: "0 0 0 6px rgba(34, 197, 94, 0)" },
        },
      },
    },
  },
  plugins: [],
};
