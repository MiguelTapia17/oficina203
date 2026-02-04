import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { SVG } from "../assets/imgSvg";
import "../styles/inicio.css";

export default function Inicio() {
  // Cards (números)
  const [totalMateriales, setTotalMateriales] = useState(0);
  const [productosPorAcabarse, setProductosPorAcabarse] = useState(0);

  // Listas
  const [sinStock, setSinStock] = useState([]); // [{id_item, nombre_item, nombre_sede}, ...]
  const [sedes, setSedes] = useState([]);       // [{id_sede, nombre_sede, total_materiales}, ...]

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          resTotal,
          resPorAcabarse,
          resSinStock,
          resPorSede
        ] = await Promise.all([
          apiGet("dashboard/total-materiales"),
          apiGet("dashboard/productos-por-acabarse"),
          apiGet("dashboard/productos-sin-stock"),
          apiGet("dashboard/materiales-por-sede"),
        ]);

        // total-materiales => { data: { total_materiales: "9790.00" } }
        setTotalMateriales(parseFloat(resTotal?.data?.total_materiales || 0));

        // productos-por-acabarse => (no pegaste el JSON exacto, lo dejo soportando 2 formas comunes)
        // Forma A: { data: { total_productos: "12" } }
        // Forma B: { data: { productos_por_acabarse: "12" } }
        const porAcabarse =
          resPorAcabarse?.data?.total_productos ??
          resPorAcabarse?.data?.productos_por_acabarse ??
          resPorAcabarse?.data?.total ??
          0;

        setProductosPorAcabarse(parseFloat(porAcabarse || 0));

        // productos-sin-stock => { data: [ ... ] }
        setSinStock(Array.isArray(resSinStock?.data) ? resSinStock.data : []);

        // materiales-por-sede => { data: { total_sedes, sedes: [...] } }
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
            <SVG.Vencimiento />
            <p className="subtitle">Total de Materiales</p>
          </div>
          <div className="medium">
            <p className="cantidad">
              {totalMateriales}
              <span>und.</span>
            </p>
            <div className="barra">
              12% <SVG.ArrowTop className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Mes anterior: <span>4900 und.</span>
            </p>
          </div>
        </div>

        {/* PRODUCTOS POR ACABARSE */}
        <div className="item">
          <div className="top">
            <SVG.Vencimiento />
            <p className="subtitle">Productos por acabarse</p>
          </div>
          <div className="medium">
            <p className="cantidad">
              {productosPorAcabarse}
              <span>und.</span>
            </p>
            <div className="barra">
              12% <SVG.ArrowTop className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Mes anterior: <span>4900 und.</span>
            </p>
          </div>
        </div>

        {/* PRODUCTOS SIN STOCK (contador basado en el array) */}
        <div className="item">
          <div className="top">
            <SVG.Vencimiento />
            <p className="subtitle">Productos sin stock</p>
          </div>
          <div className="medium">
            <p className="cantidad">
              {sinStock.length}
              <span>und.</span>
            </p>
            <div className="barra">
              12% <SVG.ArrowTop className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Mes anterior: <span>4900 und.</span>
            </p>
          </div>
        </div>

        {/* Este 4to card lo dejo igual por ahora (si quieres lo conectamos después) */}
        <div className="item">
          <div className="top">
            <SVG.Vencimiento />
            <p className="subtitle">Productos por vencer</p>
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
              Mes anterior: <span>4900 und.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="nivel dos">
        {/* MATERIALES POR SEDE */}
        <div className="ctnHistorial">
          <p className="title">Sedes y materiales en total</p>

          {/* Render simple (sin estilos extra): lista */}
          <div>
            {sedes.map((s) => (
              <div key={s.id_sede} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{s.nombre_sede}</span>
                <span>{parseFloat(s.total_materiales || 0)} und.</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTOS SIN STOCK (detalle) */}
        <div className="vistaRigth">
          <p className="title">Productos sin stock (ítem + sede)</p>

          <div>
            {sinStock.map((p, idx) => (
              <div key={`${p.id_item}-${p.nombre_sede}-${idx}`}>
                <span>{p.nombre_item}</span>
                {" — "}
                <span>{p.nombre_sede}</span>
              </div>
            ))}
          </div>
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
