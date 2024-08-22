import { useState } from 'react';
import { baseUrl } from '../api';

const useFullImageViewer = (image, onClose) => {
    const [activeSection, setActiveSection] = useState('prompt');

    const downloadImage = () => {
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

    const copyPrompt = () => {
        document.getElementById('prompt').value = image.prompt;
        onClose(); // Close the overlay
    };

    const toggleSection = (section) => {
        setActiveSection(prev => prev === section ? null : section);
    };

    return {
        activeSection,
        toggleSection,
        downloadImage,
        copyPrompt
    };
};

export default useFullImageViewer;
