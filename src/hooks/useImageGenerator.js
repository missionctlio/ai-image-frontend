import { useState, useEffect } from 'react';
import { generateImage, getTaskStatus } from '../api';

const useImageGenerator = (apiKey) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [usePromptRefiner, setUsePromptRefiner] = useState(true);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem('images')) || [];
        setImages(storedImages.reverse());
    }, []);

    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem('images')) || [];
        setImages(storedImages.reverse());
    }, [selectedImage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { taskId } = await generateImage({ prompt, aspectRatio, usePromptRefiner }, apiKey);
            pollTaskStatus(taskId);
        } catch (error) {
            alert('Error generating image. Please try again.');
            setLoading(false);
        }
    };

    const pollTaskStatus = async (taskId, retryCount = 0) => {
        const maxRetries = 3;
        const maxPollDuration = 10 * 60 * 1000; // 10 minutes
        const retryDelay = 5000; // 5 seconds

        try {
            const { status, result } = await getTaskStatus(taskId);

            if (status === 'SUCCESS') {
                const { imageUrl, description, refinedPrompt } = result;
                const imageData = {
                    imageUrl,
                    prompt,
                    description,
                    refinedPrompt,
                    aspectRatio
                };

                const storedImages = JSON.parse(localStorage.getItem('images')) || [];
                storedImages.push(imageData);
                setSelectedImage(imageData); // Set the selected image to view
                localStorage.setItem('images', JSON.stringify(storedImages));

                setImages(storedImages.reverse());
                setLoading(false);
            } else if (status === 'PENDING') {
                if (retryCount * retryDelay < maxPollDuration) {
                    setTimeout(() => pollTaskStatus(taskId, retryCount + 1), retryDelay);
                } else {
                    alert('Polling timed out. Please try again later.');
                    setLoading(false);
                }
            } else if (retryCount < maxRetries) {
                setTimeout(() => pollTaskStatus(taskId, retryCount + 1), retryDelay);
            } else {
                alert(`Error: ${result}. Max retries reached.`);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while checking task status.');
            setLoading(false);
        }
    };

    const handleCloseFullImageViewer = () => {
        setSelectedImage(null); // Close the FullImageViewer
    };

    return {
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
    };
};

export default useImageGenerator;
