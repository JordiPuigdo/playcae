/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // 🎨 Brand Colors (PlayCAE)
        brandPrimary: "#2A4365", // Deep Blue (Trust, Headers, Nav)
        brandSecondary: "#DD6B20", // Burnt Orange (CTA, Alerts)
        brandAccent: "#EDF2F7", // Light Gray (Backgrounds)
        brandNeutralLight: "#EDF2F7", // Same as brandAccent
        brandNeutralDark: "#4A5568", // Slate Gray (Body Text/UI)

        // ✅ Status Colors (Consistent with root variables)
        securityRed: "#E53E3E", // Soft Red (Errors)
        securityGreen: "#38B2AC", // Muted Teal (Success)

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        pending: "hsl(var(--pending))",

        // UI Design Tokens from CSS variables
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
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
        popover: {
          DEFAULT: "hsl(var(--popover, 0 0% 100%))", // Fallback to white
          foreground: "hsl(var(--popover-foreground, 221 13% 35%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%))",
          foreground: "hsl(var(--card-foreground, 221 13% 35%))",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"], // Moderna y legible
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)", // Sombras suaves para tarjetas
      },
      borderRadius: {
        DEFAULT: "0.375rem", // 6px bordes suaves, moderno y amigable
      },
    },
  },
  plugins: [],
};
