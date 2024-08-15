import { useState, useEffect } from 'react';
import { THEME_LOCAL_STORAGE_KEY } from '../components/ThemeSelector';

const useTheme = () => {
    const [theme, setTheme] = useState('dark'); // Default theme

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    return {
        theme,
        setTheme
    };
};

export default useTheme;
