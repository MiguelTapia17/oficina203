import { SVG, IMAGES } from "../assets/imgSvg";
import '../styles/menu.css';
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { apiGet } from "../services/api";

export default function Menu({ activeView, setActiveView }) {
  const [isDark, setIsDark] = useState(false);
  const { logout } = useAuth();
  const [dashboardActive, setDashboardActive] = useState(false);
  const [usuario, setUsuario] = useState({ nombre_completo: "", rol: "" });  // Estado para el usuario actual

  // Llamar a la API para obtener la info del usuario
  // useEffect(() => {
  //   const fetchUsuario = async () => {
  //     try {
  //       const response = await apiGet("usuarios/me"); // Ajusta el endpoint correcto
  //       console.log("API Response:", response);  // Verifica lo que devuelve tu API

  //       // Asegúrate de que la respuesta tenga la estructura correcta
  //       if (response && response.data) {
  //         const { nombre_completo, rol } = response.data;
  //         setUsuario({ nombre_completo, rol });
  //       } else {
  //         console.error("Respuesta no válida de la API");
  //       }
  //     } catch (error) {
  //       console.error("No se pudo cargar el usuario:", error);
  //     }
  //   };
  //   fetchUsuario();
  // }, []);


  const handleViewChange = (view) => {
    setActiveView(view);  // Cambia la vista activa cuando se hace clic en un botón
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;

      // Cambia el "root" sin romper tu app
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");

      return next;
    });
  };

  return (
    <div className="ctnMenu">
      <img src={IMAGES.logoNegro} className="logo" />
      <div className="ctnBotones">
        <button className={activeView === "inicio" ? "active" : ""} onClick={() => handleViewChange("inicio")}>
          <SVG.Dashboard className="icon" /> Inicio
        </button>
        <button className={activeView === "inventario" ? "active" : ""} onClick={() => handleViewChange("inventario")}>
          <SVG.Box className="icon" /> Inventario
        </button>
        <button className={activeView === "añadirStock" ? "active" : ""} onClick={() => handleViewChange("añadirStock")}>
          <SVG.BoxAdd className="icon" /> Nuevo Producto
        </button>
        <button className={activeView === "historial" ? "active" : ""} onClick={() => handleViewChange("historial")}>
          <SVG.History className="icon" /> Historial de movimientos
        </button>
        <button id="btnTheme" type="button" onClick={toggleTheme}>
          <span className="themeToggle st-sunMoonThemeToggleBtn">
            <input id="themeToggle" className="themeToggleInput" type="checkbox" checked={isDark} readOnly />
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <mask id="moon-mask">
                <rect width="20" height="20" fill="white" />
                <circle cx="11" cy="3" r="8" fill="black" />
              </mask>
              <circle className="sunMoon" cx="10" cy="10" r="8" mask="url(#moon-mask)" />
              <g>
                <circle className="sunRay sunRay1" cx="18" cy="10" r="1.5" />
                <circle className="sunRay sunRay2" cx="14" cy="16.928" r="1.5" />
                <circle className="sunRay sunRay3" cx="6" cy="16.928" r="1.5" />
                <circle className="sunRay sunRay4" cx="2" cy="10" r="1.5" />
                <circle className="sunRay sunRay5" cx="6" cy="3.1718" r="1.5" />
                <circle className="sunRay sunRay6" cx="14" cy="3.1718" r="1.5" />
              </g>
            </svg>
          </span>
          Tema
        </button>
        
        <button className="exit" onClick={logout}>
          <SVG.Logout className="icon" /> Cerrar sesión
        </button>
      </div>
      <div className="ctnBotones dos">
        <div className="ctnUsuario">
          <SVG.User className="iconUser"/>
          <div className="ctnTxt">
            {/* <p>{usuario.nombre_completo}</p> */}
            {/* <span>{usuario.rol}</span> */}
            <p className="name">Usario Principal</p>
            <p className="rol">Cargo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
