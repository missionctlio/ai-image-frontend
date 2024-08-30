import axios from 'axios';

// Base URL for API
export const baseUrl = 'https://dev.aesync.com';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true // Include credentials (cookies) in requests
});

// Axios response interceptor to handle token expiration and refreshing
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If the request failed due to an expired token, try refreshing the token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await axiosInstance.post('/auth/refresh', null, { withCredentials: true });
                
                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError.message);
                // Optional: redirect to login or handle unauthorized state
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API functions that use the authorization token

export const generateDescription = async (userPrompt) => {
    try {
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

// WebSocket connection with cookie-based authentication
export const createChatWebSocket = (accessToken) => {
    const wsUrl = `${baseUrl.replace(/^https/, 'wss')}/inference/language/ws/chat?access_token=${encodeURIComponent(accessToken)}`;
    const ws = new WebSocket(wsUrl);
    return ws;
};
// User management functions

export const fetchUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/user');

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
        await axiosInstance.get('/auth/logout');
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
        }, { withCredentials: true });

        if (response.status === 200 && response.data) {
            const { userInfo, accessToken } = response.data;
            console.log('User info:', userInfo);
            console.log('Access token:', accessToken);
            // Store the access token in localStorage
            localStorage.setItem('accessToken', accessToken);
            
            return {
                userInfo, accessToken
            };
        } else {
            throw new Error(`Token verification failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Token verification failed:', error.message);
        throw new Error('Token verification failed');
    }
};
