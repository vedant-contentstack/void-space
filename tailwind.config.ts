import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          black: "#0a0a0a",
          dark: "#111111",
          darker: "#1a1a1a",
          gray: "#1f1f1f",
          light: "#2a2a2a",
          lighter: "#3a3a3a",
          accent: "#6366f1",
          "accent-light": "#818cf8",
          text: "#f8fafc",
          muted: "#94a3b8",
          "muted-dark": "#64748b",
          border: "#1e293b",
          "border-light": "#334155",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Consolas",
          "Monaco",
          "Courier New",
          "monospace",
        ],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in": "slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "spin-reverse": "spin 6s linear infinite reverse",
        "fall-into-hole": "fallIntoHole 3s ease-in infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        fallIntoHole: {
          "0%": {
            transform: "translateY(-100vh) scale(1)",
            opacity: "1",
          },
          "70%": {
            transform: "translateY(40vh) scale(0.8)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translateY(50vh) scale(0)",
            opacity: "0",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
