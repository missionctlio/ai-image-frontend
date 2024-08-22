import React from 'react';
import useApp from './hooks/useApp'; // Import the custom hook
import useTheme from './hooks/useTheme';
import ImageGenerator from './components/ImageGenerator';
import ThemeSelector from './components/ThemeSelector';
import Chat from './components/Chat';
import Profile from './components/Profile'; // Import the Profile component
import './App.css'; 

function App() {
    const {
        user,
        selectedComponent,
        setSelectedComponent,
        showProfile,
        handleComponentChange,
        toggleProfile,
        login,
        logout
    } = useApp();
    const { theme, setTheme } = useTheme();
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
                            <div className={`profile-overlay ${theme}-theme`}>
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
