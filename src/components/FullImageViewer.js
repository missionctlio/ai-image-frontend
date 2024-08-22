import React from 'react';
import useTheme from '../hooks/useTheme'; // Import useTheme hook
import useFullImageViewer from '../hooks/useFullImageViewer'; // Import the consolidated hook
import { baseUrl } from '../api';

const FullImageViewer = ({ image, onClose }) => {
    const { theme } = useTheme();
    const { activeSection, toggleSection, downloadImage, copyPrompt } = useFullImageViewer(image, onClose);

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
                        <button className={`download-button ${theme}-theme`} onClick={downloadImage}>
                            Download Image
                        </button>
                    </div>
                    <div className={`text-info-container`}>
                        {activeSection === 'prompt' && (
                            <div className={`full-image-prompt ${theme}-theme`}>
                                <button className={`copy-button ${theme}-theme`} onClick={copyPrompt} title="Copy Prompt">
                                    📋
                                </button>
                                <br />
                                <strong>Prompt</strong>
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
