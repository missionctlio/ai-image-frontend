import { useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

const getUserInfo = async (token) => {
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw new Error('Failed to fetch user info');
    }
};

export const useAuth = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLoginSuccess = async (tokenResponse) => {
        try {
            const userInfo = await getUserInfo(tokenResponse.access_token);
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
        } catch (error) {
            handleLoginError(error);
        }
    };

    const handleLoginError = (error) => {
        console.error('Login Failed:', error);
    };

    const login = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: handleLoginError,
    });

    const logout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { user, login, logout };
};

export default useAuth;
