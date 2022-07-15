module.exports = {
  purge: ['./src/**/*.svelte', './src/**/*.css'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      heading: ['Space Mono', 'sans-serif']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "synthwave"
  },
};
