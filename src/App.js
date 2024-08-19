import React, { useState, useEffect } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ThemeSelector from './components/ThemeSelector'; // Assuming this is a separate component for the theme selector
import Chat from './components/Chat';
import './App.css'; // Import the CSS file for styling

function App() {
    const [theme, setTheme] = useState('');
    const [selectedComponent, setSelectedComponent] = useState('Component');

    // Load component selection from local storage on initial render
    useEffect(() => {
        const storedComponent = localStorage.getItem('selectedComponent');
        if (storedComponent) {
            setSelectedComponent(storedComponent);
        }
    }, []);

    // Save component selection to local storage whenever it changes
    useEffect(() => {
        if (selectedComponent !== 'Component') {
            localStorage.setItem('selectedComponent', selectedComponent);
        }
    }, [selectedComponent]);

    // Handle change in dropdown selection
    const handleComponentChange = (event) => {
        const newValue = event.target.value;
        setSelectedComponent(newValue);
        if (newValue !== 'Component') {
            localStorage.setItem('selectedComponent', newValue);
        }
    };

    return (
        <div className={`app-container ${theme}`}>
            <div className="topSelector">
                <ThemeSelector theme={theme} setTheme={setTheme} />
                <br />
                {/* Dropdown for selecting component */}
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
