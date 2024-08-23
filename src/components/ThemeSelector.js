import React, { useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons for light and dark themes
import useTheme from '../hooks/useTheme'; // Import the useTheme hook
export const THEME_LOCAL_STORAGE_KEY = 'theme'; // Key for storing theme in localStorage

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme(); // Use the theme hook

    // Effect to apply the theme to the document body
    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            document.querySelectorAll('.theme-selector').forEach(el => {
                el.classList.remove('light-theme');
                el.classList.add('dark-theme');
            });
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            document.querySelectorAll('.theme-selector').forEach(el => {
                el.classList.remove('dark-theme');
                el.classList.add('light-theme');
            });
        }
        // Save the selected theme to local storage
        localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
    }, [theme]);

    const handleChange = (e) => {
        setTheme(e.target.value);
    };

    return (
        <select
            className="theme-selector"
            value={theme}
            onChange={handleChange}
            id="themeSelector"
        >
            <option value="light" className="theme-option">
                Light Theme
            </option>
            <option value="dark" className="theme-option">
                Dark Theme
            </option>
        </select>
    );
};
export default ThemeSelector;
