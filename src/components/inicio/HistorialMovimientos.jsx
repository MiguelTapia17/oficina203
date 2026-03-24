import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useGlobalData } from "../../context/GlobalDataContext";

export default function HistorialMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loadingMovs, setLoadingMovs] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const { usuarios, items, loading } = useGlobalData();

  const currentRole = String(user?.rol ?? "").toLowerCase();
  const currentSedeId = Number(user?.id_sede ?? 0);

  const isSuperAdmin = currentRole === "superadmin";
  const isAdmin = currentRole === "admin";

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        setLoadingMovs(true);
        const res = await apiGet("movimientos-item");

        if (!res?.ok) {
          setError("No se pudo cargar los últimos movimientos.");
          setMovimientos([]);
          return;
        }

        setMovimientos(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError("No se pudo cargar los últimos movimientos.");
        setMovimientos([]);
      } finally {
        setLoadingMovs(false);
      }
    };

    fetchMovimientos();
  }, []);

  const usuariosMap = useMemo(() => {
    const map = {};
    (usuarios || []).forEach((u) => {
      map[u.id_admin] = u.nombre_completo ?? "—";
    });
    return map;
  }, [usuarios]);

  const usuariosSedeMap = useMemo(() => {
    const map = {};
    (usuarios || []).forEach((u) => {
      map[u.id_admin] = Number(u.id_sede ?? 0);
    });
    return map;
  }, [usuarios]);

  const itemsMap = useMemo(() => {
    const map = {};
    (items || []).forEach((it) => {
      map[it.id_item] = it.nombre_item ?? "—";
    });
    return map;
  }, [items]);

  const rows = useMemo(() => {
    let visibles = Array.isArray(movimientos) ? [...movimientos] : [];

    // Restricción por rol
    if (isSuperAdmin) {
      visibles = visibles;
    } else if (isAdmin) {
      visibles = visibles.filter(
        (m) => Number(usuariosSedeMap[m.id_admin]) === currentSedeId
      );
    } else {
      visibles = [];
    }

    // Ordenar por ID descendente
    visibles.sort(
      (a, b) =>
        Number(b?.id_movimiento || 0) - Number(a?.id_movimiento || 0)
    );

    // Solo los 10 más recientes
    visibles = visibles.slice(0, 10);

    return visibles.map((m) => ({
      id_movimiento: m.id_movimiento ?? "—",
      nombre_admin: usuariosMap[m.id_admin] ?? "—",
      nombre_item: itemsMap[m.id_item] ?? "—",
      tipo_movimiento: m.tipo_movimiento ?? "—",
      cantidad: m.cantidad ?? "—",
    }));
  }, [
    movimientos,
    usuariosMap,
    usuariosSedeMap,
    itemsMap,
    isSuperAdmin,
    isAdmin,
    currentSedeId,
  ]);

  if (error) {
    return (
      <div className="historialMini">
        <div className="top">
          <p className="title">Últimos movimientos</p>
        </div>
        <p style={{ opacity: 0.7 }}>{error}</p>
      </div>
    );
  }

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
              {/* <th>Usuario</th> */}
              <th>Ítem</th>
              <th>Tipo</th>
              <th>Cant.</th>
            </tr>
          </thead>

          <tbody>
            {loading || loadingMovs ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", opacity: 0.7 }}>
                  Cargando movimientos...
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((r, idx) => (
                <tr key={`${r.id_movimiento}-${idx}`}>
                  <td>{r.id_movimiento}</td>
                  {/* <td title={r.nombre_admin}>{r.nombre_admin}</td> */}
                  <td title={r.nombre_item}>{r.nombre_item}</td>
                  <td className={`tipoM ${String(r.tipo_movimiento || "").toLowerCase()}`}>
                    <p>{r.tipo_movimiento}</p>
                  </td>
                  <td>{parseInt(r.cantidad, 10) || 0}</td>
                </tr>
              ))
            ) : (
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