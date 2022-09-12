/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  important: false,
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#FFD333",
        "secondary-color": "#",
        "text-color": "#",
        "background-color": "#",
        "border-color": "",
      },
      screens: {
        mobile: { max: "739px" },
        // => @media (max-width: 739px) { ... }

        tablet: { min: "740px", max: "1023px" },
        // => @media (min-width: 740px and max-width: 1023px) { ... }

        pc: { min: "1024px" },
        // => @media (min-width: 1024px) { ... }
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animations: {},
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    // ...
  ],
};
