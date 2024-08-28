import axios from 'axios';

// Base URL for API
export const baseUrl = 'https://dev.aesync.com';

// Function to get an Axios instance with the authorization token
const getAxiosInstance = () => {
    const token = localStorage.getItem('authToken');
    return axios.create({
        baseURL: baseUrl,
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    });
};

// API functions that use the authorization token

export const generateDescription = async (userPrompt) => {
    try {
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.post('/inference/language/generate-description', 
            { userPrompt: userPrompt.prompt }
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

export const generateRefinedPrompt = async (userPrompt) => {
    try {
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.post('/inference/language/generate-refined-prompt', 
            { userPrompt: userPrompt.prompt }
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

export const generateImage = async (data) => {
    try {
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.post('/inference/image/generate-image', data);

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
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.get(`/inference/image/task-status/${taskId}`);

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
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.delete('/inference/image/delete-images/', 
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


// Function to create and return a WebSocket instance
export const createChatWebSocket = () => {
    const wsUrl = `${baseUrl.replace(/^https/, 'wss')}/inference/language/ws/chat`;
    const ws = new WebSocket(wsUrl);
    return ws;
};
export const fetchUser = async () => {
    try {
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.get('/auth/user', { withCredentials: true });

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
        const axiosInstance = getAxiosInstance();
        await axiosInstance.get('/auth/logout', { withCredentials: true });
    } catch (error) {
        console.error('Error logging out:', error.message);
    }
};

export const loginWithGoogle = async () => {
    window.location.href = `${baseUrl}/auth/login`;
};

// New function to verify the Google ID token with the backend
export const verifyGoogleToken = async (idToken) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/token`, {
            access_token: idToken,
        });

        if (response.status === 200 && response.data) {
            const { userInfo, accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            return {
                userInfo: userInfo
            };
        } else {
            throw new Error(`Token verification failed with status code ${response.status}`);
        }
    } catch (error) {
        // Check if the error indicates token expiration
        if (error.response && error.response.status === 401 && error.response.data === 'Token has expired') {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            try {
                // Request a new access token using the refresh token
                const refreshResponse = await axios.post(`${baseUrl}/auth/refresh`, {
                    refresh_token: refreshToken,
                });

                if (refreshResponse.status === 200 && refreshResponse.data) {
                    const { userInfo } = refreshResponse.data;

                    // Save the new tokens in local storage
                    localStorage.setItem('authToken', access_token);

                    return {
                        userInfo: userInfo
                    };
                } else {
                    throw new Error(`Refresh token request failed with status code ${refreshResponse.status}`);
                }
            } catch (refreshError) {
                console.error('Refresh token request failed:', refreshError.message);
                throw new Error('Unable to refresh token');
            }
        } else {
            console.error('Token verification failed:', error.message);
            throw new Error('Token verification failed');
        }
    }
};