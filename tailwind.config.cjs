/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Just in time compiler
  purge: ['./src/**/*.svelte'], // Removes unnecessary css not in final product
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
    fontFamily: {
      heading: ['Righteous', 'sans-serif'],
      body: ['Roland', 'sans-serif']
    }
  },
  plugins: []
};