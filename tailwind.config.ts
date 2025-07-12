/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        brandPrimary: '#1D4ED8', // Azul profesional, confianza
        brandSecondary: '#9333EA', // Morado, sofisticación
        brandAccent: '#F59E0B', // Amarillo para highlights
        brandNeutralLight: '#F3F4F6', // Gris claro para fondos suaves
        brandNeutralDark: '#374151', // Gris oscuro para texto y UI
        securityRed: '#DC2626', // Rojo para alertas / errores (seguridad)
        securityGreen: '#16A34A', // Verde para confirmaciones
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        pending: 'hsl(var(--pending))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Moderna y legible
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)', // Sombras suaves para tarjetas
      },
      borderRadius: {
        DEFAULT: '0.375rem', // 6px bordes suaves, moderno y amigable
      },
    },
  },
  plugins: [],
};
