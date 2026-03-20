import { useMemo, useState } from "react";
import { apiPost } from "../../services/api";
import { useGlobalData } from "../../context/GlobalDataContext";
import { SVG } from "../../assets/imgSvg";
import "../../styles/usuarios.css";

const makeEmptyForm = () => ({
  nombre_categoria: "",
  descripcion: "",
  activo: 1,
});

export default function GestionarCategoriasItem() {
  const {
    categories = [],
    refreshGlobalData,  // o usa refreshCategorias si existe
    usuariosMap,
    loading: globalLoading,
  } = useGlobalData();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCategoriaDetalle, setSelectedCategoriaDetalle] = useState(null);

  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // =========================
  // FILTRO
  // =========================
  const filteredCategorias = useMemo(() => {
    if (!search.trim()) return categories;

    const q = normalize(search);

    return categories.filter((c) =>
      normalize(
        `${c.id_categoria} ${c.nombre_categoria} ${c.descripcion} ${c.activo}`
      ).includes(q)
    );
  }, [categories, search]);

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
    setSelectedCategoria(null);
    setSelectedCategoriaDetalle(null);
    setError("");
    setSuccess("");
    setShowCreate(true);
  };

  const openEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setSelectedCategoriaDetalle(null);
    setError("");
    setSuccess("");

    setForm({
      nombre_categoria: categoria.nombre_categoria ?? "",
      descripcion: categoria.descripcion ?? "",
      activo: categoria.activo ?? 1,
    });

    setShowEdit(true);
  };

  const closePopups = () => {
    setShowCreate(false);
    setShowEdit(false);
    setSelectedCategoria(null);
    setForm(makeEmptyForm());
    setError("");
  };

  // =========================
  // CREAR
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nombre_categoria.trim()) {
      setError("El nombre de categoría es obligatorio");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        nombre_categoria: form.nombre_categoria.trim(),
        descripcion: form.descripcion.trim(),
        activo: Number(form.activo ?? 1),
      };

      const res = await apiPost("categorias-item-crear", payload);

      if (res?.ok) {
        setSuccess("✅ Categoría creada correctamente");
        await refreshGlobalData(); // Refrescar datos globales
        setShowCreate(false);
      } else {
        setError(res?.message || "Error creando categoría");
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
    if (!selectedCategoria) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        id_categoria: selectedCategoria.id_categoria,
        ...form,
        nombre_categoria: form.nombre_categoria.trim(),
        descripcion: form.descripcion.trim(),
        activo: Number(form.activo ?? 1),
      };

      const res = await apiPost("categorias-item-actualizar", payload);

      if (res?.ok) {
        setSuccess("✅ Categoría actualizada");
        await refreshGlobalData();
        setShowEdit(false);
        setSelectedCategoria(null);
        setForm(makeEmptyForm());
      } else {
        setError(res?.message || "Error actualizando categoría");
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
    if (!window.confirm("¿Eliminar categoría? (desactivación lógica)")) return;

    setError("");
    setSuccess("");

    try {
      const res = await apiPost(`categorias-item-eliminar/${id}`, {});
      if (res?.ok) {
        setSuccess("✅ Categoría desactivada");
        await refreshGlobalData();
      } else {
        setError(res?.message || "No se pudo desactivar la categoría");
      }
    } catch {
      setError("Error eliminando categoría");
    }
  };

  return (
    <div className="ctnGestion">
      <h2>Gestionar Categorías de Ítem</h2>

      <div className="ctnAllFilters">
        <div className="input-field">
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar categoría...</label>
        </div>

        <button className="btnAdd" onClick={openCreate}>
          <SVG.Add />
          Nueva categoría
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
              <th>Descripción</th>
              <th>Activo</th>
              <th>Editar</th>
            </tr>
          </thead>

          <tbody>
            {globalLoading ? (
              <tr>
                <td colSpan="5">Cargando...</td>
              </tr>
            ) : filteredCategorias.length === 0 ? (
              <tr>
                <td colSpan="5">No hay categorías</td>
              </tr>
            ) : (
              filteredCategorias.map((c) => (
                <tr key={c.id_categoria}>
                  <td className="clickable" onClick={() => setSelectedCategoriaDetalle(c)}>
                    {c.id_categoria}
                  </td>
                  <td>{c.nombre_categoria}</td>
                  <td>{c.descripcion}</td>
                  <td>{Number(c.activo) === 1 ? "Sí" : "No"}</td>
                  <td className="actionsCell">
                    <div className="btnSmall" onClick={() => openEdit(c)}>
                      <SVG.Edit />
                    </div>
                    {/* <button className="btnSmall" onClick={() => handleDelete(c.id_categoria)}>
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
            <h3>Crear Categoría</h3>

            <form onSubmit={handleCreate} autoComplete="off">
              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_categoria}
                  onChange={(e) => setForm({ ...form, nombre_categoria: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre categoría</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder=" "
                />
                <label>Descripción</label>
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
      {showEdit && selectedCategoria && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Categoría</h3>

            <form onSubmit={handleUpdate} autoComplete="off">
              <div className="input-field">
                <input type="text" value={selectedCategoria.id_categoria} disabled placeholder=" " />
                <label>ID Categoría</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_categoria}
                  onChange={(e) => setForm({ ...form, nombre_categoria: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre categoría</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder=" "
                />
                <label>Descripción</label>
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
      {selectedCategoriaDetalle && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalle de Categoría</h3>

            <div className="popup-item">
              {/* <div className="triple__form"> */}
              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedCategoriaDetalle.id_categoria} readOnly />
                  <label>ID Categoría</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedCategoriaDetalle.nombre_categoria} readOnly />
                  <label>Nombre</label>
                </div>
              </div>

              <div className="double__form">
                
                <div className="input-field">
                  <input
                    type="text"
                    value={selectedCategoriaDetalle.activo === 1 ? "Sí" : "No"}
                    readOnly
                  />
                  <label>Activo</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={usuariosMap?.[selectedCategoriaDetalle.id_admin] ?? selectedCategoriaDetalle.id_admin ?? "—"}
                    readOnly
                  />
                  <label>Responsable</label>
                </div>
              </div>


              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedCategoriaDetalle.created_at)} readOnly />
                  <label>Fecha creación</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedCategoriaDetalle.created_at)} readOnly />
                  <label>Hora creación</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedCategoriaDetalle.updated_at)} readOnly />
                  <label>Última actualización</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedCategoriaDetalle.updated_at)} readOnly />
                  <label>Hora actualización</label>
                </div>
              </div>
              
              <div className="input-field">
                <input type="text" value={selectedCategoriaDetalle.descripcion} readOnly />
                <label>Descripción</label>
              </div>
            </div>

            <button className="closeForm" onClick={() => setSelectedCategoriaDetalle(null)}>
              <SVG.Close className="icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}