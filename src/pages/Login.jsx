import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // 👈 importante al usar form
    setError("");

    try {
      const response = await apiLogin(usuario, password);

      if (!response?.ok) {
        setError("Credenciales incorrectas");
        return;
      }

      // { ok:true, data:{ id_admin, usuario, rol, estado } }
      const userData = response.data;

      // Mantienes compatibilidad con lo que ya usabas
      localStorage.setItem("session", "true");
      localStorage.setItem("admin", JSON.stringify(userData));

      // Token fake (tu backend no devuelve JWT)
      const token = "logged";
      login(token, userData);

      // Redirección por rol
      const role = String(userData?.rol || "").toLowerCase();
      if (role === "superadmin") navigate("/dashboard", { replace: true });
      else navigate("/dashboard-counter", { replace: true });

    } catch (e) {
      setError("Error de servidor. Intenta de nuevo.");
    }
  };

  return (
    <div className="ctnLogin">
      {/* 👇 ahora es FORM, mismas clases */}
      <form className="login" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="input-field">
          <input
            required
            placeholder=""
            value={usuario}
            autoComplete="off"
            onChange={(e) => setUsuario(e.target.value)}
          />
          <label>Usuario</label>
        </div>

        <div className="input-field">
          <input
            type="password"
            required
            placeholder=""
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Contraseña</label>
        </div>

        {/* 👇 botón submit */}
        <button type="submit">Ingresar</button>

        {error && <p className="errorTxt">{error}</p>}
      </form>
    </div>
  );
}
