import React, { useState, useEffect } from 'react';
import { useAuth } from './components/Auth';
import ImageGenerator from './components/ImageGenerator';
import ThemeSelector from './components/ThemeSelector';
import Chat from './components/Chat';
import Profile from './components/Profile'; // Import the Profile component
import './App.css'; 
import { THEME_LOCAL_STORAGE_KEY } from './components/ThemeSelector';

function App() {
    const { user, login, logout } = useAuth();
    const [theme, setTheme] = useState('dark'); // Default theme
    const [selectedComponent, setSelectedComponent] = useState('imageGenerator');
    const [showProfile, setShowProfile] = useState(false); // State to toggle Profile component

    // Load the selectedComponent from localStorage on initial render
    useEffect(() => {
        const savedComponent = localStorage.getItem('selectedComponent');
        if (savedComponent) {
            setSelectedComponent(savedComponent);
        }
    }, []); // Empty dependency array means this runs only on initial render

    // Load the theme from localStorage on initial render
    useEffect(() => { 
        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []); // Empty dependency array means this runs only on initial render

    const handleComponentChange = (event) => {
        const newValue = event.target.value;
        setSelectedComponent(newValue);
        if (newValue !== 'Component') {
            localStorage.setItem('selectedComponent', newValue);
        }
    };

    const toggleProfile = () => {
        setShowProfile(prevState => !prevState);
    };

    return (
        <div className={`app-container ${theme}`}>
            {user ? (
                <div className="relative-container">
                    <div className="header-container">
                        <ThemeSelector theme={theme} setTheme={setTheme} />
                        <div className="component-selector-dropdown-container">
                            <select
                                id="component-select"
                                value={selectedComponent}
                                onChange={handleComponentChange}
                                className="component-select theme-selector"
                            >
                                <option value="chat">Chat</option>
                                <option value="imageGenerator">Image Generator</option>
                            </select>
                        </div>
                        <span>Welcome, {user.given_name}</span>
                        <button onClick={toggleProfile} className={`theme-selector profile-button`}>
                            {showProfile ? 'Hide Profile' : 'Show Profile'}
                        </button>
                        {/* Overlay for Profile component */}
                        {showProfile && (
                            <div className={`profile-overlay theme-selector ${theme}-theme`}>
                                <Profile user={user} theme={theme} setTheme={setTheme} />
                            </div>
                        )}
                        <button onClick={logout} className={`theme-selector logout-button`}>
                            Logout
                        </button>
                    </div>

                    {/* Conditional rendering based on selectedComponent */}
                    {selectedComponent === 'chat' && (
                        <div id="chat-container" className={`chat-container ${theme}`}>
                            <Chat theme={theme} setTheme={setTheme} />
                        </div>
                    )}
                    {selectedComponent === 'imageGenerator' && (
                        <div className={`image-generator-container ${theme}`}>
                            <ImageGenerator theme={theme} setTheme={setTheme} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="login-container">
                    <div className={`login-box ${theme}-theme theme-selector`}>
                        <h2>Login to Your Account</h2>
                        <button onClick={login}>Sign in with Google</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
