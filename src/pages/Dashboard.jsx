import "../styles/dashboard.css";
import "../styles/responsive.css";
import { useState, useEffect } from "react";
import Menu from "../components/Menu";
import Contenido from "../components/Contenido";
import { useAuth } from "../context/AuthContext";
import { SVG, IMAGES } from "../assets/imgSvg";
import { menuConfig } from "../config/menuConfig";

export default function Dashboard() {

  const { user } = useAuth();
  const role = user?.rol?.toLowerCase();
  const menu = menuConfig[role] || [];
  const [activeView, setActiveView] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 👇 detecta el primer módulo habilitado
  useEffect(() => {
    if (menu.length > 0) {
      setActiveView(menu[0].key);
    }
  }, [role]);

  const handleViewChange = (view) => {
    setLoading(true);

    setTimeout(() => {
      setActiveView(view);
      setLoading(false);
    }, 500);
  };
  return (
    <div className="ctnDashboard">
      <div className="dashboard">
        {/* <Menu activeView={activeView} setActiveView={handleViewChange}/> */}
        <Menu activeView={activeView}  setActiveView={handleViewChange} menuOpen={menuOpen}/>
        <Contenido activeView={activeView} loading={loading}/>
        
        <label className="hamburger">
          <input 
            type="checkbox"
            onChange={(e) => setMenuOpen(e.target.checked)}
          />
          <svg viewBox="0 0 32 32">
            <path
              className="line line-top-bottom"
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            />
            <path className="line" d="M7 16 27 16" />
          </svg>
        </label>
      </div>
      
      {/* <SVG.Escudo/> */}
      <div className="logo escudoOndas">
        <svg viewBox="-120 -120 770 980" preserveAspectRatio="xMidYMid meet">
          <defs>
            <path
              id="escudo"
              d="M265.2,744.11s-151.42-73.37-212.35-171.76C-2.47,480.39.11,388.89.08,340.5c0,0,0-214.81,0-310.62C136.41-.98,265.2.6,265.2.6c0,0,128.8-1.58,265.12,29.28,0,95.81,0,310.62,0,310.62-.03,48.38,2.54,139.89-52.77,231.85-60.93,98.4-212.35,171.76-212.35,171.76Z"
            />
          </defs>
          <g className="ondas">
            {[...Array(16)].map((_, i) => (
              <use key={i} href="#escudo" className="ondaEstatica" style={{ transform: `scale(${1 + i * 0.15})` }} />
            ))}
          </g>
          <use href="#escudo" className="escudoBase" />
        </svg>
      </div>
    </div>
  );
}

