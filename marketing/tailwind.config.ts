import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", "class"],
  theme: {
    extend: {
      colors: {
        primary: "#177981",
        "primary-dark": "#115b61",
        "primary-font": "#0b3c40",
        font: "#000",
        secondary: "#fdbb2d",
        foreground: "#041617",
        light: "#FAFAFA",
        border: "#e5e7eb",
      },
      fontSize: {
        xs: "12px",
      },
      fontFamily: {
        // mono: ["var(--font-mono), ui-monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-left": {
          from: {
            transform: "translateX(24px)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0px)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-left": "slide-left 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
