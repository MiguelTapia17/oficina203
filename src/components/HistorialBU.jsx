import { useState, useEffect, useMemo } from "react";
import { apiGet } from "../services/api";
import { SVG } from "../assets/imgSvg";
import { useGlobalData } from "../context/GlobalDataContext";
import Loader from "../components/Loader"; // Cargamos el loader
import "../styles/inventario.css";
import "../styles/historial.css";

export default function Historial() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [selectedMovimiento, setSelectedMovimiento] = useState(null); // Estado para el popup

  // Filtros adicionales
  const [usuarioFilter, setUsuarioFilter] = useState(""); // Filtro de usuario
  const [fechaInicio, setFechaInicio] = useState(""); // Filtro de fecha inicio
  const [fechaFin, setFechaFin] = useState(""); // Filtro de fecha fin

  //FILTROS
  const [showFilters, setShowFilters] = useState(false);

  // Traes maps desde el contexto
  const { actividadesMap, usuariosMap, itemsMap, sedes, loading: globalLoading } = useGlobalData(); // Traemos sedes desde el contexto

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const movRes = await apiGet("movimientos-item");
        setMovimientos(movRes.data ?? []);
      } catch {
        setError("No se pudo cargar el historial.");
      }
    };

    fetchMovimientos();
  }, []);

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const enriched = useMemo(() => {
    return movimientos.map((m) => ({
      ...m,
      nombre_actividad: actividadesMap?.[m.id_actividad] ?? "—",
      nombre_admin: usuariosMap?.[m.id_admin] ?? "—",
      nombre_item: itemsMap?.[m.id_item] ?? "—",
    }));
  }, [movimientos, actividadesMap, usuariosMap, itemsMap]);

  const tiposUnicos = useMemo(() => {
    const set = new Set(enriched.map((m) => m.tipo_movimiento).filter(Boolean));
    return Array.from(set);
  }, [enriched]);

  // Filtrado de elementos (incluyendo por usuario y rango de fechas)
  const filteredItems = useMemo(() => {
    const q = normalize(search);

    return enriched.filter((m) => {
      // Filtro por tipo
      const matchesTipo = tipoFilter ? m.tipo_movimiento === tipoFilter : true;

      // Filtro por usuario
      const matchesUsuario = usuarioFilter ? m.nombre_admin === usuarioFilter : true;

      // Filtro por fecha
      const matchesFecha =
        (!fechaInicio || new Date(m.fecha_movimiento) >= new Date(fechaInicio)) &&
        (!fechaFin || new Date(m.fecha_movimiento) <= new Date(fechaFin));

      // Si la búsqueda está vacía, retornamos el tipo de movimiento y el filtro de usuario
      if (!q) return matchesTipo && matchesUsuario && matchesFecha;

      const fechaSolo = String(m.fecha_movimiento ?? "").split(" ")[0].split("T")[0];

      const rowString = normalize(`
        ${m.id_movimiento}
        ${m.nombre_actividad}
        ${m.nombre_admin}
        ${m.nombre_item}
        ${fechaSolo}
      `);

      return matchesTipo && matchesUsuario && matchesFecha && rowString.includes(q);
    });
  }, [enriched, search, tipoFilter, usuarioFilter, fechaInicio, fechaFin]);

  // Si los datos globales están cargando, mostramos el loader
  if (globalLoading) return <Loader />;

  if (error) return <p>{error}</p>;

  // Mostrar popup con los detalles
  const handleMovimientoClick = (movimiento) => {
    setSelectedMovimiento(movimiento);
  };

  // Cerrar el popup
  const handleClosePopup = () => {
    setSelectedMovimiento(null);
  };

  // Función para obtener el nombre de la sede
  const getSedeNombre = (idSede) => {
    const sede = sedes.find(s => s.id_sede === idSede);
    return sede ? sede.nombre_sede : "Desconocida";
  };

  // Función para obtener la hora en formato HH:mm
  const getHora = (fecha) => {
    const date = new Date(fecha); // Convertimos la cadena en un objeto Date
    const hours = date.getHours().toString().padStart(2, '0'); // Obtiene las horas y lo formatea a dos dígitos
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Obtiene los minutos y lo formatea a dos dígitos
    return `${hours}:${minutes}`; // Retorna la hora en formato "HH:mm"
  };

  // Función para formatear la fecha
  const getFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Obtener lista de usuarios
  const usuarios = Array.from(new Set(enriched.map((m) => m.nombre_admin)));

  return (
    <div className="historial">
      <h2>Historial</h2>

      <div className="ctnAllFilters">
        <div className="input-field">
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar</label>
        </div>
        <div className="filters">
          <div className="filtersCTA" onClick={() => setShowFilters(!showFilters)} style={{ cursor: "pointer" }}>
            <SVG.Filter className="icon" />
            <p>Filtros</p>
          </div>
          {showFilters && (
            <div className="ctnFilters" >
              <div className="input-field">
                <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                  <option value="">Todos los Tipos</option>
                  {tiposUnicos.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <label>Tipo</label>
              </div>
              {/* Filtro de usuario */}
              <div className="input-field">
                <select value={usuarioFilter} onChange={(e) => setUsuarioFilter(e.target.value)}>
                  <option value="">Todos los Usuario</option>
                  {usuarios.map((usuario, idx) => (
                    <option key={idx} value={usuario}>
                      {usuario}
                    </option>
                  ))}
                </select>
                <label>Usuario</label>
              </div>
              {/* Filtro de fecha */}
              <div className="input-field">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
                <label>Fecha Inicio</label>
              </div>
              <div className="input-field">
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
                <label>Fecha Fin</label>
              </div>
            </div>
          )}
        </div>

        </div>

      <div className="ctnTable">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Admin</th>
              <th>Actividad</th>
              <th>Ítem</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
          </tr>
          </thead>
          <tbody>
            {filteredItems.map((m) => (
              <tr key={m.id_movimiento}>
                <td onClick={() => handleMovimientoClick(m)} className="clickable">{m.id_movimiento}</td>
                <td>{m.nombre_admin}</td>
                <td>{m.nombre_actividad}</td>
                <td>{m.nombre_item}</td>
                <td className={`tipoM ${String(m.tipo_movimiento || "").toLowerCase()}`}>
                  <p>{m.tipo_movimiento}</p>
                </td>
                <td>{parseInt(m.cantidad)}</td>
                <td>{getFecha(m.fecha_movimiento)}</td> {/* Fecha formateada */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Detalles */}
      {selectedMovimiento && (
        <div className="popup">
          <div className="popup-content detalles">
            <h3>Detalle del Movimiento</h3>
            <div className="popup-item">
              <div className="triple__form">
                <div className="input-field">
                  <input type="text" value={selectedMovimiento.id_movimiento} readOnly />
                  <label>N° Movimiento:</label>
                </div>
                <div className="input-field">
                  <input type="text" value={getFecha(selectedMovimiento.fecha_movimiento)} readOnly />
                  <label>Fecha</label>
                </div>
                <div className="input-field">
                  <input type="text" value={getHora(selectedMovimiento.fecha_movimiento)} readOnly />
                  <label>Hora</label>
                </div>
              </div>
              
              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedMovimiento.nombre_actividad} readOnly />
                  <label>Actividad:</label>
                </div>
                <div className="input-field">
                  <input type="text" value={selectedMovimiento.nombre_item} readOnly />
                  <label>Ítem</label>
                </div>
              </div>
              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedMovimiento.nombre_admin} readOnly />
                  <label>Usuario</label>
                </div>
                <div className="input-field">
                  <input type="text" value={getSedeNombre(selectedMovimiento.id_sede)} readOnly />
                  <label>Sede</label>
                </div>
              </div>
              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedMovimiento.tipo_movimiento} readOnly />
                  <label>Tipo de movimiento</label>
                </div>
                <div className="input-field">
                  <input type="text" value={parseInt(selectedMovimiento.cantidad)} readOnly />
                  <label>Cantidad</label>
                </div>
              </div>
              <div className="input-field">
                <textarea value={selectedMovimiento.observaciones}></textarea>
                <label>Comentario</label>
              </div>
            </div>
            <button
              className="closeForm"
              onClick={handleClosePopup}
            >
              <SVG.Close className="icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}