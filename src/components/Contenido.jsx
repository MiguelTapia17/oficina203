import "../styles/contenido.css";
import Inicio from "./Inicio";
import Inventario from "./Inventario";
import Historial from "./Historial";
import Usuarios from "./Usuarios";
import ImportItems from "./ImportItems";
import Loader from "./Loader";

export default function Contenido({ activeView, loading }) {
  const renderView = () => {
    switch (activeView) {
      case "inicio":
        return <Inicio />;
      case "inventario":
        return <Inventario />;
      case "añadirStock":
        return <div>Nuevo Producto</div>;
      case "historial":
        return <Historial />;
      case "usuarios":
        return <Usuarios />;
      case "importItems":
        return <ImportItems />;
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="ctnContenido">
      {loading ? <Loader /> : renderView()}
    </div>
  );
}