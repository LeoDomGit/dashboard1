import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./style.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="161063259833-6m457hd2uvbjo648ntvvir087udk2og1.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
);

