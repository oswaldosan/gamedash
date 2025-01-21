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
        }
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
};