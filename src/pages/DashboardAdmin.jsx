import "../styles/dashboard.css";
import { useState } from "react";  // Usar useState para manejar la vista activa
import MenuAdmin from "../components/administrador/MenuAdmin";
import Contenido from "../components/Contenido";

export default function DashboardAdmin() {
  const [activeView, setActiveView] = useState("dasboard");  // Por defecto, la vista activa es "Inicio"
  const [loading, setLoading] = useState(false);

  const handleViewChange = (view) => {
    setLoading(true);  // Activamos el loader al cambiar de vista
    setTimeout(() => {
      setActiveView(view);  // Cambia la vista después de un retraso
      setLoading(false);  // Desactivamos el loader después de 1 segundo
    }, 500);  // Simulamos 1 segundo de retraso para cargar la vista
  };

  return (
    <div className="ctnDashboard">
      <div className="dashboard">
        <MenuAdmin activeView={activeView} setActiveView={handleViewChange} />
        <Contenido activeView={activeView} loading={loading} /> {/* Aquí también pasamos loading */}
      </div>
    </div>
  );
}