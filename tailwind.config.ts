import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
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
        benin: {
          vert:   "#008751",
          jaune:  "#FCD116",
          rouge:  "#E8112D",
          terre:  "#C4622D",
          ocre:   "#D4A853",
          indigo: "#2C3E8C",
        },
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
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        'badge-pop': {
          '0%':   { transform: 'scale(0.4)', opacity: '0' },
          '70%':  { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'toast-progress': {
          '0%':   { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'drawer-in': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'sticky-bar-in': {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'cursor-ring': {
          '0%':   { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translate(-50%, -50%) scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        'slide-up':         'slide-up 0.35s ease-out forwards',
        'slide-in-right':   'slide-in-right 0.35s ease-out forwards',
        'slide-in-left':    'slide-in-left 0.35s ease-out forwards',
        'slide-down':       'slide-down 0.25s ease-out forwards',
        'skeleton-shimmer': 'skeleton-shimmer 1.6s ease-in-out infinite',
        'badge-pop':        'badge-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'toast-progress':   'toast-progress 3.5s linear forwards',
        'fade-in':          'fade-in 0.2s ease-out forwards',
        'scale-in':         'scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'drawer-in':        'drawer-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'sticky-bar-in':    'sticky-bar-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
