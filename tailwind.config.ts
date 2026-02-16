import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        ogg: ["Ogg", "serif"], 
        basecoat: ["Basecoat-Light", "sans-serif"],
      },
      colors: {
    beige: "#F5F1E8",
  },
    },
  },
  plugins: [],
} satisfies Config;
