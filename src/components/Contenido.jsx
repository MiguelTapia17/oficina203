import "../styles/contenido.css";
import Inicio from "./Inicio";
import Inventario from "./Inventario";
import Historial from "./Historial";
import Usuarios from "./Usuarios";

export default function Contenido({ activeView, loading }) {
  // Renderizamos el componente correspondiente según la vista activa
  const renderView = () => {
    switch (activeView) {
      case "inicio":
        return <Inicio />;
      case "inventario":
        return <Inventario />;
      case "añadirStock":
        return <div>Nuevo Producto</div>; // Este es un ejemplo, puedes reemplazar con el componente real
      case "historial":
        return <Historial />; // Este es un ejemplo, puedes reemplazar con el componente real
      case "usuarios":
        return <Usuarios />; // Este es un ejemplo, puedes reemplazar con el componente real
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="ctnContenido">
      {loading ? (
        // Si estamos en estado de carga, mostramos el loader dentro del contenido
        <div className="loader">
          <div className="box1"></div>
          <div className="box2"></div>
          <div className="box3"></div>
        </div>
      ) : (
        // Si no estamos en carga, mostramos el contenido correspondiente
        renderView()
      )}
    </div>
  );
}
