import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Theme customization is now handled via @theme directive in GlobalStyle.css
  // This config file is kept for content paths and future plugin configurations
  plugins: [],
} satisfies Config;
