import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root for rendering
console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);