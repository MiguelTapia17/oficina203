import "../styles/login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SVG, IMAGES } from "../assets/imgSvg";
import Toast from "../components/Toast";


export default function Login() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [toast, setToast] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // Cuando el toast cambia, esperamos un poco y activamos la animación
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setIsAnimating(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [toast]);

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
  /* BACKGROUND */
  function InfiniteText({ text, bold }) {
    const repeat = 6;

    // Generamos los spans
    const items = Array.from({ length: repeat }, (_, i) => (
      <span key={i}>{text}</span>
    ));

    return (
      <div className={`fila ${bold ? "txtBold" : "txtMedium"}`}>
        <div className="track">
          {items}
          {items} 
          {items}
          {items} 
          {items}
          {items} 
        </div>
      </div>
    );
  }
  return (
    <div className="ctnLogin">
      <div className="letrasBG">
        <div className="scrollWrap">
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
          <InfiniteText text="Desarrollo" bold />
          <InfiniteText text="Cayetano" />
        </div>
      </div>
      <form className="login" onSubmit={handleLogin}>
        {/* <h2>Login</h2> */}
        <img src={IMAGES.LogoNegro} alt="Logo" className="logo"/>
        <div className="input-field">
          <input required placeholder="" value={usuario} autoComplete="off" onChange={(e) => setUsuario(e.target.value)} />
          <label>Usuario</label>
        </div>

        <div className="input-field">
          <input type="password" required placeholder="" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>Contraseña</label>
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {toast && (
        <Toast
          type="error"
          title="Acceso denegado"
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}