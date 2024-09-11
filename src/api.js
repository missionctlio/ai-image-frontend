import axios from 'axios';
import { handleLogout } from './hooks/useAuth';
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

        // Log the error response
        console.error('Error response:', {
            url: originalRequest.url,
            method: originalRequest.method,
            status: error.response?.status,
            data: error.response?.data,
        });

        // If the request is for token refresh or the original request has been retried, reject the promise
        if (originalRequest.url.includes('/auth/refresh') || originalRequest._retry) {
            if (error.response?.data?.detail === 'Refresh token missing') {
                console.warn('Refresh token missing. Logging out...');
                localStorage.removeItem('user'); // Remove user info from local storage
                window.location.reload();
                handleLogout(); // Call the logout function
            }
            return Promise.reject(error);
        }

        // If the error is a 401 and the request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            console.info('Attempting to refresh token...');

            try {
                await axiosInstance.post('/auth/refresh');
                console.info('Token refreshed successfully. Retrying original request...');
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', {
                    message: refreshError.message,
                    status: refreshError.response?.status,
                    data: refreshError.response?.data,
                });

                if (refreshError.response?.data?.detail === 'Refresh token missing') {
                    console.warn('Refresh token missing. Logging out...');
                    localStorage.removeItem('user'); // Remove user info from local storage
                    window.location.reload();
                    handleLogout(); // Call the logout function
                }

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


export const deleteChatHistory = async () => {
    try {
        const response = await axiosInstance.delete('/inference/language/delete-chat-history');

        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting chat history:', error.message);
        throw new Error('Failed to delete chat history');
    }
};

// Get queued and running job counts
export const getJobCounts = async () => {
    try {
        const response = await axiosInstance.get(`${baseUrl}/inference/image/jobs/queued`);
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error('Error getting job counts:', error.message);
        throw new Error('Failed to get job counts');
    }
};