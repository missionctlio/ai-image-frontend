import axios from 'axios';

export const baseUrl = 'http://aesync.servebeer.com:8888';

export const generateDescription = async (userPrompt, apiKey) => {
    try {
        const response = await axios.post(`${baseUrl}/inference/language/generate-description`, 
            { userPrompt: userPrompt.prompt }, 
            { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );

        if (response.status === 200 && response.data && response.data.description) {
            return response.data.description;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error generating description:', error.message);
        throw new Error('Failed to generate description');
    }
};

export const generateRefinedPrompt = async (userPrompt, apiKey) => {
    try {
        const response = await axios.post(`${baseUrl}/inference/language/generate-refined-prompt`, 
            { userPrompt: userPrompt.prompt }, 
            { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );

        if (response.status === 200 && response.data && response.data.refinedPrompt) {
            return response.data.refinedPrompt;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error generating refined prompt:', error.message);
        throw new Error('Failed to generate refined prompt');
    }
};

export const generateImage = async (data, apiKey) => {
    try {
        const response = await axios.post(`${baseUrl}/inference/image/generate-image`, data, 
            { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );

        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error generating image:', error.message);
        throw new Error('Failed to generate image');
    }
};

export const getTaskStatus = async (taskId) => {
    try {
        const response = await axios.get(`${baseUrl}/inference/image/task-status/${taskId}`);

        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching task status:', error.message);
        throw new Error('Failed to fetch task status');
    }
};

export const deleteImages = async (imageIds) => {
    try {
        const response = await axios.delete(`${baseUrl}/inference/image/delete-images/`, 
            { data: { image_ids: imageIds } }
        );

        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting images:', error.message);
        throw new Error('Failed to delete images');
    }
};

export const createChatWebSocket = (userId) => {
    const wsUrl = `${baseUrl.replace('http', 'ws')}/inference/language/ws/chat?userId=${userId}`;
    return new WebSocket(wsUrl);
};

export const fetchUser = async () => {
    try {
        const response = await axios.get(`${baseUrl}/auth/user`, { withCredentials: true });
        
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        return null;
    }
};

export const logout = async () => {
    try {
        await axios.get(`${baseUrl}/auth/logout`, { withCredentials: true });
    } catch (error) {
        console.error('Error logging out:', error.message);
    }
};

export const loginWithGoogle = async () => {
    window.location.href = `${baseUrl}/auth/login`;
};
