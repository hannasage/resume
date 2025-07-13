'use client';

import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const nextTheme = {
    light: 'dark' as const,
    dark: 'system' as const,
    system: 'light' as const,
  };

  const handleToggle = () => {
    setTheme(nextTheme[theme]);
  };

  const IconComponent = icons[theme];

  return (
    <button
      onClick={handleToggle}
      className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label={`Switch to ${nextTheme[theme]} theme`}
      title={`Current: ${theme} theme. Click to switch to ${nextTheme[theme]}.`}
    >
      <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}