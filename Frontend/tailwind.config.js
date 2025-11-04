/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // asegúrate de tener esto
    ],
    theme: {
        extend: {
            fontFamily: {
                bevietnam: ['"Be Vietnam Pro"', "sans-serif"],
            },
        },
    },
    plugins: [],
}
