const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        yummies: {
          blue: '#003b91',
          darkblue: '#17469e',
          yellow: '#ffc20e',
          red: '#ed1c24',
        },
        country: {
          costarica: {
            light: colors.emerald[100],
            DEFAULT: colors.emerald[500],
            dark: colors.emerald[800],
          },
          dominicana: {
            light: colors.slate[100],
            DEFAULT: colors.slate[500],
            dark: colors.slate[800],
          },
          guatemala: {
            light: colors.amber[100],
            DEFAULT: colors.amber[900],
            dark: colors.amber[950],
          },
          elsalvador: {
            light: colors.rose[100],
            DEFAULT: colors.rose[500],
            dark: colors.rose[800],
          },
          nicaragua: {
            light: colors.yellow[100],
            DEFAULT: colors.yellow[500],
            dark: colors.yellow[800],
          },
          honduras: {
            light: colors.sky[100],
            DEFAULT: colors.sky[500],
            dark: colors.sky[800],
          },
        },
      },
      backgroundColor: {
        primary: '#003b91',
        secondary: '#17469e',
        accent: '#ffc20e',
      },
      borderColor: {
        primary: '#003b91',
        secondary: '#17469e',
        accent: '#ffc20e',
      },
      textColor: {
        primary: '#003b91',
        secondary: '#17469e',
        accent: '#ffc20e',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  safelist: [
    // Clases para Costa Rica
    'bg-emerald-100',
    'text-emerald-800',
    // Clases para República Dominicana
    'bg-slate-100',
    'text-slate-800',
    // Clases para Guatemala
    'bg-amber-900',
    'text-amber-400',
    // Clases para El Salvador
    'bg-rose-100',
    'text-rose-800',
    // Clases para Nicaragua
    'bg-yellow-100',
    'text-yellow-800',
    // Clases para Honduras
    'bg-sky-100',
    'text-sky-800',
  ],
};