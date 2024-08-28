import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa'; // Import an icon as a fallback if there's no user picture
import ThemeSelector from './ThemeSelector';
import Profile from './Profile';
import '../styles/NavBar.css'; // Import your NavBar-specific CSS

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
        <div className="navbar-wrapper">
            <nav className="navbar-container">
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
                </div>

                <div
                    className="profile-icon-container"
                    onMouseEnter={toggleSettingsDropdown}
                    onMouseLeave={toggleSettingsDropdown}
                >
                    <button className="navbar-item profile-icon-button">
                        {user.picture ? (
                            <img src={user.picture} alt="User Profile" className="profile-icon" />
                        ) : (
                            <FaUser className="profile-icon" />
                        )}
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

                {/* Burger Menu Icon */}
                <div className="burger-menu" onClick={toggleMobileMenu}>
                    <div className={isMobileMenuOpen ? 'line line1 open' : 'line line1'}></div>
                    <div className={isMobileMenuOpen ? 'line line2 open' : 'line line2'}></div>
                    <div className={isMobileMenuOpen ? 'line line3 open' : 'line line3'}></div>
                </div>
            </nav>
            {isMobileMenuOpen && (
                <div className="mobile-theme-selector">
                    <span>Theme</span>
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                </div>
            )}
        </div>
    );
};

export default NavBar;
