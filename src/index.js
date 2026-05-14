import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './styles/App'; // Ajustado para ler o App dentro da pasta styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
