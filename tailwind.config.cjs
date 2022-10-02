/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Just in time compiler
  purge: ['./src/**/*.svelte'], // Removes unnecessary css not in final product
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: []
};