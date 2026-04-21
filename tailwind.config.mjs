/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: 'rgb(var(--color-dark-rgb) / <alpha-value>)',
        light: 'rgb(var(--color-light-rgb) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
