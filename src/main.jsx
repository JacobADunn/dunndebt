import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { FinanceProvider } from "./context/FinanceContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <FinanceProvider>
          <App />
        </FinanceProvider>
    </AuthProvider>
  </React.StrictMode>
);
