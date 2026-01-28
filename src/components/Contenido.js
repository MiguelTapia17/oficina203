import '../styles/contenido.css';
import Inicio from "../components/Inicio";
import Inventario from '../components/Inventario';

export default function Contenido() {

  return (
    <div className="ctnContenido">
      {/* <Inicio/> */}
      <Inventario/>
    </div>
  );
}
