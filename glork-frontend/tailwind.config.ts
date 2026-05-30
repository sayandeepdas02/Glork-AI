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
        /* ── Brand ── */
        brand: {
          DEFAULT:  "#FF6B00",
          light:    "#FF8533",
          dark:     "#CC5500",
          dim:      "rgba(255,107,0,0.12)",
          border:   "rgba(255,107,0,0.25)",
          glow:     "rgba(255,107,0,0.20)",
        },
        /* ── Surface ── */
        surface: {
          base:    "#0C0A09",
          DEFAULT: "#141210",
          2:       "#1C1916",
        },
        /* ── Shadcn-compat ── */
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
        sans:  ["var(--font-inter)",      "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia",   "serif"],
        mono:  ["var(--font-inter)",      "Menlo",     "monospace"],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand":   "linear-gradient(135deg, #FF5500 0%, #FF9966 100%)",
        "gradient-brand-v": "linear-gradient(180deg, #FF5500 0%, #CC3300 100%)",
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
      },

      backgroundSize: { grid: "32px 32px" },

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
        /* Brand glows */
        "glow-sm":   "0 0 20px rgba(255,85,0,0.20)",
        "glow":      "0 0 40px rgba(255,85,0,0.25)",
        "glow-lg":   "0 0 80px rgba(255,85,0,0.35)",
        /* Dark surface shadows */
        "card":      "0 1px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.20)",
        "card-hover":"0 8px 32px rgba(0,0,0,0.40)",
        "dark-card": "0 4px 24px rgba(0,0,0,0.50)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
