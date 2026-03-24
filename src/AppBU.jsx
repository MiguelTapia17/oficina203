import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { useAuth } from "./context/AuthContext";
import RequireRole from "./components/RequireRole";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        {/* DASHBOARD PARA TODOS LOS ROLES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RequireRole allow={["superadmin", "admin", "asesor", "viewer"]}>
                <Dashboard />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}