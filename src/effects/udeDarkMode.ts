import { useEffect, useState } from 'react';

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedPreference = localStorage.getItem('theme');
        if (storedPreference) {
            return storedPreference === 'dark';
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return [isDarkMode, toggleDarkMode] as const;
};

export default useDarkMode;