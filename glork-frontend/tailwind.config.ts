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
          DEFAULT: "#1C80F2",
          light: "#5AA5FF",
          dark: "#1568CC",
          dim: "rgba(28,128,242,0.10)",
          border: "rgba(28,128,242,0.20)",
        },
        ink: {
          DEFAULT: "#0F172A",
          2: "#1E293B",
          3: "#334155",
          4: "#526077",
          5: "#7E8BA0",
          6: "#C1CFDF",
        },
        surface: {
          base: "#F6F8FC",
          DEFAULT: "#EEF3FB",
          2: "#E3EBF6",
          dark: "#0C1829",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      fontFamily: {
        sans: [
          "var(--font-sans)",
          "DM Sans",
          "Avenir Next",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Instrument Serif",
          "Iowan Old Style",
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
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      boxShadow: {
        "glow-sm": "0 0 20px rgba(28,128,242,0.14)",
        glow: "0 0 44px rgba(28,128,242,0.18)",
        "glow-lg": "0 0 70px rgba(28,128,242,0.22)",
        card: "0 10px 30px rgba(15,23,42,0.06)",
        "card-hover": "0 24px 70px rgba(15,23,42,0.1)",
        panel: "0 30px 90px rgba(12,24,41,0.12)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
