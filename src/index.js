import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Ensure the environment variable is available
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) {
  console.error("Google Client ID is missing in environment variables.");
}

const container = document.getElementById('root');
const root = createRoot(container); // Create a root for rendering

root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
