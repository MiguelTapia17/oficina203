import "../styles/contenido.css";
import Inicio from "./Inicio";
import Inventario from "./InventarioBU";
import Historial from "./Historial";
import Gestion from "./Gestion";
import GestionarUsuarios from "./GestionarUsuarios";
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
      case "gestion":
        return <Gestion />;
      case "gestionarUsuarios":
        return <GestionarUsuarios />;
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