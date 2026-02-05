
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("Nexus Core Error: Root element not found.");
      return;
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Nexus Core: UI Mounted Successfully.");
  } catch (error) {
    console.error("Nexus Core Critical Mount Error:", error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `<div style="color: #ef4444; padding: 20px; font-family: sans-serif; text-align: center; background: #020617; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Core Initialization Failed</h1>
        <p style="font-size: 12px; opacity: 0.7; max-width: 400px; line-height: 1.6;">${error instanceof Error ? error.message : 'Unknown link error'}</p>
        <p style="font-size: 10px; margin-top: 20px; color: #4f46e5;">Check browser console for details</p>
      </div>`;
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
