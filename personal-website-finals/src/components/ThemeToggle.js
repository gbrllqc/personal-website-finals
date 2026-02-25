import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
}

export default ThemeToggle;