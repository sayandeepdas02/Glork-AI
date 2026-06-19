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
        /* Brand — used sparingly for links / focus only */
        brand: {
          DEFAULT: "#1C80F2",
          light:   "#EBF4FE",
          pale:    "#F4F9FF",
          mid:     "#4B94F5",
          dark:    "#1568CC",
          dim:     "rgba(28,128,242,0.08)",
          border:  "rgba(28,128,242,0.20)",
        },

        /* Monochrome scale — the main palette */
        ink: {
          DEFAULT: "#111111",
          2:       "#1A1A1A",
          3:       "#333333",
          4:       "#6B7280",
          5:       "#9CA3AF",
          6:       "#D1D5DB",
        },

        /* Surfaces */
        "off-white": "#FAFAFA",
        surface: {
          DEFAULT: "#F5F5F5",
          2:       "#EBEBEB",
        },

        /* shadcn tokens */
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        /* serif kept for auth hero only */
        serif: ["var(--font-sans)", "Inter", "sans-serif"],
      },

      fontWeight: {
        light:    "300",
        normal:   "400",
        medium:   "500",
        semibold: "600",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to:   { transform: "translateX(100%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.4" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 0.4s ease-out both",
        "fade-in":        "fade-in 0.25s ease-out both",
        shimmer:          "shimmer 2s linear infinite",
        "pulse-dot":      "pulse-dot 2s ease-in-out infinite",
      },

      boxShadow: {
        card:     "0 1px 2px rgba(0,0,0,0.05)",
        "card-md":"0 2px 8px rgba(0,0,0,0.06)",
        "card-lg":"0 8px 24px rgba(0,0,0,0.07)",
      },

      spacing: {
        sidebar: "240px",
        topbar:  "56px",
      },

      letterSpacing: {
        tighter:  "-0.03em",
        tight:    "-0.02em",
        snug:     "-0.01em",
        normal:   "0",
        wide:     "0.02em",
        wider:    "0.06em",
        widest:   "0.12em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
