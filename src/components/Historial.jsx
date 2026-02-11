import { useState, useEffect, useMemo } from 'react';
import { apiGet } from "../services/api";
import '../styles/inventario.css';
import '../styles/historial.css';

export default function Historial() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  // 🔎 Buscador global
  const [search, setSearch] = useState("");

  // 🎛 Filtro por tipo (se mantiene independiente)
  const [tipoFilter, setTipoFilter] = useState("");

  // Lookups
  const [actividadesMap, setActividadesMap] = useState({});
  const [usuariosMap, setUsuariosMap] = useState({});
  const [itemsMap, setItemsMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movRes, actRes, userRes, itemRes] = await Promise.all([
          apiGet("movimientos-item"),
          apiGet("actividades"),
          apiGet("usuarios"),
          apiGet("items"),
        ]);

        const movs = movRes.data ?? [];
        const acts = actRes.data ?? [];
        const users = userRes.data ?? [];
        const items = itemRes.data ?? [];

        const actMap = {};
        acts.forEach(a => actMap[a.id_actividad] = a.nombre_actividad);

        const userMap = {};
        users.forEach(u => userMap[u.id_admin] = u.nombre_completo);

        const itemMap = {};
        items.forEach(i => itemMap[i.id_item] = i.nombre_item);

        setMovimientos(movs);
        setActividadesMap(actMap);
        setUsuariosMap(userMap);
        setItemsMap(itemMap);

      } catch {
        setError("No se pudo cargar el historial.");
      }
    };

    fetchData();
  }, []);

  // Normalizador (ignora tildes y mayúsculas)
  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Enriquecemos movimientos
  const enriched = useMemo(() => {
    return movimientos.map(m => ({
      ...m,
      nombre_actividad: actividadesMap[m.id_actividad] ?? "—",
      nombre_admin: usuariosMap[m.id_admin] ?? "—",
      nombre_item: itemsMap[m.id_item] ?? "—",
    }));
  }, [movimientos, actividadesMap, usuariosMap, itemsMap]);

  // Tipos únicos
  const tiposUnicos = useMemo(() => {
    const set = new Set(enriched.map(m => m.tipo_movimiento).filter(Boolean));
    return Array.from(set);
  }, [enriched]);

  // 🔎 FILTRO GLOBAL + TIPO
const filteredItems = useMemo(() => {
  const q = normalize(search);

  return enriched.filter(m => {

    // 🎛 filtro por tipo
    const matchesTipo = tipoFilter
      ? m.tipo_movimiento === tipoFilter
      : true;

    if (!q) return matchesTipo;

    // 📅 quitar hora de la fecha
    const fechaSolo = String(m.fecha_movimiento ?? "").split(" ")[0].split("T")[0];

    // 🔎 SOLO campos permitidos
    const rowString = normalize(`
      ${m.id_movimiento}
      ${m.nombre_actividad}
      ${m.nombre_admin}
      ${m.nombre_item}
      ${fechaSolo}
    `);

    return matchesTipo && rowString.includes(q);
  });

}, [enriched, search, tipoFilter]);


  if (error) return <p>{error}</p>;

  return (
    <div className="historial">
      <h2>Historial</h2>

      <div className="filters">

        <div className='input-field'>
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar en historial</label>
        </div>
        <div className='input-field'>

          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
            <option value="">Todos los tipos</option>
            {tiposUnicos.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
          <label>Tipo</label>

        </div>
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
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((m) => (
              <tr key={m.id_movimiento}>
                <td>{m.id_movimiento}</td>
                <td>{m.nombre_actividad}</td>
                <td>{m.nombre_admin}</td>
                <td>{m.nombre_item}</td>
                <td className={`tipoM ${String(m.tipo_movimiento || "").toLowerCase()}`}>
                  <p>{m.tipo_movimiento}</p>
                </td>
                <td>{parseInt(m.cantidad)}</td>
                <td>{m.fecha_movimiento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
