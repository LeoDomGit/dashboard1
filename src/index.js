import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./style.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="161063259833-km3lacfirtot8vsai91a6c8l18sg2f90.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
);

