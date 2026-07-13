import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/Home.css";
import { MessageProvider } from "./context/MessageContext.jsx";
import { ToastProvider } from "./components/ToastProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </ToastProvider>
  </React.StrictMode>
);
