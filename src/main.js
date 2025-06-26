import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.js';
import { Provider } from "./context/ConcertsContext.js";

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
root.render(
  <Provider>
      <App />
  </Provider>
);

