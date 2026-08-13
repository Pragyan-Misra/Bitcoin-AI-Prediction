/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0e14",
        surface: "#121722",
        card: "#181f2c",
        cardHover: "#1e293b",
        border: "#26334d",
        brand: {
          50: "#ecfeff",
          100: "#cffaff",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
        bullish: "#10b981",
        bearish: "#f43f5e",
        gold: "#f59e0b",
      },
    },
  },
  plugins: [],
};
