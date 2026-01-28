import '../styles/login.css'
// import { SVG, IMAGES } from "../assets/imgSvg";
// import { SVG } from "../assets/imgSvg";

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

  const handleLogin = async () => {
    setError("");

    const response = await apiLogin(usuario, password);

    if (!response.ok) {
      setError("Credenciales incorrectas");
      return;
    }

    // ✅ AQUÍ VA (cuando el login ya es correcto)
    localStorage.setItem("session", "true");
    localStorage.setItem("admin", JSON.stringify(response.data));

    // Flag simple para AuthContext
    const token = "logged";
    login(token);

    navigate("/dashboard");
  };

  return (
    <div className='ctnLogin'>
      <div className="login">
        <h2>Login</h2>
        <div className='input-field'>
          <input required placeholder="" value={usuario} autocomplete="off" onChange={(e) => setUsuario(e.target.value)}/>
          <label>Usuario</label>
        </div>
        <div className='input-field'>
          <input type="password" required placeholder="" autocomplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>Contraseña</label>
        </div>
        <button onClick={handleLogin}>Ingresar</button>
        {error && <p className='errorTxt'>{error}</p>}
      </div>      
    </div>

  );
}
