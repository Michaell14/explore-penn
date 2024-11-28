/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      backgroundImage: {
        'dotted-pattern': 'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dotted-pattern': '10px 10px',
      },
    },
  },
  plugins: [],
};