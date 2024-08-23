import { useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import '../styles/Auth.css';
import { THEME_LOCAL_STORAGE_KEY } from './ThemeSelector'

export const useAuth = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [theme, setTheme] = useState('dark'); // Default theme
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
    const isAllowedEmail = (email) => {
        const allowed = ['aarlouski.dev@gmail.com', 'aesync.com','emptyset.io', 'emptysetmedia.com', 'bryanlokey.com', 'gravenste.in'];
    
        // Extract domain from email if it's a full email address
        const emailDomain = email.includes('@') ? email.split('@')[1] : email;
    
        return allowed.some(allowedItem => {
            // Check if allowed item is a full email address or a domain
            if (allowedItem.includes('@')) {
                return allowedItem === email;
            } else {
                return allowedItem === emailDomain;
            }
        });
    };
    
    
    const handleLoginSuccess = async (tokenResponse) => {
        console.log("wtfwtfwtf")
        try {
            const userInfo = await getUserInfo(tokenResponse.access_token);
            if (isAllowedEmail(userInfo.email)) {
                setUser(userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
            } else {
                setUser(null);

                handleLoginError(new Error('Unauthorized user'), userInfo);
            }
        } catch (error) {
            handleLoginError(error);
        }
    };


    const handleLoginError = (error, userInfo) => {
        console.error('Login Failed:', error);
        alert('Unauthorized user: ' + userInfo.email);
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
        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
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

    return { user, login, logout, theme };
};

const Auth = () => {
    const { user, login, logout, theme } = useAuth();

    return (
        <div className="login-container">
            {!user ? (
                <div className="login-box">
                    <h2>Welcome to Our App</h2>
                    <button onClick={login} className="modern-google-button">
                        <div className="gsi-material-button-icon">
                            <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                style={{ display: 'block', width: '20px', height: '20px' }}
                            >
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                        </div>
                        <span className="gsi-material-button-contents">Sign in with Google</span>
                    </button>
                </div>
            ) : (
                <div className="logout-box">
                    <h2>Welcome back, {user.name}</h2>
                    <button onClick={logout} className={`modern-google-button theme-${theme} theme-selector`}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Auth;