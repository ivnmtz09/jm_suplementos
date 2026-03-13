/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "jm-blue": "#0066FF",
        "jm-black": "#050505",
      },
    },
  },
  plugins: [],
};
