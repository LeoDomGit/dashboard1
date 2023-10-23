import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./style.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="161063259833-dumnj31qld4lmbfph52ugelj7hml4a66.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
);

