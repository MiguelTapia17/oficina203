import { useMemo, useState } from "react";
import { apiPost } from "../../services/api";
import { useGlobalData } from "../../context/GlobalDataContext";
import { useAuth } from "../../context/AuthContext";
import { SVG } from "../../assets/imgSvg";
import Toast from "../../components/Toast";
import "../../styles/usuarios.css";

const makeEmptyForm = () => ({
  nombre_unidad: "",
  abreviatura: "",
  activo: 1,
});

export default function GestionarUnidadesMedida() {
  const {
    unidades,
    refreshGlobalData,
    usuariosMap,
    loading: globalLoading,
  } = useGlobalData();

  const { user } = useAuth();
  const currentAdminId = Number(user?.id_admin ?? 0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUnidadDetalle, setSelectedUnidadDetalle] = useState(null);

  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());
  const [toast, setToast] = useState(null);

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredUnidades = useMemo(() => {
    const base = Array.isArray(unidades) ? [...unidades] : [];

    base.sort((a, b) => Number(a.id_unidad) - Number(b.id_unidad));

    if (!search.trim()) return base;

    const q = normalize(search);

    return base.filter((u) =>
      normalize(
        `${u.id_unidad} ${u.nombre_unidad} ${u.abreviatura} ${u.activo}`
      ).includes(q)
    );
  }, [unidades, search]);

  const getFecha = (fecha) => {
    if (!fecha) return "—";
    const date = new Date(String(fecha).replace(" ", "T"));
    if (isNaN(date.getTime())) return "—";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getHora = (fecha) => {
    if (!fecha) return "—";
    const date = new Date(String(fecha).replace(" ", "T"));
    if (isNaN(date.getTime())) return "—";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const openCreate = () => {
    setForm(makeEmptyForm());
    setSelectedUnidad(null);
    setSelectedUnidadDetalle(null);
    setError("");
    setShowCreate(true);
  };

  const openEdit = (unidad) => {
    setSelectedUnidad(unidad);
    setSelectedUnidadDetalle(null);
    setError("");

    setForm({
      nombre_unidad: unidad.nombre_unidad ?? "",
      abreviatura: unidad.abreviatura ?? "",
      activo: Number(unidad.activo ?? 1),
    });

    setShowEdit(true);
  };

  const closePopups = () => {
    setShowCreate(false);
    setShowEdit(false);
    setSelectedUnidad(null);
    setForm(makeEmptyForm());
    setError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nombre_unidad.trim()) {
      setToast({
        type: "error",
        title: "Campo requerido",
        message: "El nombre de la unidad es obligatorio",
      });
      return;
    }

    if (!currentAdminId) {
      setToast({
        type: "error",
        title: "Sesión inválida",
        message: "No se encontró el usuario logeado",
      });
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        nombre_unidad: form.nombre_unidad.trim(),
        abreviatura: form.abreviatura.trim(),
        activo: 1,
        id_admin: currentAdminId,
      };

      const res = await apiPost("unidades-medida-crear", payload);

      if (res?.ok) {
        setToast({
          type: "success",
          title: "Unidad creada",
          message: "La unidad de medida fue creada correctamente",
        });
        await refreshGlobalData();
        setShowCreate(false);
        setForm(makeEmptyForm());
      } else {
        setToast({
          type: "error",
          title: "Error",
          message: res?.message || "Error creando unidad de medida",
        });
      }
    } catch {
      setToast({
        type: "error",
        title: "Error de servidor",
        message: "No se pudo crear la unidad de medida",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedUnidad?.id_unidad) {
      setToast({
        type: "error",
        title: "Error",
        message: "No se encontró la unidad a editar",
      });
      return;
    }

    if (!form.nombre_unidad.trim()) {
      setToast({
        type: "error",
        title: "Campo requerido",
        message: "El nombre de la unidad es obligatorio",
      });
      return;
    }

    if (!currentAdminId) {
      setToast({
        type: "error",
        title: "Sesión inválida",
        message: "No se encontró el usuario logeado",
      });
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        id_unidad: Number(selectedUnidad.id_unidad),
        nombre_unidad: form.nombre_unidad.trim(),
        abreviatura: form.abreviatura.trim(),
        activo: Number(form.activo ?? 1),
        id_admin: currentAdminId,
      };

      const res = await apiPost("unidades-medida-actualizar", payload);

      if (res?.ok) {
        setToast({
          type: "success",
          title: "Unidad actualizada",
          message: "La unidad de medida fue actualizada correctamente",
        });
        await refreshGlobalData();
        setShowEdit(false);
        setSelectedUnidad(null);
        setForm(makeEmptyForm());
      } else {
        setToast({
          type: "error",
          title: "Error",
          message: res?.message || "Error actualizando unidad de medida",
        });
      }
    } catch {
      setToast({
        type: "error",
        title: "Error de servidor",
        message: "No se pudo actualizar la unidad de medida",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar unidad de medida? (desactivación lógica)")) return;

    try {
      const res = await apiPost(`unidades-medida-eliminar/${id}`, {});

      if (res?.ok) {
        setToast({
          type: "success",
          title: "Unidad desactivada",
          message: "La unidad de medida fue desactivada correctamente",
        });
        await refreshGlobalData();
      } else {
        setToast({
          type: "error",
          title: "Error",
          message: res?.message || "No se pudo desactivar la unidad de medida",
        });
      }
    } catch {
      setToast({
        type: "error",
        title: "Error de servidor",
        message: "No se pudo eliminar la unidad de medida",
      });
    }
  };

  return (
    <div className="ctnGestion">
      <h2>Gestionar Unidades de Medida</h2>

      <div className="ctnAllFilters">
        <div className="input-field">
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar unidad de medida...</label>
        </div>

        <button className="btnAdd" onClick={openCreate}>
          <SVG.Add />
          <p>Nueva unidad de medida</p>
        </button>
      </div>

      {error && <p className="errorTxt">{error}</p>}

      <div className="ctnTable">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Abreviatura</th>
              <th>Activo</th>
              <th>Editar</th>
            </tr>
          </thead>

          <tbody>
            {globalLoading ? (
              <tr>
                <td colSpan="5">Cargando...</td>
              </tr>
            ) : filteredUnidades.length === 0 ? (
              <tr>
                <td colSpan="5">No hay unidades de medida</td>
              </tr>
            ) : (
              filteredUnidades.map((u) => (
                <tr key={u.id_unidad}>
                  <td
                    className="clickable"
                    onClick={() => setSelectedUnidadDetalle(u)}
                  >
                    {u.id_unidad}
                  </td>
                  <td>{u.nombre_unidad}</td>
                  <td>{u.abreviatura}</td>
                  <td>{Number(u.activo) === 1 ? "Sí" : "No"}</td>
                  <td className="actionsCell">
                    <div className="btnSmall" onClick={() => openEdit(u)}>
                      <SVG.Edit />
                    </div>
                    {/* <button className="btnSmall" onClick={() => handleDelete(u.id_unidad)}>
                      ❌
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="popup">
          <div className="popup-content">
            <h3>Crear Unidad de Medida</h3>

            <form onSubmit={handleCreate} autoComplete="off">
              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_unidad}
                  onChange={(e) => setForm({ ...form, nombre_unidad: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre unidad</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.abreviatura}
                  onChange={(e) => setForm({ ...form, abreviatura: e.target.value })}
                  placeholder=" "
                />
                <label>Abreviatura</label>
              </div>

              <div className="popupActions">
                <button className="btnPrimary" type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Crear"}
                </button>

                <button type="button" className="closeForm" onClick={closePopups}>
                  <SVG.Close className="icon" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && selectedUnidad && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Unidad de Medida</h3>

            <form onSubmit={handleUpdate} autoComplete="off">
              <div className="input-field">
                <input
                  type="text"
                  value={selectedUnidad.id_unidad}
                  disabled
                  placeholder=" "
                />
                <label>ID Unidad</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_unidad}
                  onChange={(e) => setForm({ ...form, nombre_unidad: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre unidad</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.abreviatura}
                  onChange={(e) => setForm({ ...form, abreviatura: e.target.value })}
                  placeholder=" "
                />
                <label>Abreviatura</label>
              </div>

              <div className="input-field">
                <select
                  value={form.activo}
                  onChange={(e) => setForm({ ...form, activo: Number(e.target.value) })}
                >
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
                <label>Activo</label>
              </div>

              <div className="popupActions">
                <button className="btnPrimary" type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>

                <button type="button" className="closeForm" onClick={closePopups}>
                  <SVG.Close className="icon" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUnidadDetalle && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalle de Unidad de Medida</h3>

            <div className="popup-item">
              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedUnidadDetalle.id_unidad} readOnly />
                  <label>ID Unidad</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedUnidadDetalle.nombre_unidad} readOnly />
                  <label>Nombre</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedUnidadDetalle.abreviatura} readOnly />
                  <label>Abreviatura</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={Number(selectedUnidadDetalle.activo) === 1 ? "Sí" : "No"}
                    readOnly
                  />
                  <label>Activo</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedUnidadDetalle.created_at)} readOnly />
                  <label>Fecha creación</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedUnidadDetalle.created_at)} readOnly />
                  <label>Hora creación</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedUnidadDetalle.updated_at)} readOnly />
                  <label>Última actualización</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedUnidadDetalle.updated_at)} readOnly />
                  <label>Hora actualización</label>
                </div>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={
                    usuariosMap?.[selectedUnidadDetalle.id_admin] ??
                    selectedUnidadDetalle.id_admin ??
                    "—"
                  }
                  readOnly
                />
                <label>Responsable</label>
              </div>
            </div>

            <button
              className="closeForm"
              onClick={() => setSelectedUnidadDetalle(null)}
            >
              <SVG.Close className="icon" />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}