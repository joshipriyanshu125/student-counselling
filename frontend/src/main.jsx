import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#FFFFFF",
            color: "#1E293B",
            border: "1px solid #E2E8F0"
          }
        }}
      />

      <App />
    </BrowserRouter>
  </React.StrictMode>
);