import { SVG, IMAGES } from "../assets/imgSvg";
import '../styles/inicio.css'

export default function Inicio() {
  return (
    <div className="ctnInicio">
      <div className="nivel uno">
        <div className="item">
          <div className="top">
            <SVG.Vencimiento/>
            <p className="subtitle">Total de Materiales</p>
          </div>
          <div className="medium">
            <p className="cantidad">5000<span>und.</span></p>
            <div className="barra">
              12%
              <SVG.ArrowTop className="iconoArriba"/>
            </div>
          </div>
          <div className="bottom">            
            <p className="disc">Mes anterior: <span>4900 und.</span></p>
          </div>
        </div>
        <div className="item">
          <div className="top">
            <SVG.Vencimiento/>
            <p className="subtitle">Productos por vencer</p>
          </div>
        </div>
        <div className="item">
          <div className="top">
            <SVG.Vencimiento/>
            <p className="subtitle">Productos por agotarse</p>
          </div>
        </div>
        <div className="item">
          <div className="top">
            <SVG.Vencimiento/>
            <p className="subtitle">Productos por agotarse</p>
          </div>
        </div>
      </div>
      <div className="nivel dos">
        <div className="ctnHistorial">
           <p className="title">Sedes y materiales en total</p>
        </div>
        <div className="vistaRigth">
          <p className="title">Mostrara los eventos hechos y materiales (cantidad) usados - SUPER</p>
        </div>
      </div>
      <div className="nivel tres">
        <div>
          <p className="title">Caja Team Collaboration: Mostrar los movimientos de los administradores - SUPER</p>
        </div>
        <div>
          <p className="title">Caja Team Collaboration: Mostrar los movimientos de uno mismo - ADMIN</p>
        </div>
      </div>
    </div>
  );
}
