import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'segmented' | 'switch';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '',
  variant = 'segmented'
}) => {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();

  if (variant === 'switch') {
    return (
      <button
        id="theme-switch-btn"
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex h-7 w-14 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer border ${
          isDark 
            ? 'bg-[#181818] border-[#2A2A2A]' 
            : 'bg-[#EEEEEE] border-[#E5E5E5]'
        } ${className}`}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span
          className={`pointer-events-none flex h-5.5 w-5.5 items-center justify-center rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
            isDark 
              ? 'translate-x-7 bg-[#242424] text-amber-300' 
              : 'translate-x-0 bg-white text-amber-500'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-blue-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </span>
      </button>
    );
  }

  // Segmented Pill: ☀️ Light | 🌙 Dark
  return (
    <div 
      className={`inline-flex items-center rounded-lg p-0.5 border text-xs font-medium select-none transition-colors duration-200 ${
        isDark 
          ? 'bg-[#111111] border-[#2A2A2A]' 
          : 'bg-[#F7F7F7] border-[#E5E5E5]'
      } ${className}`}
      role="group"
      aria-label="Theme preference selector"
    >
      {/* Light Option Button */}
      <button
        id="theme-select-light-btn"
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${
          !isDark
            ? 'bg-white text-[#111111] font-semibold shadow-xs border border-[#E5E5E5]'
            : 'text-[#A3A3A3] hover:text-white hover:bg-[#181818]'
        }`}
        aria-pressed={!isDark}
        title="Switch to Light Mode"
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-500/20' : 'text-[#A3A3A3]'}`} />
        <span className="hidden sm:inline">Light</span>
      </button>

      {/* Dark Option Button */}
      <button
        id="theme-select-dark-btn"
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-[#181818] text-white font-semibold shadow-xs border border-[#2A2A2A]'
            : 'text-[#555555] hover:text-[#111111] hover:bg-[#EEEEEE]'
        }`}
        aria-pressed={isDark}
        title="Switch to Dark Mode"
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400 fill-blue-400/20' : 'text-[#555555]'}`} />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
};
