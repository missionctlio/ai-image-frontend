import React, { useState, useEffect } from 'react';
import { baseUrl } from '../api';
import { THEME_LOCAL_STORAGE_KEY } from './ThemeSelector';

const FullImageViewer = ({ image, onClose }) => {
    // State to track which section is active
    const [activeSection, setActiveSection] = useState('prompt');
    const [theme, setTheme] = useState('dark'); // Default theme

    const handleCopyPrompt = () => {
        document.getElementById('prompt').value = image.prompt;
        onClose(); // Close the overlay
    };

    const handleDownloadImage = () => {
        fetch(`${baseUrl}${image.imageUrl.replace(/original_/i, '')}`)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `image_${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url); // Clean up
            })
            .catch(err => console.error('Failed to download image:', err));
    };

    const toggleSection = (section) => {
        setActiveSection(prev => prev === section ? null : section);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    return (
        <div className={`full-image-overlay`} onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }}>
            <div className={`full-image-container ${theme}-theme`}>
                <div className={`close-button ${theme}-theme`} onClick={onClose}>×</div>
                <img src={`${baseUrl}${image.imageUrl}`} alt={`${image.prompt}`} className={`full-image-img ${theme}-theme`} />
                <div className={`text-container`}>
                    <div className={`toggle-container`}>
                        <button
                            className={`toggle-button ${theme}-theme`}
                            onClick={() => toggleSection('prompt')}
                        >
                            {activeSection === 'prompt' ? 'Hide Prompt Details' : 'Show Prompt'}
                        </button>
                        <button
                            className={`toggle-button ${theme}-theme`}
                            onClick={() => toggleSection('description')}
                        >
                            {activeSection === 'description' ? 'Hide Description' : 'Show Description'}
                        </button>
                        <button
                            className={`toggle-button ${theme}-theme`}
                            onClick={() => toggleSection('aspectRatio')}
                        >
                            {activeSection === 'aspectRatio' ? 'Hide Aspect Ratio' : 'Show Aspect Ratio'}
                        </button>
                        <button className={`download-button ${theme}-theme`} onClick={handleDownloadImage}>
                            Download Image
                        </button>
                    </div>
                    <div className={`text-info-container`}>
                        {activeSection === 'prompt' && (
                            <div className={`full-image-prompt ${theme}-theme`}>
                                <button className={`copy-button ${theme}-theme`} onClick={handleCopyPrompt} title="Copy Prompt">
                                    📋
                                </button>
                                <br />
                                <strong>Original Prompt</strong>
                                <hr />
                                {image.prompt}
                                <br />
                                {image.refinedPrompt && image.refinedPrompt.trim() !== '' && (
                                    <>
                                        <br />
                                        <strong>Refined Prompt</strong>
                                        <hr />
                                        {image.refinedPrompt}
                                    </>
                                )}
                            </div>
                        )}
                        {activeSection === 'description' && (
                            <div className={`full-image-description ${theme}-theme`}>
                                <strong>Description</strong>
                                <hr />
                                {image.description}
                            </div>
                        )}
                        {activeSection === 'aspectRatio' && (
                            <div className={`full-image-aspect-ratio ${theme}-theme`}>
                                <strong>Aspect Ratio</strong>
                                <hr />
                                {image.aspectRatio}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullImageViewer;
