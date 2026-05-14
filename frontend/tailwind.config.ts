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
        background: "#0a0a0f",
        foreground: "#ffffff",
        accent: {
          DEFAULT: "#6300ff",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#00f5a0",
          foreground: "#0a0a0f",
        },
        card: {
          DEFAULT: "#12121a",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "sans-serif"],
        english: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
