import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAsesor from "./pages/DashboardAsesor";
import DashboardViewer from "./pages/DashboardViewer";

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

        {/* SUPER ADMIN */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RequireRole allow={["superadmin"]}>
                <Dashboard />
              </RequireRole>
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/dashboardAdmin"
          element={
            <PrivateRoute>
              <RequireRole allow={["admin"]}>
                <DashboardAdmin />
              </RequireRole>
            </PrivateRoute>
          }
        />

        {/* ASESOR */}
        <Route
          path="/dashboardAsesor"
          element={
            <PrivateRoute>
              <RequireRole allow={["asesor"]}>
                <DashboardAsesor />
              </RequireRole>
            </PrivateRoute>
          }
        />

        {/* VIEWER */}
        <Route
          path="/dashboardViewer"
          element={
            <PrivateRoute>
              <RequireRole allow={["asesor"]}>
                <DashboardViewer />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}