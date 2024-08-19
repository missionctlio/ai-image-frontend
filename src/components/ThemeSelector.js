import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons for light and dark themes

// Function to apply the theme to the document
export const applyTheme = (theme) => {
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
};

const ThemeSelector = () => {
    // Determine the default theme based on system preferences
    const getDefaultTheme = () => {
        const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return localStorage.getItem('theme') || (userPrefersDark ? 'dark' : 'light');
    };

    const [theme, setTheme] = useState(getDefaultTheme);

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('theme', theme); // Save the selected theme to local storage
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
                <FaSun /> Light Theme
            </option>
            <option value="dark" className="theme-option">
                <FaMoon /> Dark Theme
            </option>
        </select>
    );
};

export default ThemeSelector;
