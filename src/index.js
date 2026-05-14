import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // Apontando para o seu app.js minúsculo

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
