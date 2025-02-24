import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Optional imports for React Router feature flags, only if applicable
// Uncomment these if you plan to test with future React Router features
// import { unstable_EnableV7_startTransition, unstable_EnableV7_relativeSplatPath } from 'react-router-dom';

// Enable feature flags for future React Router changes if needed
// unstable_EnableV7_startTransition();
// unstable_EnableV7_relativeSplatPath();

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);