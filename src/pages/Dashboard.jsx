import "../styles/dashboard.css";
import { useState, useEffect } from "react";
import Menu from "../components/Menu";
import Contenido from "../components/Contenido";
import { useAuth } from "../context/AuthContext";
import { menuConfig } from "../config/menuConfig";

export default function Dashboard() {

  const { user } = useAuth();
  const role = user?.rol?.toLowerCase();
  const menu = menuConfig[role] || [];
  const [activeView, setActiveView] = useState("");
  const [loading, setLoading] = useState(false);

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
        <Menu activeView={activeView} setActiveView={handleViewChange}/>
        <Contenido activeView={activeView} loading={loading}/>
      </div>
    </div>
  );
}