import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Mengimpor komponen utama App.js

// Mencari elemen div dengan id="root" di index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Me-render seluruh aplikasi ke dalam elemen tersebut
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);