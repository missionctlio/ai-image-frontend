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

// Function for chat endpoint with streaming support via POST
export const chatStream = (query, userId, onMessage) => {
    const escapedQuery = escapeHtml(query);
    const body = JSON.stringify({ query: escapedQuery, userId });

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body,
        signal,
    })
    .then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        return reader.read().then(function processText({ done, value }) {
            if (done) {
                return;
            }
            const chunk = decoder.decode(value, { stream: true });
            onMessage(chunk);

            return reader.read().then(processText);
        });
    })
    .catch(error => {
        console.error('Error with chat stream:', error);
    });

    return () => controller.abort(); // Return a function to abort the request
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
