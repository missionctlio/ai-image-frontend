import React, { useState } from 'react';
import Thumbnails from './Thumbnails';
import FullImageViewer from './FullImageViewer';
import { FaPaperPlane, FaListUl, FaPlayCircle } from 'react-icons/fa';
import useImageGenerator from '../hooks/useImageGenerator';
import useTheme from '../hooks/useTheme';

const ImageGenerator = () => {
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
        handleCloseFullImageViewer,
        queuedJobs, // Use queuedJobs from the hook
        runningJobs  // Use runningJobs from the hook
    } = useImageGenerator();

    const [theme, setTheme] = useState('dark');

    return (
        <div className="container">
            <form id="promptForm" className="form-container" onSubmit={handleSubmit}>
            <div className="status-indicator">
                    {/* Display queued and running jobs with icons */}
                    <div className="queue-indicator">
                        {queuedJobs > 0 && (
                            <span className="status-icon-container" title={`Queued Jobs`}>
                                <FaListUl className="status-icon" /> {queuedJobs}
                            </span>
                        )}
                    </div>
                    <br />
                </div>
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
                        <option value="2:3">2:3</option>
                        <option value="3:2">3:2</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
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
                            <FaPaperPlane size={24} />
                        )}
                    </button>
                </div>
            </form>
            <Thumbnails images={images} />
            {selectedImage && (
                <FullImageViewer image={selectedImage} onClose={handleCloseFullImageViewer} />
            )}
        </div>
    );
};

export default ImageGenerator;
