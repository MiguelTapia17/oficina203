import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useGlobalData } from "../../context/GlobalDataContext";

export default function UsuariosActivos() {
  const [estadoFilter, setEstadoFilter] = useState("");

  const { user } = useAuth();
  const { usuarios, loading } = useGlobalData();

  const currentRole = String(user?.rol ?? "").toLowerCase();
  const currentSedeId = Number(user?.id_sede ?? 0);

  const isSuperAdmin = currentRole === "superadmin";
  const isAdmin = currentRole === "admin";

  const rows = useMemo(() => {
    let visibles = Array.isArray(usuarios) ? [...usuarios] : [];

    // Restricción por rol
    if (isSuperAdmin) {
      visibles = visibles;
    } else if (isAdmin) {
      visibles = visibles.filter(
        (u) => Number(u?.id_sede) === currentSedeId
      );
    } else {
      visibles = [];
    }

    // Filtro por estado
    if (estadoFilter) {
      visibles = visibles.filter(
        (u) => String(u?.estado || "").toLowerCase() === estadoFilter
      );
    }

    // Orden por ID ascendente
    visibles.sort(
      (a, b) => Number(a?.id_admin || 0) - Number(b?.id_admin || 0)
    );

    return visibles;
  }, [usuarios, estadoFilter, isSuperAdmin, isAdmin, currentSedeId]);

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
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Último acceso</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
                  Cargando usuarios...
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((u) => (
                <tr key={u.id_admin}>
                  <td title={u.id_admin}>{u.id_admin}</td>
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
              ))
            ) : (
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