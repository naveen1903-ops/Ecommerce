import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './App.css';

// Restore a route passed through the GitHub Pages 404 fallback before Router starts.
const redirectPath = new URLSearchParams(window.location.search).get('p');
if (redirectPath && redirectPath.startsWith('/') && !redirectPath.startsWith('//')) {
  const basePrefix = import.meta.env.BASE_URL === '/'
    ? ''
    : import.meta.env.BASE_URL.replace(/\/$/, '');
  window.history.replaceState(null, '', `${basePrefix}${redirectPath}`);
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Service workers are enabled in production builds to avoid stale files during development.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // The app remains usable when a browser blocks service-worker registration.
    });
  });
}
