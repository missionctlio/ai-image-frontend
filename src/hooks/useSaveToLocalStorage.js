import { useCallback } from 'react';

const useSaveToLocalStorage = () => {
    const saveToLocalStorage = useCallback((key, data) => {
        // Retrieve existing data from local storage
        const existingData = JSON.parse(localStorage.getItem(key)) || [];

        // Add the new data to the beginning of the list
        existingData.unshift(data);

        // Save updated data back to local storage
        localStorage.setItem(key, JSON.stringify(existingData));
    }, []);

    return { saveToLocalStorage };
};

export default useSaveToLocalStorage;
