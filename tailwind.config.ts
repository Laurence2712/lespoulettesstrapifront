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
        // Couleurs béninoises : drapeau + terres + teintures
        benin: {
          vert:   "#008751", // drapeau vert
          jaune:  "#FCD116", // drapeau jaune
          rouge:  "#E8112D", // drapeau rouge
          terre:  "#C4622D", // latérite / terre cuite
          ocre:   "#D4A853", // sable / ocre clair
          indigo: "#2C3E8C", // indigo teinture traditionnelle
        },
        // Couleurs wax : accents festifs et vibrants
        wax: {
          turquoise: "#1DB4B4",
          yellow:    "#F5C100",
          orange:    "#E8671A",
          red:       "#C8232C",
          green:     "#3DA34A",
        },
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.35s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.35s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
