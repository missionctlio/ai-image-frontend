import { useState } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { verifyGoogleToken } from '../api.js';

export const useAuth = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);


    const isAllowedEmail = (email) => {
        const allowed = [
            'aarlouski.dev@gmail.com',
            'aesync.com',
            'emptyset.io',
            'emptysetmedia.com',
            'bryanlokey.com',
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

            const { userInfo: userInfo } = backendResponse;

            if (isAllowedEmail(userInfo.email)) {
                setUser(userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
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

    const logout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('user');
    };

    return { user, setUser, login, handleLoginError, handleLoginSuccess, isAllowedEmail, logout};
};
