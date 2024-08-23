import { useState } from 'react';

const useFullImageViewer = (selectedImage, onClose) => {
    const [activeSection, setActiveSection] = useState('prompt');

    const downloadImage = () => {
        fetch(selectedImage.imageUrl)
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
        if (selectedImage && selectedImage.prompt) {
            const promptElement = document.getElementById('prompt');
            if (promptElement) {
                try {
                    navigator.clipboard.writeText(selectedImage.prompt).then(() => {
                        // Set the value of the prompt element
                        promptElement.value = selectedImage.prompt;
                        console.log('Prompt copied to clipboard and set in the element!');
                    });
                } catch (err) {
                    console.error('Failed to copy prompt:', err);
                }
            } else {
                console.error('Prompt element not found');
            }
        } else {
            console.error('Selected image or prompt is not available');
        }
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
