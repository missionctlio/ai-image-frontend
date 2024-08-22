import { useState, useEffect } from 'react';
import { useAuth } from '../components/Auth';

const useApp = () => {
    const { user, login, logout } = useAuth();
    const [selectedComponent, setSelectedComponent] = useState('imageGenerator');
    const [showProfile, setShowProfile] = useState(false); // State to toggle Profile component

    // Load the selectedComponent from localStorage on initial render
    useEffect(() => {
        const savedComponent = localStorage.getItem('selectedComponent');
        if (savedComponent) {
            setSelectedComponent(savedComponent);
        }
    }, []);

    const handleComponentChange = (event) => {
        const newValue = event.target.value;
        setSelectedComponent(newValue);
        if (newValue !== 'Component') {
            localStorage.setItem('selectedComponent', newValue);
        }
    };

    const toggleProfile = () => {
        setShowProfile(prevState => !prevState);
    };

    return {
        user,
        selectedComponent,
        setSelectedComponent,
        showProfile,
        handleComponentChange,
        toggleProfile,
        login,
        logout
    };
};

export default useApp;
