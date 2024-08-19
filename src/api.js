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

// New function for generate_query endpoint
export const chat = async (query, userId) => {
    const escapedQuery = escapeHtml(query);
    const response = await axios.post(`${baseUrl}/chat`, { query: escapedQuery, userId });
    return response.data;
};
