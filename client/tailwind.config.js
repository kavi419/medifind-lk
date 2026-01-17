import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'glass-surface': 'rgba(255, 255, 255, 0.2)',
                'glass-border': 'rgba(255, 255, 255, 0.3)',
            },
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }
        },
    },
    plugins: [
        daisyui,
    ],
}
