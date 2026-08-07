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
        void: "#17151B",
        panel: "#201D26",
        "panel-2": "#2A2632",
        ink: "#F1ECE6",
        "ink-muted": "#9C96A8",
        "ink-dim": "#645E70",
        line: "#322E3B",
        tingle: "#E98368",
        hush: "#8C93E8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;