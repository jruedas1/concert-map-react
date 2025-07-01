import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.js';
import AppProvider from './context/AppProvider.js';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
root.render(
    <AppProvider>
        <App />
    </AppProvider>
);

