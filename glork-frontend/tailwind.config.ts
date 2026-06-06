import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT:  "#FF6B00",
          light:    "#FF8C3A",
          dark:     "#CC5500",
          dim:      "rgba(255,107,0,0.07)",
          border:   "rgba(255,107,0,0.18)",
        },
        surface: {
          base:    "#FFFFFF",
          DEFAULT: "#FAFAF8",
          2:       "#F3F3EF",
        },
        border:        "hsl(var(--border))",
        input:         "hsl(var(--input))",
        ring:          "hsl(var(--ring))",
        background:    "hsl(var(--background))",
        foreground:    "hsl(var(--foreground))",
        primary: {
          DEFAULT:     "hsl(var(--primary))",
          foreground:  "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:     "hsl(var(--secondary))",
          foreground:  "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:     "hsl(var(--destructive))",
          foreground:  "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:     "hsl(var(--muted))",
          foreground:  "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:     "hsl(var(--accent))",
          foreground:  "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:     "hsl(var(--popover))",
          foreground:  "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:     "hsl(var(--card))",
          foreground:  "hsl(var(--card-foreground))",
        },
      },

      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Georgia",
          "ui-serif",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },

      boxShadow: {
        "glow-sm":   "0 0 20px rgba(255,107,0,0.12)",
        "glow":      "0 0 40px rgba(255,107,0,0.18)",
        "glow-lg":   "0 0 60px rgba(255,107,0,0.25)",
        "card":      "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover":"0 8px 24px rgba(0,0,0,0.09)",
        "panel":     "0 4px 32px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
