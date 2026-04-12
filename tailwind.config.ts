import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          50:  "#fdf2ee",
          100: "#fae0d4",
          200: "#f5bfa8",
          300: "#ee9470",
          400: "#e86a3a",
          500: "#e85d26",  // primary accent — combustion orange
          600: "#c44a18",
          700: "#9e3a12",
          800: "#7d2f10",
          900: "#4a1c09",
        },
        ink: {
          50:  "#f5f5f4",
          100: "#e7e5e4",
          200: "#d6d3d1",
          300: "#a8a29e",
          400: "#78716c",
          500: "#57534e",
          600: "#44403c",
          700: "#292524",
          800: "#1c1917",
          900: "#0c0a09",
          950: "#080604",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in":   "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        "shimmer":    "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
