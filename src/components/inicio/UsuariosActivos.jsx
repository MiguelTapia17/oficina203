// src/components/inicio/UsuariosActivos.jsx
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../services/api";

export default function UsuariosActivos() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  // Filtro por estado: "" = Todos
  const [estadoFilter, setEstadoFilter] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await apiGet("usuarios");
        if (!res?.ok) {
          setError("No se pudo cargar usuarios.");
          return;
        }
        setUsuarios(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError("No se pudo cargar usuarios.");
      }
    };

    fetchUsuarios();
  }, []);

  const rows = useMemo(() => {
    // Filtrar por estado (si está vacío, mostrar todos)
    const filtrados = usuarios.filter((u) => {
      const estado = String(u?.estado || "").toLowerCase();
      if (!estadoFilter) return true;
      return estado === estadoFilter;
    });

    // Ordenar por último acceso desc (fallback por id_admin desc)
    const sorted = [...filtrados].sort((a, b) => {
      const da = new Date(a?.ultimo_acceso || 0).getTime();
      const db = new Date(b?.ultimo_acceso || 0).getTime();
      if (db !== da) return db - da;
      return (Number(b?.id_admin) || 0) - (Number(a?.id_admin) || 0);
    });

    // Si quieres limitar a 10, descomenta:
    // return sorted.slice(0, 10);
    return sorted;
  }, [usuarios, estadoFilter]);

  if (error) {
    return (
      <div className="usuariosActivos">
        <p className="title">Usuarios</p>
        <p style={{ opacity: 0.7 }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="usuariosActivos">
      <div className="top">
        <p className="title">Usuarios</p>

        <div className="input-field">
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <label>Estado</label>
        </div>
      </div>

      <div className="historialMiniTable">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Último acceso</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((u) => (
              <tr key={u.id_admin}>
                <td title={u.usuario}>{u.usuario}</td>
                <td title={u.nombre_completo}>{u.nombre_completo}</td>
                <td>
                  <span
                    className={`estado ${String(u.estado || "").toLowerCase()}`}
                  >
                    {u.estado}
                  </span>
                </td>
                <td>{u.ultimo_acceso ?? "—"}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
                  No hay usuarios para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
