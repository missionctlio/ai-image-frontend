import React, { useState } from 'react';
import ThemeSelector from './ThemeSelector';
import Profile from './Profile';
import '../styles/NavBar.css';

const NavBar = ({ user, selectedComponent, handleComponentChange, showProfile, toggleProfile, logout, theme, setTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleSettingsDropdown = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
    };

    return (
        <nav className={`navbar-container ${theme}-theme`}>
            <div className="navbar-brand">
                <span>Welcome, {user.given_name}</span>
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
                    className="settings-container"
                    onMouseEnter={toggleSettingsDropdown}
                    onMouseLeave={toggleSettingsDropdown}
                >
                    <button className="navbar-item">
                        Settings
                    </button>
                    {isSettingsDropdownOpen && (
                        <div className="settings-dropdown">
                            <button className="navbar-item" onClick={toggleProfile}>
                                Profile
                            </button>
                            {showProfile && (
                                <div className="profile-overlay">
                                    <Profile user={user} theme={theme} setTheme={setTheme} />
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

            {/* Burger Menu Icon */}
            <div className="burger-menu" onClick={toggleMobileMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </nav>
    );
};

export default NavBar;