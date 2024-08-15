
import { useState, useEffect } from 'react';

const useProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUser(userData);
        }
    }, []);

    return { user};
};

export default useProfile;
