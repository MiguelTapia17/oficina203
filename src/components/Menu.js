import { SVG, IMAGES } from "../assets/imgSvg";
import '../styles/menu.css'
import { useAuth } from "../context/AuthContext";

export default function Menu() {
  const { logout } = useAuth();

  return (
    <div className="ctnMenu">
      <img src={IMAGES.logoNegro} className='logo'/>
      <div className='ctnBotones'>
        <button> <SVG.Dashboard className="icon"/> Inicio</button>
        <button className="active"> <SVG.Box className="icon"/> Inventario</button>
        <button> <SVG.BoxAdd className="icon"/> Añadir Stock</button>
        <button> <SVG.BoxEdit className="icon"/> Editar Stock</button>
        <button> <SVG.History className="icon"/> Historial de movimientos</button>
      </div>
      <div className="ctnBotones">
        <button>
          <SVG.Tema className="icon"/>
          Tema
          <label class="switch">
            <input type="checkbox"/>
            <span class="slider"></span>
          </label>
        </button>
      <button className='exit' onClick={logout}><SVG.Logout className="icon"/> Cerrar sesión</button>
      </div>

    </div>
  );
}
