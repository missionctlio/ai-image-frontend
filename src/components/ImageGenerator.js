import React, { useState, useEffect } from 'react';
import { generateImage, getTaskStatus } from '../api';
import ThemeSelector from './ThemeSelector'; // Assuming this is a separate component for the theme selector
import useSaveToLocalStorage from '../hooks/useSaveToLocalStorage'; // Adjust path as necessary
import { baseUrl } from '../api';
import Thumbnails from './Thumbnails'; // Import the Thumbnails component

const ImageGenerator = ({ theme, setTheme }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [usePromptRefiner, setUsePromptRefiner] = useState(true);
    const [loading, setLoading] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [images, setImages] = useState([]);
    const [apiKey, setApiKey] = useState('your-api-key-here');

    const { saveToLocalStorage } = useSaveToLocalStorage();

    // Load images from local storage on initial render
    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem('images')) || [];
        setImages(storedImages);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { task_id } = await generateImage({ prompt, aspectRatio, usePromptRefiner }, apiKey);
            setTaskId(task_id);
            pollTaskStatus(task_id);
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
                // Save the generated image to local storage
                const { imageUrl, description, refinedPrompt } = result;

                const imageData = {
                    imageUrl: imageUrl,
                    prompt: prompt,
                    description: description,
                    refinedPrompt: refinedPrompt,
                    aspectRatio: aspectRatio
                };

                // Update local storage
                const storedImages = JSON.parse(localStorage.getItem('images')) || [];
                storedImages.push(imageData);
                localStorage.setItem('images', JSON.stringify(storedImages));

                // Update state
                setImages(storedImages);
                setTaskId(null);
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

    return (
        <div className="container">
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <h1>Generate Images</h1>
            <form id="promptForm" className="form-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="prompt"
                    name="prompt"
                    autoComplete="off"
                    className="theme-selector"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    placeholder="What would you like to see?"
                />
                <div className="form-controls">
                    <select
                        id="aspectRatio"
                        name="aspectRatio"
                        className="dropdown-button theme-selector"
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                    >
                        <option value="1:1">1:1</option>
                        <option value="3:2">3:2</option>
                        <option value="4:3">4:3</option>
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
                        <label htmlFor="usePromptRefiner" className="toggle-label theme-selector">
                            <span className="toggle-slider">
                                <span className="toggle-text">Prompt Refiner</span>
                            </span>
                        </label>
                    </div>
                    <button className="theme-selector" type="submit" disabled={loading}>
                        <span className="button-text">
                            {loading ? '' : 'Generate'}
                        </span>
                        {loading && (
                            <div className="loading-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        )}
                    </button>
                </div>
            </form>
            <div className="button-container">
            </div>
            <Thumbnails images={images} /> {/* Pass images as a prop */}
        </div>
    );
};

export default ImageGenerator;
