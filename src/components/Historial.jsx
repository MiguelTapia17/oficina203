import { useState, useEffect, useMemo } from 'react';
import { apiGet } from "../services/api";
import '../styles/inventario.css';
import '../styles/historial.css';

export default function Historial() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  // Filtros
  const [search, setSearch] = useState("");     // buscar por tipo / item / actividad / admin
  const [idMovimiento, setIdMovimiento] = useState(""); // buscar por id_movimiento
  const [tipoFilter, setTipoFilter] = useState("");     // filtro por tipo_movimiento

  // Lookups
  const [actividadesMap, setActividadesMap] = useState({});
  const [usuariosMap, setUsuariosMap] = useState({});
  const [itemsMap, setItemsMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ajusta estos endpoints según tu API real
        const [
          movRes,
          actRes,
          userRes,
          itemRes
        ] = await Promise.all([
          apiGet("movimientos-item"),
          apiGet("actividades"),
          apiGet("usuarios"), // si tu endpoint es "usuaros" cámbialo aquí
          apiGet("items"),
        ]);

        const movs = movRes.data ?? [];
        const acts = actRes.data ?? [];
        const users = userRes.data ?? [];
        const items = itemRes.data ?? [];

        // Armamos mapas para resolver nombres por ID (O(1))
        const actMap = {};
        for (const a of acts) {
          actMap[a.id_actividad] = a.nombre_actividad;
        }

        const userMap = {};
        for (const u of users) {
          userMap[u.id_admin] = u.nombre_completo; 
          // Si tu tabla usuarios usa otro id (ej. id_usuario), cambia la llave aquí.
          // Ej: userMap[u.id_usuario] = u.nombre_completo;
        }

        const itemMap = {};
        for (const it of items) {
          itemMap[it.id_item] = it.nombre_item;
        }

        setMovimientos(movs);
        setActividadesMap(actMap);
        setUsuariosMap(userMap);
        setItemsMap(itemMap);
      } catch (e) {
        setError("No se pudo cargar el historial.");
      }
    };

    fetchData();
  }, []);

  // Enriquecemos movimientos con nombres
  const enriched = useMemo(() => {
    return movimientos.map(m => ({
      ...m,
      nombre_actividad: actividadesMap[m.id_actividad] ?? "—",
      nombre_admin: usuariosMap[m.id_admin] ?? "—",
      nombre_item: itemsMap[m.id_item] ?? "—",
    }));
  }, [movimientos, actividadesMap, usuariosMap, itemsMap]);

  // Tipos únicos para el filtro
  const tiposUnicos = useMemo(() => {
    const set = new Set(enriched.map(m => m.tipo_movimiento).filter(Boolean));
    return Array.from(set);
  }, [enriched]);

  // Filtrado
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return enriched.filter((m) => {
      const matchesIdMov = idMovimiento
        ? String(m.id_movimiento ?? "").includes(idMovimiento)
        : true;

      const matchesTipo = tipoFilter
        ? (m.tipo_movimiento === tipoFilter)
        : true;

      const matchesSearch = q
        ? (
            String(m.tipo_movimiento ?? "").toLowerCase().includes(q) ||
            String(m.nombre_item ?? "").toLowerCase().includes(q) ||
            String(m.nombre_actividad ?? "").toLowerCase().includes(q) ||
            String(m.nombre_admin ?? "").toLowerCase().includes(q)
          )
        : true;

      return matchesIdMov && matchesTipo && matchesSearch;
    });
  }, [enriched, idMovimiento, tipoFilter, search]);

  if (error) return <p>{error}</p>;

  return (
    <div className="inventario">
      <h2>Historial</h2>

      <div className="filters">
        <input type="number" placeholder="Buscar por ID movimiento" value={idMovimiento} onChange={(e) => setIdMovimiento(e.target.value)}/>

        <input type="text" placeholder="Buscar (tipo, item, actividad, admin)" value={search} onChange={(e) => setSearch(e.target.value)}/>

        <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
          <option value="">Todos los tipos</option>
          {tiposUnicos.map((t, idx) => (
            <option key={idx} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="ctnTable">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Actividad</th>
              <th>Admin</th>
              <th>Ítem</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              {/* <th>Obs.</th> */}
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((m) => (
              <tr key={m.id_movimiento}>
                <td>{m.id_movimiento}</td>
                <td>{m.nombre_actividad}</td>
                <td>{m.nombre_admin}</td>
                <td>{m.nombre_item}</td>
                <td className={`tipoM ${String(m.tipo_movimiento || "").toLowerCase()}`}><p>{m.tipo_movimiento}</p></td>
                <td>{parseInt(m.cantidad)}</td>
                <td>{m.fecha_movimiento}</td>
                {/* <td>{m.observaciones ?? "—"}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
