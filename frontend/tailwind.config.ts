import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        panel: "rgba(15, 23, 42, 0.72)",
        stroke: "rgba(148, 163, 184, 0.22)",
      },
      boxShadow: {
        glow: "0 20px 80px rgba(20, 184, 166, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;

