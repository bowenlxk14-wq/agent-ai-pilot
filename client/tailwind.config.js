/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          900: "#0e1b2a",
          700: "#23364a",
          500: "#4f6b85"
        },
        sea: {
          500: "#1f6f8b",
          300: "#8dc7d8",
          100: "#e7f5f8"
        },
        sand: {
          50: "#fbf8f4",
          100: "#f4efe8"
        }
      },
      boxShadow: {
        soft: "0 16px 40px rgba(14,27,42,0.12)"
      }
    }
  },
  plugins: []
};
