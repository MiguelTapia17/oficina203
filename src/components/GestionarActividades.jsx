import { useMemo, useState } from "react";
import { apiPost } from "../services/api";
import { useGlobalData } from "../context/GlobalDataContext";
import { SVG } from "../assets/imgSvg";
import "../styles/usuarios.css";

const makeEmptyForm = () => ({
  nombre_actividad: "",
  tipo_actividad: "",
  area_responsable: "",
  fecha_inicio: "",
  fecha_fin: "",
  estado_actividad: "planificada",
  activo: 1,
});

export default function GestionarActividades() {
  const {
    actividades,
    refreshActividades,
    usuariosMap,
    loading: globalLoading
  } = useGlobalData();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedActividadDetalle, setSelectedActividadDetalle] = useState(null);

  const [selectedActividad, setSelectedActividad] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

      
  // =========================
  // FILTRO
  // =========================
  const filteredActividades = useMemo(() => {
    if (!search.trim()) return actividades;

    const q = normalize(search);

    return actividades.filter((a) =>
      normalize(
        `${a.id_actividad} ${a.nombre_actividad} ${a.descripcion} ${a.estado}`
      ).includes(q)
    );
  }, [actividades, search]);

  // =========================
  // POPUPS
  // =========================
  const openCreate = () => {
    setForm(makeEmptyForm());
    setError("");
    setSuccess("");
    setShowCreate(true);
  };

  const openEdit = (actividad) => {
    setSelectedActividad(actividad);

    setForm({
      nombre_actividad: actividad.nombre_actividad ?? "",
      tipo_actividad: actividad.tipo_actividad ?? "",
      area_responsable: actividad.area_responsable ?? "",
      fecha_inicio: actividad.fecha_inicio ?? "",
      fecha_fin: actividad.fecha_fin ?? "",
      estado_actividad: actividad.estado_actividad ?? "planificada",
      activo: actividad.activo ?? 1,
    });

    setShowEdit(true);
  };

  const closePopups = () => {
    setShowCreate(false);
    setShowEdit(false);
    setSelectedActividad(null);
    setForm(makeEmptyForm());
    setError("");
  };

  // =========================
  // CREAR
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nombre_actividad.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await apiPost("actividades-crear", form);

      if (res?.ok) {
        setSuccess("✅ Actividad creada correctamente");
        await refreshActividades(); // 👈 solo refresca actividades
        setShowCreate(false);
      } else {
        setError(res?.message || "Error creando actividad");
      }
    } catch {
      setError("Error de servidor");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ACTUALIZAR - EDITAR
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedActividad) return;

    setSaving(true);
    setError("");

    try {
      const payload = {
        id_actividad: selectedActividad.id_actividad,
        ...form,
      };

      const res = await apiPost("actividades-actualizar", payload);

      if (res?.ok) {
        setSuccess("✅ Actividad actualizada");
        await refreshActividades();
        setShowEdit(false);
      } else {
        setError(res?.message || "Error actualizando");
      }
    } catch {
      setError("Error de servidor");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar actividad?")) return;

    try {
      const res = await apiPost(`actividades-eliminar/${id}`, {});

      if (res?.ok) {
        setSuccess("✅ Eliminada");
        await refreshActividades();
      } else {
        setError("No se pudo eliminar");
      }
    } catch {
      setError("Error eliminando");
    }
  };
    /* FECHA */
    const getFecha = (fecha) => {
      if (!fecha) return "—";
      const date = new Date(fecha.replace(" ", "T"));
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const getHora = (fecha) => {
      if (!fecha) return "—";
      const date = new Date(fecha.replace(" ", "T"));
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
  return (
    <div className="gestionUsuarios">
      <h2>Gestionar Actividades</h2>

      <div className="filtersUsuarios">
        <div className="input-field">
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar actividad...</label>
        </div>

        <button className="btnPrimary" onClick={openCreate}>
          <SVG.UserAdd />
          Nueva actividad
        </button>
      </div>

      {error && <p className="errorTxt">{error}</p>}
      {success && <p className="successTxt">{success}</p>}

      <div className="ctnTable">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Área</th>
              <th>F. Inicio</th>
              <th>F. Fin</th>
              <th>Editar</th>
            </tr>
          </thead>

          <tbody>
            {globalLoading ? (
              <tr>
                <td colSpan="5">Cargando...</td>
              </tr>
            ) : filteredActividades.length === 0 ? (
              <tr>
                <td colSpan="5">No hay actividades</td>
              </tr>
            ) : (
              filteredActividades.map((a) => (
                <tr key={a.id_actividad}>
                  <td className="clickable" onClick={() => setSelectedActividadDetalle(a)}>
                    {a.id_actividad}
                  </td>
                  <td>{a.nombre_actividad}</td>
                  <td>{a.tipo_actividad}</td>
                  <td>{a.area_responsable}</td>
                  <td>{getFecha(a.fecha_inicio)}</td>
                  <td>{getFecha(a.fecha_fin)}</td>
                  <td className="actionsCell">
                    <button
                      className="btnSmall"
                      onClick={() => openEdit(a)}
                    >
                      <SVG.UserEdit />
                    </button>
                    <button
                      className="btnSmall"
                      onClick={() => handleDelete(a.id_actividad)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* CREAR ACTIVIDAD  */}
      {showCreate && (
        <div className="popup">
          <div className="popup-content">
            <h3>Crear Actividad</h3>

            <form onSubmit={handleCreate} autoComplete="off">

              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_actividad}
                  onChange={(e) =>
                    setForm({ ...form, nombre_actividad: e.target.value })
                  }
                  placeholder=" "
                  required
                />
                <label>Nombre Actividad</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.tipo_actividad || ""}
                  onChange={(e) =>
                    setForm({ ...form, tipo_actividad: e.target.value })
                  }
                  placeholder=" "
                />
                <label>Tipo Actividad</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.area_responsable || ""}
                  onChange={(e) =>
                    setForm({ ...form, area_responsable: e.target.value })
                  }
                  placeholder=" "
                />
                <label>Área Responsable</label>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input
                    type="date"
                    value={form.fecha_inicio || ""}
                    onChange={(e) =>
                      setForm({ ...form, fecha_inicio: e.target.value })
                    }
                  />
                  <label>Fecha Inicio</label>
                </div>

                <div className="input-field">
                  <input
                    type="date"
                    value={form.fecha_fin || ""}
                    onChange={(e) =>
                      setForm({ ...form, fecha_fin: e.target.value })
                    }
                  />
                  <label>Fecha Fin</label>
                </div>
              </div>

              <div className="input-field">
                <select
                  value={form.estado_actividad || ""}
                  onChange={(e) =>
                    setForm({ ...form, estado_actividad: e.target.value })
                  }
                >
                  <option value=""></option>
                  <option value="planificada">Planificada</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <label>Estado</label>
              </div>

              <div className="popupActions">
                <button className="btnPrimary" type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Crear"}
                </button>

                <button
                  type="button"
                  className="closeForm"
                  onClick={closePopups}
                >
                  <SVG.Close className="icon" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* EDITAR ACTIVIDAD*/}
      {showEdit && selectedActividad && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Actividad</h3>

            <form onSubmit={handleUpdate} autoComplete="off">

              {/* ID (solo lectura) */}
              <div className="input-field">
                <input
                  type="text"
                  value={selectedActividad.id_actividad}
                  disabled
                  placeholder=" "
                />
                <label>ID Actividad</label>
              </div>

              {/* Nombre + Tipo */}
              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    value={form.nombre_actividad}
                    onChange={(e) =>
                      setForm({ ...form, nombre_actividad: e.target.value })
                    }
                    placeholder=" "
                    required
                  />
                  <label>Nombre</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={form.tipo_actividad}
                    onChange={(e) =>
                      setForm({ ...form, tipo_actividad: e.target.value })
                    }
                    placeholder=" "
                  />
                  <label>Tipo</label>
                </div>
              </div>

              {/* Área + Estado */}
              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    value={form.area_responsable}
                    onChange={(e) =>
                      setForm({ ...form, area_responsable: e.target.value })
                    }
                    placeholder=" "
                  />
                  <label>Área Responsable</label>
                </div>

                <div className="input-field">
                  <select
                    value={form.estado_actividad}
                    onChange={(e) =>
                      setForm({ ...form, estado_actividad: e.target.value })
                    }
                  >
                    <option value="planificada">Planificada</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <label>Estado</label>
                </div>
              </div>

              {/* Fechas */}
              <div className="double__form">
                <div className="input-field">
                  <input
                    type="date"
                    value={form.fecha_inicio}
                    onChange={(e) =>
                      setForm({ ...form, fecha_inicio: e.target.value })
                    }
                  />
                  <label>Fecha Inicio</label>
                </div>

                <div className="input-field">
                  <input
                    type="date"
                    value={form.fecha_fin}
                    onChange={(e) =>
                      setForm({ ...form, fecha_fin: e.target.value })
                    }
                  />
                  <label>Fecha Fin</label>
                </div>
              </div>

              {/* Activo */}
              <div className="input-field">
                <select
                  value={form.activo}
                  onChange={(e) =>
                    setForm({ ...form, activo: Number(e.target.value) })
                  }
                >
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
                <label>Activo</label>
              </div>

              {/* BOTONES */}
              <div className="popupActions">
                <button className="btnPrimary" type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>

                <button
                  type="button"
                  className="closeForm"
                  onClick={closePopups}
                >
                  <SVG.Close />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      {/* DETALLE ACTIVIDAD */}
      {selectedActividadDetalle && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalle de Actividad</h3>

            <div className="popup-item">

              <div className="triple__form">
                <div className="input-field">
                  <input type="text" value={selectedActividadDetalle.id_actividad} readOnly />
                  <label>ID Actividad</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getFecha(selectedActividadDetalle.created_at)} readOnly />
                  <label>Fecha creación</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedActividadDetalle.created_at)} readOnly />
                  <label>Hora creación</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedActividadDetalle.nombre_actividad} readOnly />
                  <label>Nombre</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedActividadDetalle.tipo_actividad} readOnly />
                  <label>Tipo</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedActividadDetalle.area_responsable} readOnly />
                  <label>Área Responsable</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={usuariosMap?.[selectedActividadDetalle.id_admin] ?? selectedActividadDetalle.id_admin}
                    readOnly
                  />
                  <label>Responsable</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedActividadDetalle.fecha_inicio)} readOnly />
                  <label>Fecha Inicio</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getFecha(selectedActividadDetalle.fecha_fin)} readOnly />
                  <label>Fecha Fin</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedActividadDetalle.estado_actividad} readOnly />
                  <label>Estado</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={selectedActividadDetalle.activo ? "Sí" : "No"}
                    readOnly
                  />
                  <label>Activo</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedActividadDetalle.updated_at)} readOnly />
                  <label>Última actualización</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedActividadDetalle.updated_at)} readOnly />
                  <label>Hora actualización</label>
                </div>
              </div>

            </div>

            <button
              className="closeForm"
              onClick={() => setSelectedActividadDetalle(null)}
            >
              <SVG.Close className="icon" />
            </button>
          </div>
        </div>
      )}     
      
    </div>
  );
}