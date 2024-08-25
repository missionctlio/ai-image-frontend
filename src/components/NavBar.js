import React, { useState } from 'react';
import ThemeSelector from './ThemeSelector';
import Profile from './Profile';
import '../styles/NavBar.css';

const NavBar = ({ user, selectedComponent, handleComponentChange, showProfile, toggleProfile, logout, theme, setTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsHovered, setIsSettingsHovered] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`navbar-container ${theme}-theme`}>
            <div className="navbar-brand">
                <span>Welcome, {user.given_name}</span>
                <button className="burger-menu" onClick={toggleMobileMenu}>
                    ☰
                </button>
            </div>
            <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <button
                    onClick={() => handleComponentChange('chat')}
                    className={`navbar-item ${selectedComponent === 'chat' ? 'active' : ''}`}
                >
                    Chat
                </button>
                <button
                    onClick={() => handleComponentChange('imageGenerator')}
                    className={`navbar-item ${selectedComponent === 'imageGenerator' ? 'active' : ''}`}
                >
                    Image Generator
                </button>
                <div 
                    className="navbar-item settings-container"
                    onMouseEnter={() => setIsSettingsHovered(true)}
                    onMouseLeave={() => setIsSettingsHovered(false)}
                >
                    Settings
                    {isSettingsHovered && (
                        <div className="settings-dropdown">
                            <button onClick={toggleProfile} className="navbar-item">
                                Profile
                            </button>
                            {showProfile && (
                                <div className={`profile-overlay ${theme}-theme`}>
                                    <Profile user={user} theme={theme} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <ThemeSelector theme={theme} setTheme={setTheme} />
                <button onClick={logout} className="navbar-item">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default NavBar;