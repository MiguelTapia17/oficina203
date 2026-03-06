import { useMemo, useState } from "react";
import { apiPost } from "../../services/api";
import { useGlobalData } from "../../context/GlobalDataContext";
import { SVG } from "../../assets/imgSvg";
import "../../styles/usuarios.css";

const makeEmptyForm = () => ({
  nombre_tipo: "",
  controla_stock: 1,
  es_perecible: 0,
  fecha_perecible: "",
  activo: 1,
});

export default function GestionarTiposItem() {
  const {
    tipos,
    refreshGlobalData,  // o usa refreshTipos si existe
    usuariosMap,
    loading: globalLoading,
  } = useGlobalData();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedTipoDetalle, setSelectedTipoDetalle] = useState(null);

  const [selectedTipo, setSelectedTipo] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // =========================
  // FILTRO
  // =========================
  const filteredTipos = useMemo(() => {
    if (!search.trim()) return tipos;

    const q = normalize(search);

    return tipos.filter((t) =>
      normalize(
        `${t.id_tipo} ${t.nombre_tipo} ${t.controla_stock} ${t.es_perecible} ${t.activo}`
      ).includes(q)
    );
  }, [tipos, search]);

  // =========================
  // FECHA/HORA (igual estilo)
  // =========================
  const getFecha = (fecha) => {
    if (!fecha) return "—";
    const date = new Date(String(fecha).replace(" ", "T"));
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getHora = (fecha) => {
    if (!fecha) return "—";
    const date = new Date(String(fecha).replace(" ", "T"));
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // =========================
  // POPUPS
  // =========================
  const openCreate = () => {
    setForm(makeEmptyForm());
    setSelectedTipo(null);
    setSelectedTipoDetalle(null);
    setError("");
    setSuccess("");
    setShowCreate(true);
  };

  const openEdit = (tipo) => {
    setSelectedTipo(tipo);
    setSelectedTipoDetalle(null);
    setError("");
    setSuccess("");

    setForm({
      nombre_tipo: tipo.nombre_tipo ?? "",
      controla_stock: tipo.controla_stock ?? 1,
      es_perecible: tipo.es_perecible ?? 0,
      fecha_perecible: tipo.fecha_perecible ?? "",
      activo: tipo.activo ?? 1,
    });

    setShowEdit(true);
  };

  const closePopups = () => {
    setShowCreate(false);
    setShowEdit(false);
    setSelectedTipo(null);
    setForm(makeEmptyForm());
    setError("");
  };

  // =========================
  // CREAR
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nombre_tipo.trim()) {
      setError("El nombre de tipo de ítem es obligatorio");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        nombre_tipo: form.nombre_tipo.trim(),
        controla_stock: Number(form.controla_stock ?? 1),
        es_perecible: Number(form.es_perecible ?? 0),
        fecha_perecible: form.fecha_perecible,
        activo: Number(form.activo ?? 1),
      };

      const res = await apiPost("tipos-item-crear", payload);

      if (res?.ok) {
        setSuccess("✅ Tipo de ítem creado correctamente");
        await refreshGlobalData(); // Refrescar datos globales
        setShowCreate(false);
      } else {
        setError(res?.message || "Error creando tipo de ítem");
      }
    } catch {
      setError("Error de servidor");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ACTUALIZAR
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTipo) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        id_tipo: selectedTipo.id_tipo,
        ...form,
        nombre_tipo: form.nombre_tipo.trim(),
        controla_stock: Number(form.controla_stock ?? 1),
        es_perecible: Number(form.es_perecible ?? 0),
        fecha_perecible: form.fecha_perecible,
        activo: Number(form.activo ?? 1),
      };

      const res = await apiPost("tipos-item-actualizar", payload);

      if (res?.ok) {
        setSuccess("✅ Tipo de ítem actualizado");
        await refreshGlobalData();
        setShowEdit(false);
        setSelectedTipo(null);
        setForm(makeEmptyForm());
      } else {
        setError(res?.message || "Error actualizando tipo de ítem");
      }
    } catch {
      setError("Error de servidor");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ELIMINAR (desactivación lógica)
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar tipo de ítem? (desactivación lógica)")) return;

    setError("");
    setSuccess("");

    try {
      const res = await apiPost(`tipos-item-eliminar/${id}`, {});
      if (res?.ok) {
        setSuccess("✅ Tipo de ítem desactivado");
        await refreshGlobalData();
      } else {
        setError(res?.message || "No se pudo desactivar el tipo de ítem");
      }
    } catch {
      setError("Error eliminando tipo de ítem");
    }
  };

  return (
    <div className="ctnGestion">
      <h2>Gestionar Tipos de Ítem</h2>

      <div className="ctnAllFilters">
        <div className="input-field">
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar tipo de ítem...</label>
        </div>

        <button className="btnAdd" onClick={openCreate}>
          <SVG.UserAdd />
          Nuevo tipo de ítem
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
              <th>Controla Stock</th>
              <th>Perecible</th>
              <th>Activo</th>
              <th>Editar</th>
            </tr>
          </thead>

          <tbody>
            {globalLoading ? (
              <tr>
                <td colSpan="6">Cargando...</td>
              </tr>
            ) : filteredTipos.length === 0 ? (
              <tr>
                <td colSpan="6">No hay tipos de ítem</td>
              </tr>
            ) : (
              filteredTipos.map((t) => (
                <tr key={t.id_tipo}>
                  <td className="clickable" onClick={() => setSelectedTipoDetalle(t)}>
                    {t.id_tipo}
                  </td>
                  <td>{t.nombre_tipo}</td>
                  <td>{t.controla_stock === 1 ? "Sí" : "No"}</td>
                  <td>{t.es_perecible === 1 ? "Sí" : "No"}</td>
                  <td>{t.activo === 1 ? "Sí" : "No"}</td>
                  <td className="actionsCell">
                    <div className="btnSmall" onClick={() => openEdit(t)}>
                      <SVG.Edit />
                    </div>
                    {/* <button className="btnSmall" onClick={() => handleDelete(t.id_tipo)}>
                      ❌
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== POPUP CREAR ===================== */}
      {showCreate && (
        <div className="popup">
          <div className="popup-content">
            <h3>Crear Tipo de Ítem</h3>

            <form onSubmit={handleCreate} autoComplete="off">
              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_tipo}
                  onChange={(e) => setForm({ ...form, nombre_tipo: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre tipo</label>
              </div>

              <div className="input-field">
                <select
                  value={form.controla_stock}
                  onChange={(e) => setForm({ ...form, controla_stock: Number(e.target.value) })}
                >
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
                <label>Controla stock</label>
              </div>

              <div className="input-field">
                <select
                  value={form.es_perecible}
                  onChange={(e) => setForm({ ...form, es_perecible: Number(e.target.value) })}
                >
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
                <label>Perecible</label>
              </div>

              <div className="input-field">
                <input
                  type="date"
                  value={form.fecha_perecible || ""}
                  onChange={(e) => setForm({ ...form, fecha_perecible: e.target.value })}
                />
                <label>Fecha Perecible</label>
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

      {/* ===================== POPUP EDITAR ===================== */}
      {showEdit && selectedTipo && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Tipo de Ítem</h3>

            <form onSubmit={handleUpdate} autoComplete="off">
              <div className="input-field">
                <input type="text" value={selectedTipo.id_tipo} disabled placeholder=" " />
                <label>ID Tipo</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_tipo}
                  onChange={(e) => setForm({ ...form, nombre_tipo: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre tipo</label>
              </div>

              <div className="input-field">
                <select
                  value={form.controla_stock}
                  onChange={(e) => setForm({ ...form, controla_stock: Number(e.target.value) })}
                >
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
                <label>Controla stock</label>
              </div>

              <div className="input-field">
                <select
                  value={form.es_perecible}
                  onChange={(e) => setForm({ ...form, es_perecible: Number(e.target.value) })}
                >
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
                <label>Perecible</label>
              </div>

              <div className="input-field">
                <input
                  type="date"
                  value={form.fecha_perecible || ""}
                  onChange={(e) => setForm({ ...form, fecha_perecible: e.target.value })}
                />
                <label>Fecha Perecible</label>
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

      {/* ===================== POPUP DETALLE ===================== */}
      {selectedTipoDetalle && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalle del Tipo de Ítem</h3>

            <div className="popup-item">
              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedTipoDetalle.id_tipo} readOnly />
                  <label>ID Tipo</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedTipoDetalle.nombre_tipo} readOnly />
                  <label>Nombre</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedTipoDetalle.controla_stock === 1 ? "Sí" : "No"} readOnly />
                  <label>Controla stock</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedTipoDetalle.es_perecible === 1 ? "Sí" : "No"} readOnly />
                  <label>Perecible</label>
                </div>
              </div>

              <div className="input-field">
                <input type="text" value={selectedTipoDetalle.fecha_perecible || "—"} readOnly />
                <label>Fecha Perecible</label>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={Number(selectedTipoDetalle.activo) === 1 ? "Sí" : "No"} readOnly />
                  <label>Activo</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={usuariosMap?.[selectedTipoDetalle.id_admin] ?? selectedTipoDetalle.id_admin ?? "—"}
                    readOnly
                  />
                  <label>Responsable</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedTipoDetalle.created_at)} readOnly />
                  <label>Fecha creación</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedTipoDetalle.created_at)} readOnly />
                  <label>Hora creación</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedTipoDetalle.updated_at)} readOnly />
                  <label>Última actualización</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedTipoDetalle.updated_at)} readOnly />
                  <label>Hora actualización</label>
                </div>
              </div>

            </div>

            <button className="closeForm" onClick={() => setSelectedTipoDetalle(null)}>
              <SVG.Close className="icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}