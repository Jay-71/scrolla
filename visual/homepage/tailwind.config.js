/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#e8e9e7',    // Lightest
          100: '#d7d9d6',   // User provided
          200: '#c2c4c0',   // User provided
          300: '#a6a8a3',   // User provided
          400: '#8b8e85',   // User provided
          500: '#707570',   // User provided
          600: '#575c56',   // User provided
          700: '#3b3f3b',   // User provided
          800: '#262b2a',   // User provided
          900: '#121515',   // User provided
          950: '#0a0c0b',   // User provided
        }
      },
      backgroundImage: {
        'grid-pattern': "url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M0 0h40v40H0V0zm1 1h38v38H1V1z\\' fill=\\'%239a9c97\\' fill-opacity=\\'0.06\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')",
        'dots-pattern': "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%239a9c97\\' fill-opacity=\\'0.12\\'/%3E%3C/svg%3E')",
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
