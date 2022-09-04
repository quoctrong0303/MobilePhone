/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  important: true,
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary-color': "#FFD333",
        'secondary-color': "#",
        'text-color': "#",
        'background-color': "#",
        'border-color': '',
      },
      screens: {
        'mobile': {'max': '739px'},
        // => @media (max-width: 739px) { ... }
  
        'tablet': {'min': '740px', 'max': '1023px'},
        // => @media (min-width: 740px and max-width: 1023px) { ... }
  
        'pc': {'min': '1024px'},
        // => @media (min-width: 1024px) { ... }
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}