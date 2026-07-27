/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: {
          DEFAULT: '#1E4FA3',
          50: '#F0F5FF',
          100: '#D9E5FD',
          200: '#B3CBFA',
          300: '#8CADF7',
          400: '#5283F0',
          500: '#1E4FA3',
          600: '#163E85',
          700: '#102E66',
          800: '#0B1F47',
          900: '#061029',
        },
        brandTeal: {
          DEFAULT: '#2FAF9B',
          50: '#F2FCFA',
          100: '#D7F7F2',
          200: '#AFEEE5',
          300: '#7CE2D5',
          400: '#46CBBA',
          500: '#2FAF9B',
          600: '#238F7E',
          700: '#1C6F63',
          800: '#145047',
          900: '#0D332D',
        },
        navy: {
          DEFAULT: '#1E4FA3',
          50: '#F0F5FF',
          100: '#D9E5FD',
          500: '#1E4FA3',
          600: '#163E85',
          700: '#102E66',
          800: '#0B1F47',
          900: '#061029',
          950: '#030816',
        },
        emerald: {
          DEFAULT: '#2FAF9B',
          50: '#F2FCFA',
          100: '#D7F7F2',
          500: '#2FAF9B',
          600: '#238F7E',
          700: '#1C6F63',
          800: '#145047',
          900: '#0D332D',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        roboto: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

