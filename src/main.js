import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.js';
import { Provider as ConcertsProvider } from "./context/ConcertsContext.js";
import { Provider as GenresProvider } from "./context/GenresContext.js";

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
root.render(
  <ConcertsProvider>
      <GenresProvider>
          <App />
      </GenresProvider>
  </ConcertsProvider>
);

