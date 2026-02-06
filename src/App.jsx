import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardCounter from "./pages/DashboardCounter";
import { useAuth } from "./context/AuthContext";
import RequireRole from "./components/RequireRole";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = String(user?.rol || "").toLowerCase();
  if (role === "superadmin") return <Navigate to="/dashboard" replace />;

  return <Navigate to="/dashboard-counter" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />

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

        <Route
          path="/dashboard-counter"
          element={
            <PrivateRoute>
              <RequireRole allow={["counter", "usuario", "user"]}>
                <DashboardCounter />
              </RequireRole>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
