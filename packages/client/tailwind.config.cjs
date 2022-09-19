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
        'homepage-dark': "url('/public/bg-dark1.jpg')",
        'homepage-light': "url('/public/bg-light1.jpg')",
      },
    },
  },
};
