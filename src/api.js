import axios from 'axios';

export const baseUrl = 'http://aesync.servebeer.com:8888';

export const generateImage = async (data, apiKey) => {
    const response = await axios.post(`${baseUrl}/generate-image`, data, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.data;
};

export const getTaskStatus = async (taskId) => {
    const response = await axios.get(`${baseUrl}/task-status/${taskId}`);
    return response.data;
};

export const deleteImages = async (imageIds) => {
    const response = await axios.delete(`${baseUrl}/delete-images/`, {
        data: { image_ids: imageIds }
    });
    return response.data;
};

const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
};

export const createChatWebSocket = (userId) => {
    const wsUrl = `${baseUrl.replace('http', 'ws')}/ws/chat?userId=${userId}`;
    return new WebSocket(wsUrl);
};

// Fetch user data (for checking if the user is logged in)
export const fetchUser = async () => {
    try {
        const response = await axios.get(`${baseUrl}/auth/user`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

// Log out the user
export const logout = async () => {
    try {
        await axios.get(`${baseUrl}/auth/logout`, { withCredentials: true });
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

// Redirect to the Google login page
export const loginWithGoogle = async () => {
    window.location.href = `${baseUrl}/auth/login`;
};
