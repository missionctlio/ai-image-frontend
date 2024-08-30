import React, { useState } from 'react';
import Thumbnails from './Thumbnails'; // Import the Thumbnails component
import FullImageViewer from './FullImageViewer'; // Import the FullImageViewer component
import { FaPaperPlane } from 'react-icons/fa'; // Import the icon (Font Awesome example)
import useImageGenerator from '../hooks/useImageGenerator'; // Import the custom hook
import useTheme from '../hooks/useTheme'; // Import the theme hook

const ImageGenerator = () => {
    const apiKey = 'your-api-key-here'; // Ensure this is secure and retrieved securely
    const {
        prompt,
        setPrompt,
        aspectRatio,
        setAspectRatio,
        usePromptRefiner,
        setUsePromptRefiner,
        loading,
        images,
        selectedImage,
        handleSubmit,
        handleCloseFullImageViewer
    } = useImageGenerator(apiKey);

    const [theme, setTheme] = useState('dark');

    return (
        <div className="container">
            <form id="promptForm" className="form-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="prompt"
                    name="prompt"
                    autoComplete="off"
                    className={`theme-selector ${theme}-theme`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    placeholder="What would you like to see?"
                />
                <div className="form-controls">
                    <select
                        id="aspectRatio"
                        name="aspectRatio"
                        className={`dropdown-button theme-selector ${theme}-theme`}
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                    >
                        <option value="1:1">1:1</option>
                        <option value="3:2">3:2</option>
                        <option value="4:3">4:3</option>
                        <option value="16:9">16:9</option>
                        <option value="21:9">21:9</option>
                        <option value="32:9">32:9</option>
                    </select>
                    <div className="input-toggle-container">
                        <input
                            type="checkbox"
                            id="usePromptRefiner"
                            name="usePromptRefiner"
                            checked={usePromptRefiner}
                            onChange={() => setUsePromptRefiner(!usePromptRefiner)}
                            className="toggle-checkbox"
                        />
                        <label htmlFor="usePromptRefiner" className={`toggle-label theme-selector ${theme}-theme`}>
                            <span className="toggle-slider">
                                <span className="toggle-text">Prompt Refiner</span>
                            </span>
                        </label>
                    </div>
                    <button className={`send-button theme-selector ${theme}-theme`} type="submit" disabled={loading}>
                        {loading ? (
                            <div className="loading-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        ) : (
                            <FaPaperPlane size={24} /> // Replace text with icon
                        )}
                    </button>
                </div>
            </form>
            <div className="button-container">
            </div>
            <Thumbnails images={images} /> {/* Pass images as a prop */}
            {selectedImage && (
                <FullImageViewer image={selectedImage} onClose={handleCloseFullImageViewer} />
            )}
        </div>
    );
};

export default ImageGenerator;
