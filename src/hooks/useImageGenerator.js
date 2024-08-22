import { useState, useEffect } from 'react';
import { generateImage, getTaskStatus, generateRefinedPrompt, generateDescription } from '../api';

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
            // Fetch description data
            const descriptionData = await pollForResult(() => generateDescription({ prompt }), 3, 5000);
            let refinedPromptData = "";
            let usedPrompt = "";
            
            // Fetch refined prompt if needed
            if (usePromptRefiner) {
                refinedPromptData = await pollForResult(() => generateRefinedPrompt({ prompt }), 3, 5000);
                usedPrompt = refinedPromptData;
            } else {
                usedPrompt = prompt;
            }

            // Generate the image
            const { taskId } = await generateImage({ userPrompt: usedPrompt, aspectRatio }, apiKey);
            
            // Poll for the task status
            const imageResult = await pollForResult(() => getTaskStatus(taskId), 100, 5000);

            // Store and set the image
            const imageData = {
                imageUrl: imageResult.result.imageUrl,
                prompt: usedPrompt,
                description: descriptionData,
                aspectRatio: aspectRatio
            };

            storeImage(imageData);
            setSelectedImage(imageData);
        } catch (error) {
            console.error('Error during image generation:', error);
            alert('Error during the process. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const pollForResult = async (apiCall, maxRetries = 3, pollInterval = 5000) => {
        let retryCount = 0;
        const startTime = Date.now();
    
        while (true) {  // Infinite loop will be broken by condition checks inside
            try {
                const response = await apiCall();
                console.log(JSON.stringify(response));
    
                // Check if the response status is 200 and if the task is not pending
                if (response && response.status === 'PENDING') {
                    // Wait for the exponential backoff delay before retrying
                    await new Promise(resolve => setTimeout(resolve, pollInterval));
                    retryCount += 1;
    
                    // Check if the maximum polling duration has been reached
                    if (Date.now() - startTime > pollInterval * maxRetries) {
                        throw new Error('Polling timed out');
                    }
                } else if(response) {
                    return response;
                }
                else {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
            } catch (error) {
                console.error('Polling error:', error.message);
                retryCount += 1;
                if (retryCount >= maxRetries) {
                    throw new Error('Max retries reached');
                }
            }
        }
    };
    

    const storeImage = (imageData) => {
        const storedImages = JSON.parse(localStorage.getItem('images')) || [];
        storedImages.push(imageData);
        localStorage.setItem('images', JSON.stringify(storedImages.reverse()));
        setImages(storedImages);
    };

    const handleCloseFullImageViewer = () => {
        setSelectedImage(null);
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
