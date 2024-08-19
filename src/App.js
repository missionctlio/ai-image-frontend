import React, { useState } from 'react';
import { useAuth } from './components/Auth';
import ImageGenerator from './components/ImageGenerator';
import ThemeSelector from './components/ThemeSelector'; // Assuming this is a separate component for the theme selector
import Chat from './components/Chat';
import './App.css'; // Import the CSS file for styling

function App() {
    const { user, login, logout } = useAuth();
    const [theme, setTheme] = useState('light');
    const [selectedComponent, setSelectedComponent] = useState('imageGenerator');

    const handleComponentChange = (event) => {
        const newValue = event.target.value;
        setSelectedComponent(newValue);
        if (newValue !== 'Component') {
            localStorage.setItem('selectedComponent', newValue);
        }
    };

    return (
        <div className={`app-container ${theme}`}>
            {user ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div></div>
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
                </div><span  style={{ marginLeft: 'auto' }}> Welcome, {user.given_name}</span>
                        <button onClick={logout} className={`theme-selector`} style={{ marginLeft: 'auto' }}>Logout</button>
                    </div>
            {/* Conditional rendering based on selectedComponent */}
            {selectedComponent === 'chat' && (
                <div id="chat-container" className={theme}>
                    <Chat theme={theme} setTheme={setTheme} />
                </div>
            )}
            {selectedComponent === 'imageGenerator' && (
                <div className={theme}>
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