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
        background: "#081118",
        foreground: "#f2f0e7",
        muted: "#9ba8b2",
        line: "#22343d"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      letterSpacing: {
        editorial: "0.18em"
      },
      boxShadow: {
        glow: "0 0 24px rgba(242, 240, 231, 0.08)"
      }
    }
  },
  plugins: []
};
