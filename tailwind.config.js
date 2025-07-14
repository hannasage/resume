/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.json',
  ],
  darkMode: 'class',
  safelist: [
    // Gradient backgrounds for skill tags
    'bg-gradient-to-r',
    'from-blue-100', 'to-sky-100', 'from-blue-500', 'to-cyan-400',
    'from-amber-100', 'to-yellow-100', 'from-amber-400', 'to-yellow-300',
    'from-emerald-100', 'to-green-100', 'from-emerald-400', 'to-green-300',
    'from-purple-100', 'to-violet-100', 'from-purple-400', 'to-pink-400',
    'from-pink-100', 'to-rose-100', 'from-pink-400', 'to-rose-400',
    'from-cyan-100', 'to-teal-100', 'from-cyan-400', 'to-teal-300',
    'from-indigo-100', 'to-blue-100', 'from-indigo-400', 'to-blue-400',
    'from-lime-100', 'to-green-100', 'from-lime-400', 'to-green-400',
    'from-orange-100', 'to-red-100', 'from-orange-400', 'to-red-400',
    'from-slate-100', 'to-gray-100', 'from-slate-400', 'to-gray-400',
    'from-teal-100', 'to-cyan-100', 'from-teal-400', 'to-cyan-400',
    'from-red-100', 'to-pink-100', 'from-red-400', 'to-pink-400',
    // Text colors
    'text-blue-800', 'text-amber-800', 'text-emerald-800', 'text-purple-800',
    'text-pink-800', 'text-cyan-800', 'text-indigo-800', 'text-lime-800',
    'text-orange-800', 'text-slate-800', 'text-teal-800', 'text-red-800',
    'text-white', 'text-gray-900',
    // Border colors
    'border-blue-200', 'border-amber-200', 'border-emerald-200', 'border-purple-200',
    'border-pink-200', 'border-cyan-200', 'border-indigo-200', 'border-lime-200',
    'border-orange-200', 'border-slate-200', 'border-teal-200', 'border-red-200',
    'border-blue-400', 'border-amber-300', 'border-emerald-300', 'border-purple-300',
    'border-pink-300', 'border-cyan-300', 'border-indigo-300', 'border-lime-300',
    'border-orange-300', 'border-slate-300', 'border-teal-300', 'border-red-300',
  ],
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

