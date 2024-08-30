import { useState } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { verifyGoogleToken, logout as apiLogout } from '../api.js';

export const useAuth = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);

    const isAllowedEmail = (email) => {
        const allowed = [
            'aarlouski.dev@gmail.com',
            'aesync.com',
            'emptyset.io',
            'emptysetmedia.com',
            'bryanlokey.com',
            "megan.jaramillo.dev@gmail.com",
            'gravenste.in'
        ];
        const emailDomain = email.includes('@') ? email.split('@')[1] : email;
        return allowed.some(allowedItem => allowedItem.includes('@') ? allowedItem === email : allowedItem === emailDomain);
    };

    const handleLoginSuccess = async (tokenResponse) => {
        try {
            if (!tokenResponse.credential) {
                throw new Error('ID token is missing');
            }

            const token = tokenResponse.credential;
            const backendResponse = await verifyGoogleToken(token);

            const { userInfo, accessToken } = backendResponse;
            console.log('User info:', userInfo);
            console.log('Access token:', accessToken);

            if (isAllowedEmail(userInfo.email)) {
                setUser(userInfo);
                setAccessToken(accessToken); // Store the access token in state
                localStorage.setItem('user', JSON.stringify(userInfo)); // Store user info in local storage
                localStorage.setItem('accessToken', accessToken); // Store access token in local storage
            } else {
                handleLoginError(new Error('Unauthorized user'), userInfo);
            }
        } catch (error) {
            handleLoginError(error);
        }
    };

    const handleLoginError = (error, userInfo) => {
        alert('Unauthorized user: ' + (userInfo?.email || 'Unknown'));
    };

    const login = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: handleLoginError,
    });

    const logout = async () => {
        try {
            googleLogout();
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user'); // Remove user info from local storage
            localStorage.removeItem('accessToken'); // Remove access token from local storage
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    return { user, accessToken, setUser, login, handleLoginError, handleLoginSuccess, isAllowedEmail, logout };
};
