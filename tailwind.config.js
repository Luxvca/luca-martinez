/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#f5f5f5",
        muted: "#b8b8b8",
        line: "#2a2a2a"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      letterSpacing: {
        editorial: "0.18em"
      },
      boxShadow: {
        glow: "0 0 24px rgba(245, 245, 245, 0.08)"
      }
    }
  },
  plugins: []
};
