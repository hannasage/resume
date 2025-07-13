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
        // Theme built around bluish dark gray (gray-900: #1F2937)
        primary: {
          light: '#1F2937', // Bluish dark gray for light theme text
          dark: '#F1F5F9',  // Very light blue-gray for dark theme text
        },
        secondary: {
          light: '#4B5563', // Medium blue-gray for light theme secondary
          dark: '#CBD5E1',  // Light blue-gray for dark theme secondary
        },
        background: {
          light: '#FAF7F0', // Keep the beautiful cream background
          dark: '#1F2937',  // Bluish dark gray background
        },
        accent: {
          light: '#F5F1E8', // Deeper cream for accent areas
          dark: '#374151',  // Slightly lighter bluish gray for accents
        },
        'text-primary': {
          light: '#1F2937',
          dark: '#F1F5F9',
        },
        'text-secondary': {
          light: '#4B5563',
          dark: '#CBD5E1',
        },
        border: {
          light: '#E8E2D4', // Warm border for cream theme
          dark: '#4B5563',  // Medium blue-gray border for dark theme
        },
        // Vibrant accent colors that pop
        'accent-vibrant': {
          light: '#3B82F6', // Vibrant blue for light theme
          dark: '#F59E0B',  // Vibrant amber for dark theme
        },
        // Keep original colors for backward compatibility
        primary: '#1F2937',
        secondary: '#4B5563',
        background: '#FAF7F0',
        accent: '#F5F1E8',
        'text-primary': '#1F2937',
        'text-secondary': '#4B5563',
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

