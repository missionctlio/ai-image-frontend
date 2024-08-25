import { useState, useEffect } from 'react';
import { useAuth } from '../components/Auth';

const useApp = () => {
    const { user, login, logout } = useAuth();
    const [selectedComponent, setSelectedComponent] = useState('imageGenerator');
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        const savedComponent = localStorage.getItem('selectedComponent');
        if (savedComponent) {
            setSelectedComponent(savedComponent);
        }
    }, []);

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