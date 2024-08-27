// tokenManager.js

// Initialize authToken from localStorage if available
let authToken = localStorage.getItem('authToken') || null;

export const setAuthToken = (token) => {
    authToken = token;
};

export const getAuthToken = () => authToken;
