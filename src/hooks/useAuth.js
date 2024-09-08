import { useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { verifyGoogleToken, logout as apiLogout } from '../api.js';

export const useAuth = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);
    const [needsRefresh, setNeedsRefresh] = useState(false); // State to trigger re-render
    const [errorDetail, setErrorDetail] = useState(null); // New state to handle error messages

    const isAllowedEmail = (email) => {
        const allowed = [
            'aarlouski.dev@gmail.com',
            'aesync.com',
            'emptyset.io',
            'emptysetmedia.com',
            'bryanlokey.com',
            "megan.jaramillo.dev@gmail.com",
            'gravenste.in',
            'brandon.m.murray@gmail.com'
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
    const handleLogout = () => {
        try {
            console.log('Logging out user...');
    
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
    
            // Optional: You can perform additional actions here, such as redirecting the user
            console.log('User successfully logged out. Local storage cleared.');
    
            // Redirect to login page or homepage
            window.location.href = '/login'; // Or any other route
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };
    const logout = async () => {
        try {
            await apiLogout(); // Call API to handle server-side logout if necessary
            googleLogout();
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user'); // Remove user info from local storage
            localStorage.removeItem('accessToken'); // Remove access token from local storage
            setNeedsRefresh(prev => !prev); // Trigger re-render by toggling state
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    useEffect(() => {
        // This effect will trigger when `needsRefresh` or `errorDetail` changes
        if (!user && !accessToken) {
            console.log('User is logged out. Triggering re-render.');
        }
        
        if (errorDetail === 'Refresh token missing') {
            // Handle the error case where refresh token is missing
            console.log('Refresh token is missing, logging out.');
            logout(); // Trigger logout flow
        }
    }, [needsRefresh, user, accessToken, errorDetail]);

    // Example function to simulate receiving the message
    const checkForErrorDetail = (message) => {
        if (message?.detail === "Refresh token missing") {
            console.log("No Refresh Token")
            setErrorDetail("Refresh token missing");
            googleLogout();
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user'); // Remove user info from local storage
            localStorage.removeItem('accessToken'); // Remove access token from local storage
            setNeedsRefresh(prev => !prev); // Trigger re-render by toggling state
        }
    };

    return { user, accessToken, setUser, login, handleLoginError, handleLogout, handleLoginSuccess, isAllowedEmail, logout, checkForErrorDetail };
};
