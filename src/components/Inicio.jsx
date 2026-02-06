import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { SVG } from "../assets/imgSvg";
import "../styles/inicio.css";

import MaterialesPorSede from "./inicio/MaterialesPorSede";
import SinStockDonut from "./inicio/SinStockDonut";
import HistorialMovimientos from "./inicio/HistorialMovimientos";
import UsuariosActivos from "./inicio/UsuariosActivos";

export default function Inicio() {
  // Cards (números)
  const [totalMateriales, setTotalMateriales] = useState(0);
  const [productosPorAcabarse, setProductosPorAcabarse] = useState(0);

  // Data
  const [sinStock, setSinStock] = useState([]); // [{id_item, nombre_item, nombre_sede}, ...]
  const [sedes, setSedes] = useState([]);       // [{id_sede, nombre_sede, total_materiales}, ...]

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [resTotal, resPorAcabarse, resSinStock, resPorSede] =
          await Promise.all([
            apiGet("dashboard/total-materiales"),
            apiGet("dashboard/productos-por-acabarse"),
            apiGet("dashboard/productos-sin-stock"),
            apiGet("dashboard/materiales-por-sede"),
          ]);

        setTotalMateriales(parseFloat(resTotal?.data?.total_materiales || 0));

        const porAcabarse =
          resPorAcabarse?.data?.total_productos ??
          resPorAcabarse?.data?.productos_por_acabarse ??
          resPorAcabarse?.data?.total ??
          0;

        setProductosPorAcabarse(parseFloat(porAcabarse || 0));

        setSinStock(Array.isArray(resSinStock?.data) ? resSinStock.data : []);

        setSedes(Array.isArray(resPorSede?.data?.sedes) ? resPorSede.data.sedes : []);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="ctnInicio">
      <div className="nivel uno">
        {/* TOTAL DE MATERIALES */}
        <div className="item">
          <div className="top">
            <div className="">
              {/* <SVG.Vencimiento /> */}
              <p className="subtitle">Total de Materiales</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              {totalMateriales}
              <span>und.</span>
            </p>
            <div className="barra mas">
              12% <SVG.ArrowTop className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              {/* Mes anterior: <span>4900 und.</span> */}
              Materiales en todas las sedes
            </p>
          </div>
        </div>

        {/* PRODUCTOS POR ACABARSE */}
        <div className="item">
          <div className="top">
            <div>
              {/* <SVG.Vencimiento /> */}
              <p className="subtitle">Materiales por acabarse</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              {productosPorAcabarse}
              <span>und.</span>
            </p>
            <div className="barra resta">
              0% <SVG.Resta className="iconoResta" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Materiales bajo de stock
            </p>
          </div>
        </div>

        {/* PRODUCTOS SIN STOCK */}
        <div className="item">
          <div className="top">
            <div>
              {/* <SVG.Vencimiento /> */}
              <p className="subtitle">Materiales sin stock</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              {sinStock.length}
              <span>und.</span>
            </p>
            <div className="barra menos">
              12% <SVG.ArrowDown className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Materiales sin disponibilidad
            </p>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="item">
          <div className="top">
            <div>
              {/* <SVG.Vencimiento /> */}
              <p className="subtitle">Materiales por vencer</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              5000<span>und.</span>
            </p>
            <div className="barra">
              12% <SVG.ArrowTop className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              {/* Mes anterior: <span>4900 und.</span> */}
              Materiales por vencer en los próximos 30 días
            </p>
          </div>
        </div>
      </div>

      <div className="nivel dos">
        <MaterialesPorSede sedes={sedes} />
        <SinStockDonut sinStock={sinStock} />
      </div>

      <div className="nivel tres">
        <HistorialMovimientos/>
        <UsuariosActivos/>
      </div>
    </div>
  );
}
