import { useState, useEffect } from 'react';
import { generateImage, getTaskStatus, generateRefinedPrompt, generateDescription, getJobCounts } from '../api';

const useImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [usePromptRefiner, setUsePromptRefiner] = useState(true);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [queuedJobs, setQueuedJobs] = useState(0); // To track queued jobs
    const [runningJobs, setRunningJobs] = useState(0); // To track running jobs

    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem('images')) || [];
        setImages(storedImages.reverse());
    }, []);

    useEffect(() => {
        const fetchJobCounts = async () => {
            try {
                const { queued_jobs, running_jobs } = await getJobCounts();
                setQueuedJobs(queued_jobs);
                setRunningJobs(running_jobs);
            } catch (error) {
                console.error('Failed to fetch job counts:', error);
            }
        };

        fetchJobCounts(); // Fetch immediately on mount

        const intervalId = setInterval(fetchJobCounts, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Clear interval on unmount
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const basePrompt = prompt;

            // Fetch description
            const descriptionData = await pollForResult(() => generateDescription({ prompt: basePrompt }), 3, 5000);

            // Refine prompt if needed
            const finalPrompt = usePromptRefiner
                ? await pollForResult(() => generateRefinedPrompt({ prompt: basePrompt }), 3, 5000) || basePrompt
                : basePrompt;

            // Generate image
            const { taskId } = await generateImage({ userPrompt: finalPrompt, aspectRatio });
            setQueuedJobs(prev => prev + 1); // Increment queued job count

            // Poll for task status
            const imageResult = await pollForResult(() => getTaskStatus(taskId), 100, 5000);

            if (!imageResult.result.imageUrl) {
                throw new Error('Image URL is empty');
            }

            // Store image
            const imageData = {
                imageUrl: imageResult.result.imageUrl,
                prompt: basePrompt,
                refinedPrompt: finalPrompt !== basePrompt ? finalPrompt : null,
                description: descriptionData,
                aspectRatio: aspectRatio,
            };

            storeImage(imageData);
            setSelectedImage(imageData);
            setQueuedJobs(prev => prev - 1); // Decrement queued job count after completion
        } catch (error) {
            console.error('Error during image generation:', error);
            alert('Error during the process. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pollForResult = async (apiCall, maxRetries = 3, pollInterval = 5000) => {
        let retryCount = 0;
        while (retryCount < maxRetries) {
            const response = await apiCall();
            if (response && response.status !== 'PENDING') {
                return response;
            }
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            retryCount++;
        }
        throw new Error('Polling timed out');
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
        handleCloseFullImageViewer,
        queuedJobs, // Exposing the queued job count
        runningJobs, // Exposing the running job count
    };
};

export default useImageGenerator;
