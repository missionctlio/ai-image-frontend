import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import ThemeSelector from './ThemeSelector';
import Profile from './Profile';
import '../styles/NavBar.css';
import useTheme from '../hooks/useTheme';

const NavBar = ({ user, selectedComponent, handleComponentChange, showProfile, toggleProfile, logout }) => {
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleProfileClick = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
        setIsProfileOpen(false); // Close profile details when toggling the dropdown
    };

    const toggleProfileDetails = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleComponentClick = (component) => {
        handleComponentChange(component);
        setIsSettingsDropdownOpen(false); // Close dropdown when a component is selected
        setIsProfileOpen(false); // Close profile details when a component is selected
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.profile-icon-container')) {
                setIsSettingsDropdownOpen(false); // Close the dropdown if clicked outside
                setIsProfileOpen(false); // Close profile details if clicked outside
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className="navbar-wrapper">
            <nav className="navbar-container">
                <div className="navbar-brand">
                    <span>Welcome, {user.given_name}</span>
                </div>

                {!isMobileView && (
                    <div className="navbar-menu">
                        <button
                            onClick={() => handleComponentClick('chat')}
                            className={`navbar-item ${selectedComponent === 'chat' ? 'active' : ''}`}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => handleComponentClick('imageGenerator')}
                            className={`navbar-item ${selectedComponent === 'imageGenerator' ? 'active' : ''}`}
                        >
                            Image Generator
                        </button>
                    </div>
                )}

                <div className="profile-icon-container">
                    <button className="profile-icon-button" onClick={handleProfileClick}>
                        {user.picture ? (
                            <img src={user.picture} alt="User Profile" className="profile-icon" />
                        ) : (
                            <FaUser className="profile-icon" />
                        )}
                    </button>
                    {isSettingsDropdownOpen && (
                        <div className="settings-dropdown">
                            {isMobileView && (
                                <>
                                    <button
                                        onClick={() => handleComponentClick('chat')}
                                        className={`navbar-item ${selectedComponent === 'chat' ? 'active' : ''}`}
                                    >
                                        Chat
                                    </button>
                                    <button
                                        onClick={() => handleComponentClick('imageGenerator')}
                                        className={`navbar-item ${selectedComponent === 'imageGenerator' ? 'active' : ''}`}
                                    >
                                        Image Generator
                                    </button>
                                </>
                            )}
                            <button className="navbar-item" onClick={toggleProfileDetails}>
                                Profile
                            </button>
                            {isProfileOpen && (
                                <div className="profile-overlay">
                                    <Profile user={user} theme={theme} setTheme={setTheme} />
                                </div>
                            )}
                            <div className="theme-selector-container">
                                <span>Theme</span>
                                <ThemeSelector theme={theme} setTheme={setTheme} />
                            </div>
                            <button onClick={logout} className="navbar-item">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default NavBar;