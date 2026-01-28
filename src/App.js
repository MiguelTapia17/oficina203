import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace /> }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
/*
App.js: decide qué se ve primero (Login o Dashboard)
AuthContext: guarda si el usuario está logueado
Login.js: hace la consulta /login
Dashboard.js: muestra la app ya logueado
api.js: todas las llamadas a la API (una sola fuente)
Menu / Contenido: UI, no lógica*/