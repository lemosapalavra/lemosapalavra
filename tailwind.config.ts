import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body: ["'Nunito'", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "lemos-navy": "hsl(var(--lemos-navy))",
        "lemos-sky": "hsl(var(--lemos-sky))",
        "lemos-yellow": "hsl(var(--lemos-yellow))",
        "lemos-red": "hsl(var(--lemos-red))",
        "lemos-blue": "hsl(var(--lemos-blue))",
        "lemos-green": "hsl(var(--lemos-green))",
        "lemos-purple": "hsl(var(--lemos-purple))",
        "lemos-orange": "hsl(var(--lemos-orange))",
        "lemos-pink": "hsl(var(--lemos-pink))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "page-flip-next": {
          "0%": { transform: "perspective(1600px) rotateY(0deg)", transformOrigin: "left center" },
          "100%": { transform: "perspective(1600px) rotateY(-170deg)", transformOrigin: "left center" },
        },
        "page-flip-prev": {
          "0%": { transform: "perspective(1600px) rotateY(170deg)", transformOrigin: "right center" },
          "100%": { transform: "perspective(1600px) rotateY(0deg)", transformOrigin: "right center" },
        },
        "tear-left": {
          "0%": { transform: "translate(0,0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translate(-120%, 30%) rotate(-25deg)", opacity: "0" },
        },
        "tear-right": {
          "0%": { transform: "translate(0,0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translate(120%, 30%) rotate(25deg)", opacity: "0" },
        },
        "shake-tear": {
          "0%,100%": { transform: "translateX(0) rotate(0)" },
          "20%": { transform: "translateX(-6px) rotate(-2deg)" },
          "40%": { transform: "translateX(6px) rotate(2deg)" },
          "60%": { transform: "translateX(-4px) rotate(-1deg)" },
          "80%": { transform: "translateX(4px) rotate(1deg)" },
        },
        "shadow-pulse": {
          "0%,100%": { filter: "drop-shadow(0 8px 14px rgba(0,0,0,.45))", transform: "scale(1)" },
          "50%": { filter: "drop-shadow(0 14px 22px rgba(0,0,0,.65))", transform: "scale(1.06)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "page-flip-next": "page-flip-next 0.7s ease-in-out forwards",
        "page-flip-prev": "page-flip-prev 0.7s ease-in-out forwards",
        "tear-left": "tear-left 0.7s ease-in forwards",
        "tear-right": "tear-right 0.7s ease-in forwards",
        "shake-tear": "shake-tear 0.5s ease-in-out",
        "shadow-pulse": "shadow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
