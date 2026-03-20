// src/components/inicio/HistorialMovimientos.jsx
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../services/api";

export default function HistorialMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  // Lookups
  const [usuariosMap, setUsuariosMap] = useState({});
  const [itemsMap, setItemsMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movRes, userRes, itemRes] = await Promise.all([
          apiGet("movimientos-item"),
          apiGet("usuarios"),
          apiGet("items"),
        ]);

        const movs = movRes?.data ?? [];
        const users = userRes?.data ?? [];
        const items = itemRes?.data ?? [];

        const userMap = {};
        for (const u of users) {
          userMap[u.id_admin] = u.nombre_completo ?? "—";
        }

        const itemMap = {};
        for (const it of items) {
          itemMap[it.id_item] = it.nombre_item ?? "—";
        }

        setUsuariosMap(userMap);
        setItemsMap(itemMap);

        // Tomamos los 10 más recientes
        // Si tu API ya viene ordenada por fecha desc, esto basta.
        // Si NO viene ordenada, abajo intento ordenar por fecha/id.
        const sorted = [...movs].sort((a, b) => {
          // Prioridad: fecha_movimiento (si viene ISO o comparable)
          const da = new Date(a.fecha_movimiento || 0).getTime();
          const db = new Date(b.fecha_movimiento || 0).getTime();
          if (db !== da) return db - da;

          // Fallback: id_movimiento desc
          return (Number(b.id_movimiento) || 0) - (Number(a.id_movimiento) || 0);
        });

        setMovimientos(sorted.slice(0, 10));
      } catch (e) {
        setError("No se pudo cargar los últimos movimientos.");
      }
    };

    fetchData();
  }, []);

  const rows = useMemo(() => {
    return movimientos.map((m) => ({
      id_movimiento: m.id_movimiento ?? "—",
      nombre_admin: usuariosMap[m.id_admin] ?? "—",
      nombre_item: itemsMap[m.id_item] ?? "—",
      tipo_movimiento: m.tipo_movimiento ?? "—",
      cantidad: m.cantidad ?? "—",
    }));
  }, [movimientos, usuariosMap, itemsMap]);

  if (error) return <p>{error}</p>;

  return (
    <div className="historialMini">
      <div className="top">
        <p className="title">Últimos movimientos</p>
      </div>

      <div className="historialMiniTable">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Ítem</th>
              <th>Tipo</th>
              <th>Cant.</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.id_movimiento}-${idx}`}>
                <td>{r.id_movimiento}</td>
                <td title={r.nombre_admin}>{r.nombre_admin}</td>
                <td title={r.nombre_item}>{r.nombre_item}</td>
                <td className={`tipoM ${String(r.tipo_movimiento || "").toLowerCase()}`}>
                  <p>{r.tipo_movimiento}</p>
                </td>
                <td>{parseInt(r.cantidad, 10) || 0}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", opacity: 0.7 }}>
                  Sin movimientos recientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
