
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Nexus SW Registered'))
      .catch(err => console.warn('Nexus SW Registration Failed:', err));
  });
}

const mountApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Nexus Core Critical Mount Error:", error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="color: #6366f1; background: #020617; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: sans-serif;">
          <h1 style="letter-spacing: 5px; font-weight: 900;">CORE FAILURE</h1>
          <p style="opacity: 0.6; font-size: 12px; margin-top: 10px;">${error instanceof Error ? error.message : 'Unknown'}</p>
        </div>
      `;
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
