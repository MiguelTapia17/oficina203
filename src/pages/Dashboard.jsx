import "../styles/dashboard.css";
import { useState } from "react";  // Usar useState para manejar la vista activa
import Menu from "../components/Menu";
import Contenido from "../components/Contenido";

export default function Dashboard() {
  // Estado para manejar la vista activa
  const [activeView, setActiveView] = useState("inicio");  // Por defecto, la vista activa es "Inicio"
  const [loading, setLoading] = useState(false);  // Estado para manejar el loading

  const handleViewChange = (view) => {
    setLoading(true);  // Activamos el loader al cambiar de vista
    setTimeout(() => {
      setActiveView(view);  // Cambia la vista después de un retraso
      setLoading(false);  // Desactivamos el loader después de 1 segundo
    }, 1000);  // Simulamos 1 segundo de retraso para cargar la vista
  };

  return (
    <div className="ctnDashboard">
      <div className="dashboard">
        <Menu activeView={activeView} setActiveView={handleViewChange} />
        <Contenido activeView={activeView} loading={loading} /> {/* Aquí también pasamos loading */}
      </div>
    </div>
  );
}