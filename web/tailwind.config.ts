import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#177981",
          foreground: "#FFF",
        },
        secondary: {
          DEFAULT: "#fdbb2d",
          foreground: "#000",
        },
        font: "#000000",
        light: "#FAFAFA",
        background: "hsl(var(--background))",
        "success-light": "#EFFCEE",
        danger: "#c43333",
        "danger-light": "#FCEEEE",
        foreground: "#000000",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "animate-enter": {
          "0%": {
            transform: "translateX(50%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "animate-enter": "animate-enter 150ms ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  darkMode: ["class", "class"],
  plugins: [
    // @ts-ignore
    heroui({
      defaultTheme: "light",
      layout: {
        radius: {
          small: "2px",
          medium: "6px",
          large: "12px",
        },
      },
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#177981",
              foreground: "#FFF",
              "50": "rgba(23, 121, 129, 0.1)",
            },
            secondary: "#fdbb2d",
            content1: "#FFF",
            content3: {
              DEFAULT: "#F0F0F0",
            },
            content4: {
              DEFAULT: "#e0e0e0",
            },
            default: {
              DEFAULT: "#F8F8F8",
              "100": "#FAFAFA",
              "200": "#F8F8F8",
            },
            success: {
              DEFAULT: "#32a852",
              foreground: "#FFF",
            },
            danger: {
              DEFAULT: "#f53636",
              foreground: "#FFF",
            },
          },
          layout: {
            hoverOpacity: 95,
          },
        },
      },
    }),
    require("tailwindcss-animate"),
  ],
};
export default config;
