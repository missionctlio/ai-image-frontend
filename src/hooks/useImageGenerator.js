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
            // Get the prompt from the element or use the current state
            const promptElement = document.getElementById('prompt');
            const basePrompt = promptElement ? promptElement.value : prompt;
        
            // Fetch description data
            const descriptionData = await pollForResult(() => generateDescription({ prompt: basePrompt }), 3, 5000);
        
            // Refine the prompt if needed
            const finalPrompt = usePromptRefiner
                ? await pollForResult(() => generateRefinedPrompt({ prompt: basePrompt }), 3, 5000) || basePrompt
                : basePrompt;
        
            // Generate the image
            const { taskId } = await generateImage({ userPrompt: finalPrompt, aspectRatio }, apiKey);
        
            // Poll for the task status
            const imageResult = await pollForResult(() => getTaskStatus(taskId), 100, 5000);
    
            // Check if imageUrl is empty and throw an error if it is
            if (!imageResult.result.imageUrl) {
                throw new Error('Image URL is empty');
            }
        
            // Store and set the image
            const imageData = {
                imageUrl: imageResult.result.imageUrl,
                prompt: basePrompt,
                refinedPrompt: finalPrompt !== basePrompt ? finalPrompt : null,
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

    const copyPrompt = () => {
        const promptElement = document.getElementById('prompt');
        if (promptElement) {
            try {
                navigator.clipboard.writeText(prompt).then(() => {
                    // Set the value of the prompt element
                    promptElement.value = prompt;
                });
            } catch (err) {
                console.error('Failed to copy prompt:', err);
            }
        } else {
            console.error('Prompt element not found');
        }
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
        handleCloseFullImageViewer,
        copyPrompt
    };
};

export default useImageGenerator;
