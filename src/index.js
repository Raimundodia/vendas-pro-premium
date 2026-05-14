import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Procura o App.js na mesma pasta src

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
