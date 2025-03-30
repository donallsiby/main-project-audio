import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // This line must be present

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);