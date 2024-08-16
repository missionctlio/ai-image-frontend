import React, { useState, useEffect } from 'react';
import ImageGenerator from './components/ImageGenerator';
import Chat from './components/Chat';
import './App.css'; // Import the CSS file for styling

function App() {
    const [theme, setTheme] = useState('light');
    const [selectedComponent, setSelectedComponent] = useState('chat');

    // Load component selection from local storage on initial render
    useEffect(() => {
        const storedComponent = localStorage.getItem('selectedComponent');
        if (storedComponent) {
            setSelectedComponent(storedComponent);
        }
    }, []);

    // Save component selection to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('selectedComponent', selectedComponent);
    }, [selectedComponent]);

    // Handle change in dropdown selection
    const handleComponentChange = (event) => {
        setSelectedComponent(event.target.value);
    };

    return (
        <div className={`app-container ${theme}`}>
            {/* Dropdown for selecting component */}
            <div className="component-selector-dropdown-container">
                <label htmlFor="component-select">Choose a component:</label>
                <select
                    id="component-select"
                    value={selectedComponent}
                    onChange={handleComponentChange}
                    className="component-select"
                >
                    <option value="chat">Chat</option>
                    <option value="imageGenerator">Image Generator</option>
                </select>
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
    );
}

export default App;
