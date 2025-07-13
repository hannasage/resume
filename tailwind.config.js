/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors (Claude.ai Manila/Cream inspired)
        primary: {
          light: '#2F2F2F', // Darker for better contrast on cream
          dark: '#D4D4D4',  // VS Code dark theme text
        },
        secondary: {
          light: '#6B6B6B', // Stronger gray for cream background
          dark: '#9C9C9C',  // VS Code dark secondary text
        },
        background: {
          light: '#FAF7F0', // Warm manila/cream like Claude.ai
          dark: '#1E1E1E',  // VS Code dark background
        },
        accent: {
          light: '#F5F1E8', // Deeper cream for accent areas
          dark: '#252526',  // VS Code dark accent
        },
        'text-primary': {
          light: '#2F2F2F',
          dark: '#D4D4D4',
        },
        'text-secondary': {
          light: '#6B6B6B',
          dark: '#9C9C9C',
        },
        border: {
          light: '#E8E2D4', // Warm border for cream theme
          dark: '#3E3E42',  // Subtle border for dark theme
        },
        // Vibrant accent colors that pop
        'accent-vibrant': {
          light: '#3B82F6', // Vibrant blue for light theme
          dark: '#F59E0B',  // Vibrant amber for dark theme
        },
        // Keep original colors for backward compatibility
        primary: '#2F2F2F',
        secondary: '#6B6B6B',
        background: '#FAF7F0',
        accent: '#F5F1E8',
        'text-primary': '#2F2F2F',
        'text-secondary': '#6B6B6B',
        border: '#E8E2D4',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

