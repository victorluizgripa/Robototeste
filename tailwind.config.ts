import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        bg: "#faf9fb",
        surface: {
          DEFAULT: "#ffffff",
          2: "#f8f7fa",
        },
        txt: {
          DEFAULT: "#1e1b2e",
          2: "#4a4560",
          3: "#8a849c",
          "on-accent": "#ffffff",
        },
        border: {
          DEFAULT: "#e8e5f0",
          hover: "#d4d0e0",
        },
        success: {
          bg: "#ecfdf5",
          text: "#065f46",
          border: "#a7f3d0",
        },
        warning: {
          bg: "#fffbeb",
          text: "#92400e",
          border: "#fde68a",
        },
        error: {
          bg: "#fef2f2",
          text: "#991b1b",
          border: "#fecaca",
        },
      },
      borderRadius: {
        "2xl": "16px",
        xl: "12px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(30, 27, 46, 0.06), 0 1px 2px -1px rgba(30, 27, 46, 0.06)",
        "card-hover": "0 4px 12px 0 rgba(30, 27, 46, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
