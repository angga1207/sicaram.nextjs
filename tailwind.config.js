/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const rotateX = plugin(function ({ addUtilities }) {
    addUtilities({
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        },
    });
});
module.exports = {
    content: ['./App.tsx', './app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4361ee',
                    light: '#eaf1ff',
                    'dark-light': 'rgba(67,97,238,.15)',
                },
                secondary: {
                    DEFAULT: '#805dca',
                    light: '#ebe4f7',
                    'dark-light': 'rgb(128 93 202 / 15%)',
                },
                success: {
                    DEFAULT: '#00ab55',
                    light: '#ddf5f0',
                    'dark-light': 'rgba(0,171,85,.15)',
                },
                danger: {
                    DEFAULT: '#e7515a',
                    light: '#fff5f5',
                    'dark-light': 'rgba(231,81,90,.15)',
                },
                warning: {
                    DEFAULT: '#e2a03f',
                    light: '#fff9ed',
                    'dark-light': 'rgba(226,160,63,.15)',
                },
                info: {
                    DEFAULT: '#2196f3',
                    light: '#e7f7ff',
                    'dark-light': 'rgba(33,150,243,.15)',
                },
                dark: {
                    DEFAULT: '#3b3f5c',
                    light: '#eaeaec',
                    'dark-light': 'rgba(59,63,92,.15)',
                },
                black: {
                    DEFAULT: '#0e1726',
                    light: '#e3e4eb',
                    'dark-light': 'rgba(14,23,38,.15)',
                },
                white: {
                    DEFAULT: '#ffffff',
                    light: '#e0e6ed',
                    dark: '#888ea8',
                },
            },
            fontFamily: {
                nunito: ['Nunito', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
                kanit: ['Kanit', 'sans-serif'],
                comfortaa: ['Comfortaa', 'sans-serif'],
                salsa: ['Salsa', 'cursive'],
            },
            spacing: {
                4.5: '18px',
            },
            boxShadow: {
                '3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-invert-headings': theme('colors.white.dark'),
                        '--tw-prose-invert-links': theme('colors.white.dark'),
                        h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
                        h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
                        h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
                        h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
                        h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
                        h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
                        p: { marginBottom: '0.5rem' },
                        li: { margin: 0 },
                        img: { margin: 0 },
                    },
                },
            }),
        },
        keyframes: {
            blinkingBg: {
                '0%': { backgroundColor: '#eeeeeefc' },
                '16.6%': { backgroundColor: '#eeeeeebc' },
                '33.36%': { backgroundColor: '#eeeeeeac' },
                // '50%': { backgroundColor: '#eeeeee9c' },
                '66.6%': { backgroundColor: '#eeeeeeac' },
                '82.9%': { backgroundColor: '#eeeeeebc' },
                '100%': { backgroundColor: '#eeeeeefc' }
            },
            blinkingTextPrimary: {
                '0%': { color: '#4261eefc' },
                '16.6%': { color: '#4261eebc' },
                '33.36%': { color: '#4261eeac' },
                '50%': { color: '#4261ee9c' },
                '66.6%': { color: '#4261eeac' },
                '82.9%': { color: '#4261eebc' },
                '100%': { color: '#4261eefc' }
            },
            blinkingTextSuccess: {
                '0%': { color: '#00ab55fc' },
                '16.6%': { color: '#00ab55bc' },
                '33.36%': { color: '#00ab55ac' },
                '50%': { color: '#00ab559c' },
                '66.6%': { color: '#00ab55ac' },
                '82.9%': { color: '#00ab55bc' },
                '100%': { color: '#00ab55fc' }
            }
        },
        animation: {
            blinkingBg: 'blinkingBg 3s ease-in-out infinite',
            blinkingTextPrimary: 'blinkingTextPrimary 2s ease-in-out infinite',
            blinkingTextSuccess: 'blinkingTextSuccess 2s ease-in-out infinite',
        },
        fontSize: {
            // '5xl': '2rem',
            // '4xl': '1.75rem',
            // '3xl': '1.475rem',
            // '2xl': '1.25rem',
            // 'xl': '1.125rem',
            // 'lg': '1rem',
            // 'base': '0.8rem',
            // 'sm': '0.75rem',
            // 'xs': '0.5rem',


            '7xl': '5rem',
            '5xl': '2.5rem',
            'xl': '1.5rem',
            'lg': '1.25rem',
            'md': '1.125rem',
            'base': '1rem',
            'sm': '0.875rem',
            'xs': '0.75rem',
            '2xs': '0.5rem',
            '3xs': '0.4rem',
            '4xs': '0.3rem',
        }
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        rotateX,
    ],
};
