/**
 * Punto de arranque de la aplicación.
 * Aquí se monta React en el DOM y se inyecta el AuthContext
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GlobalDataProvider } from "./context/GlobalDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <GlobalDataProvider>
      <App />
    </GlobalDataProvider>
  </AuthProvider>
);
