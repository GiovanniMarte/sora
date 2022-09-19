/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
  theme: {
    extend: {
      backgroundImage: {
        'homepage-dark': "url('/bg-dark1.jpg')",
        'homepage-light': "url('/bg-light1.jpg')",
      },
    },
  },
};
