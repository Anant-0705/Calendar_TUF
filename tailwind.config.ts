import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sora)", "sans-serif"],
        note: ["var(--font-caveat)", "cursive"],
        marker: ["var(--font-marker)", "cursive"]
      },
      boxShadow: {
        polaroid: "0 8px 24px rgba(0, 0, 0, 0.18)",
        card: "0 16px 45px rgba(20, 20, 20, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
