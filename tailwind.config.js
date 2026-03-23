/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toss: {
          blue: '#3182F6',
          gray: {
            50: '#F2F4F6',
            100: '#E5E8EB',
            200: '#D1D6DB',
            300: '#B0B8C1',
            400: '#8B95A1',
            500: '#6B7684',
            600: '#4E5968',
            700: '#333D4B',
            800: '#191F28',
            900: '#191F28',
          },
          red: '#F04452',
        }
      },
      borderRadius: {
        'toss': '16px',
        'toss-lg': '20px',
      }
    },
  },
  plugins: [],
}

