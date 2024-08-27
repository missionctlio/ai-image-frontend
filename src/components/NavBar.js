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

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleSettingsDropdown = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
    };

    const handleComponentClick = (component) => {
        handleComponentChange(component);
        closeMobileMenu(); // Close the mobile menu when an item is clicked
    };

    const handleProfileClick = (event) => {
        event.stopPropagation(); // Prevent closing the mobile menu
        toggleProfile(); // Toggle profile visibility
        setIsSettingsDropdownOpen(true); // Ensure settings dropdown closes
    };

    return (
        <nav className={`navbar-container ${theme}-theme`}>
            <div className="navbar-brand">
                <span>Welcome, {user.given_name}</span>
            </div>
            <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
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
                            <button className="navbar-item" onClick={handleProfileClick}>
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
                <button onClick={() => {
                    logout();
                    closeMobileMenu(); // Close the mobile menu when logging out
                }} className="navbar-item">
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
