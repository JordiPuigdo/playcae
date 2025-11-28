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
        // ---- Tokens base ligados a CSS variables (shadcn / diseño global) ----
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        pending: "hsl(var(--pending))",

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
          DEFAULT: "hsl(var(--popover, 0 0% 100%))", // fallback blanco
          foreground: "hsl(var(--popover-foreground, 221 13% 35%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%))",
          foreground: "hsl(var(--card-foreground, 221 13% 35%))",
        },

        // ---- Paleta oficial PlayCAE (PDF) ----
        // Colores directos por si los quieres usar en utilidades: text-play-blue, bg-play-orange, etc.
        playBlueDark: "#153454", // Azul corporativo principal
        playBlueLight: "#517B95", // Azul de apoyo
        playOrange: "#EF7932", // Acciones / CTA
        playGreen: "#3FA66B", // Validaciones correctas
        playYellow: "#F4C542", // Avisos / precauciones
        playGrey: "#F2F4F5", // Fondos neutros

        // ---- Tokens de marca semánticos (recomendado usar estos en la app) ----
        brand: {
          primary: "#153454", // Headers, navegación, títulos
          secondary: "#EF7932", // CTA principales, botones destacados
          accent: "#517B95", // Elementos de apoyo / chips / tags
          success: "#3FA66B", // Estados "correcto / aprobado"
          warning: "#F4C542", // Avisos de precaución
          neutral: "#F2F4F5", // Fondos de secciones, tarjetas claras
        },

        // Si quieres mantener tokens antiguos por compatibilidad:
        brandPrimary: "#153454",
        brandSecondary: "#EF7932",
        brandAccent: "#517B95",
        brandNeutralLight: "#F2F4F5",
        // Puedes elegir un gris más oscuro del sistema para texto secundario
        brandNeutralDark: "#4A5568",

        // Colores de estado adicionales (errores, etc.)
        securityRed: "#E53E3E", // No viene del manual, pero lo dejamos para errores
        securityGreen: "#3FA66B", // Igualado al verde oficial
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
    },
  },
  plugins: [],
};
