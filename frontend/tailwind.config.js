/** @type {import('tailwindcss').Config} */

module.exports = {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    extend: {

      /* ✅ ADD THIS BLOCK (VERY IMPORTANT) */
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        popover: "rgb(var(--popover) / <alpha-value>)",
        "popover-foreground": "rgb(var(--popover-foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--secondary-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-foreground": "rgb(var(--accent-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",

        sidebar: {
          background: "rgb(var(--sidebar-background) / <alpha-value>)",
          foreground: "rgb(var(--sidebar-foreground) / <alpha-value>)",
          primary: "rgb(var(--sidebar-primary) / <alpha-value>)",
          accent: "rgb(var(--sidebar-accent) / <alpha-value>)",
          border: "rgba(var(--sidebar-border))",
        },

        dashboard: {
          bg: "rgb(var(--dashboard-bg) / <alpha-value>)",
          card: "rgb(var(--card) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
        }
      },

      /* Fonts */
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },

      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
        soft: "0 4px 20px rgba(0,0,0,0.05)",
        hover: "0 10px 30px rgba(0,0,0,0.08)",
      },

      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },

      animation: {
        fade: "fadeIn 0.4s ease-in-out",
        slide: "slideUp 0.4s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        slideUp: {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },

    },
  },

  plugins: [],
};