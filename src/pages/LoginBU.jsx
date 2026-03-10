import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiLogin(usuario, password);
      if (!response?.ok) {
        setToast({
          message: response.message || "Credenciales incorrectas"
        });
        return;
      }
      // { ok:true, data:{ id_admin, usuario, rol, estado } }
      const userData = response.data;
      // Guardado de sesión
      localStorage.setItem("session", "true");
      localStorage.setItem("admin", JSON.stringify(userData));
      // Token fake
      const token = "logged";
      // Guardar en AuthContext
      login(token, userData);
      // 🔹 Todos van al mismo dashboard
      navigate("/dashboard", { replace: true });

    } catch (e) {
      setError("Error de servidor. Intenta de nuevo.");
    }
  };

  return (
    <div className="ctnLogin">
      <form className="login" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="input-field">
          <input required placeholder="" value={usuario} autoComplete="off" onChange={(e) => setUsuario(e.target.value)} />
          <label>Usuario</label>
        </div>

        <div className="input-field">
          <input type="password" required placeholder="" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>Contraseña</label>
        </div>
        <button type="submit">Ingresar</button>
        {error && <p className="errorTxt">{error}</p>}
      </form>
      {toast && (
        <div className="toastSuccess">
          <div className="toastBox">

            <div className="ctnCheck">
              <label className="checkbox-wrapper">
                <input checked type="checkbox" id="check" hidden readOnly />
                <label htmlFor="check" className="checkmark"></label>
              </label>

              <p className="title">Acceso denegado</p>
            </div>

            <p className="toastMessage">
              {toast.message}
            </p>

            <button
              className="toastBtn"
              onClick={() => setToast(null)}
            >
              Entendido
            </button>

          </div>
        </div>
      )}
    </div>
  );
}