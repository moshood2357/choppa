/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}", // if using Next.js 13+ app router
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
