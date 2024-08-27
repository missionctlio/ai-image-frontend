import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const useApp = () => {
    const { login, logout } = useAuth();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [selectedComponent, setSelectedComponent] = useState('imageGenerator');
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        const savedComponent = localStorage.getItem('selectedComponent');
        if (savedComponent) {
            setSelectedComponent(savedComponent);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user)); // Update local storage
    }, [user]);

    const handleComponentChange = (component) => {
        setSelectedComponent(component);
        localStorage.setItem('selectedComponent', component);
        setShowProfile(false);  // Hide profile if component changes
    };

    const toggleProfile = () => {
        setShowProfile(prevState => !prevState);
    };

    return {
        user,
        setUser,
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
