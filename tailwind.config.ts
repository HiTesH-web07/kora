import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5E6D9", blush: "#E9A4AE", burgundy: "#762E42", gold: "#D5B77B", cocoa: "#57372F",
        paper: "#FBF3EA", rosewater: "#F7D9DC",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
        hand: ["Caveat", "'Segoe Script'", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
