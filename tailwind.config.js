/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2BE880",
        secondary: "#264533",
        background: "#12211A",
        primaryMuted: "#94C7AB",
        primary2: "#17AB59",
        border: "#36634A",
        highlight: "#0AD942",
        erorr:"#FA5438"
      },
    },
  },
  plugins: [],
};
