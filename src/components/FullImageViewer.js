import React, { useState } from 'react';
import { baseUrl } from '../api';

const FullImageViewer = ({ image, onClose }) => {
    const [showPrompt, setShowPrompt] = useState(true);
    const [showDescription, setShowDescription] = useState(false);
    const [showAspectRatio, setShowAspectRatio] = useState(false);

    const handleCopyPrompt = () => {
        document.getElementById('prompt').value = image.prompt;
        onClose(); // Close the overlay
    };

    const handleDownloadImage = () => {
        // Create a Blob from the image URL to ensure the browser downloads the image
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
    const togglePrompt = () => setShowPrompt(prev => !prev);
    const toggleDescription = () => setShowDescription(prev => !prev);
    const toggleAspectRatio = () => setShowAspectRatio(prev => !prev);

    return (
        <div className="full-image-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }}>
            <div className="full-image-container">
                <div className="close-button" onClick={onClose}>×</div>
                <img src={`${baseUrl}${image.imageUrl}`} alt="Full Image" className="full-image-img" />
                <div className="text-container">
                    <div className="toggle-container">
                        <button className="toggle-button" onClick={togglePrompt}>
                            {showPrompt ? 'Hide Prompt Details' : 'Show Prompt'}
                        </button>
                        <button className="toggle-button" onClick={toggleDescription}>
                            {showDescription ? 'Hide Description' : 'Show Description'}
                        </button>
                        <button className="toggle-button" onClick={toggleAspectRatio}>
                            {showAspectRatio ? 'Hide Aspect Ratio' : 'Show Aspect Ratio'}
                        </button>
                        <button className="download-button" onClick={handleDownloadImage}>
                            Download Image
                        </button>
                    </div>
                    <div className="text-info-container">
                        {showPrompt && (
                            <div className="full-image-prompt">
                                <button className="copy-button" onClick={handleCopyPrompt} title="Copy Prompt">
                                    📋
                                </button>
                                <br />
                                <strong>Original Prompt</strong>
                                <hr />
                                {image.prompt}
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
                        {showDescription && (
                            <div className="full-image-description">
                                <strong>Description</strong>
                                <hr />
                                {image.description}
                            </div>
                        )}
                        {showAspectRatio && (
                            <div className="full-image-aspect-ratio">
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
