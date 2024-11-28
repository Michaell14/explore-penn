/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sf: ['"SF UI Display"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        customBlack: 'rgba(0, 0, 0, 0.20)', // for swipeup bars
      },
    },
  },
  plugins: [],
};