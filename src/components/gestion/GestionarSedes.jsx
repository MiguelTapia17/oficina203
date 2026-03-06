import { useMemo, useState } from "react";
import { apiPost } from "../../services/api";
import { useGlobalData } from "../../context/GlobalDataContext";
import { SVG } from "../../assets/imgSvg";
import "../../styles/usuarios.css";

const makeEmptyForm = () => ({
  nombre_sede: "",
  tipo_sede: "",
  direccion: "",
  distrito: "",
  provincia: "",
  departamento: "",
  activo: 1,
});

export default function GestionarSedes() {
  const {
    sedes,
    usuariosMap,
    loading: globalLoading,
    // ideal: refreshSedes. Si no lo tienes, usa refreshGlobalData.
    refreshSedes,
    refreshGlobalData,
  } = useGlobalData();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedSedeDetalle, setSelectedSedeDetalle] = useState(null);

  const [selectedSede, setSelectedSede] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const doRefresh = async () => {
    // Si existe refreshSedes, úsalo. Si no, fallback a refreshGlobalData.
    if (typeof refreshSedes === "function") return refreshSedes();
    if (typeof refreshGlobalData === "function") return refreshGlobalData();
  };

  // =========================
  // FILTRO
  // =========================
  // const filteredSedes = useMemo(() => {
  //   if (!search.trim()) return sedes || [];

  //   const q = normalize(search);

  //   return (sedes || []).filter((s) =>
  //     normalize(
  //       `${s.id_sede} ${s.nombre_sede} ${s.tipo_sede} ${s.direccion} ${s.distrito} ${s.provincia} ${s.departamento} ${s.activo}`
  //     ).includes(q)
  //   );
  // }, [sedes, search]);
  const filteredSedes = useMemo(() => {
  const base = Array.isArray(sedes) ? [...sedes] : [];

  // 🔹 Ordenar por ID ascendente
  base.sort((a, b) => Number(a.id_sede) - Number(b.id_sede));

  if (!search.trim()) return base;

  const q = normalize(search);

  return base.filter((s) =>
    normalize(
      `${s.id_sede} ${s.nombre_sede} ${s.tipo_sede} ${s.direccion} ${s.distrito} ${s.provincia} ${s.departamento} ${s.activo}`
    ).includes(q)
  );
}, [sedes, search]);

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
    setSelectedSede(null);
    setSelectedSedeDetalle(null);
    setError("");
    setSuccess("");
    setShowCreate(true);
  };

  const openEdit = (sede) => {
    setSelectedSede(sede);
    setSelectedSedeDetalle(null);
    setError("");
    setSuccess("");

    setForm({
      nombre_sede: sede.nombre_sede ?? "",
      tipo_sede: sede.tipo_sede ?? "",
      direccion: sede.direccion ?? "",
      distrito: sede.distrito ?? "",
      provincia: sede.provincia ?? "",
      departamento: sede.departamento ?? "",
      activo: sede.activo ?? 1,
    });

    setShowEdit(true);
  };

  const closePopups = () => {
    setShowCreate(false);
    setShowEdit(false);
    setSelectedSede(null);
    setForm(makeEmptyForm());
    setError("");
  };

  // =========================
  // CREAR
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nombre_sede.trim()) {
      setError("El nombre de sede es obligatorio");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        nombre_sede: form.nombre_sede.trim(),
        tipo_sede: (form.tipo_sede ?? "").trim(),
        direccion: (form.direccion ?? "").trim(),
        distrito: (form.distrito ?? "").trim(),
        provincia: (form.provincia ?? "").trim(),
        departamento: (form.departamento ?? "").trim(),
        activo: Number(form.activo ?? 1),
      };

      const res = await apiPost("sedes-crear", payload);

      if (res?.ok) {
        setSuccess("✅ Sede creada correctamente");
        await doRefresh();
        setShowCreate(false);
      } else {
        setError(res?.message || "Error creando sede");
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
    if (!selectedSede) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        id_sede: selectedSede.id_sede,
        ...form,
        nombre_sede: form.nombre_sede.trim(),
        tipo_sede: (form.tipo_sede ?? "").trim(),
        direccion: (form.direccion ?? "").trim(),
        distrito: (form.distrito ?? "").trim(),
        provincia: (form.provincia ?? "").trim(),
        departamento: (form.departamento ?? "").trim(),
        activo: Number(form.activo ?? 1),
      };

      const res = await apiPost("sedes-actualizar", payload);

      if (res?.ok) {
        setSuccess("✅ Sede actualizada");
        await doRefresh();
        setShowEdit(false);
        setSelectedSede(null);
        setForm(makeEmptyForm());
      } else {
        setError(res?.message || "Error actualizando sede");
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
    if (!window.confirm("¿Eliminar sede? (desactivación lógica)")) return;

    setError("");
    setSuccess("");

    try {
      const res = await apiPost(`sedes-eliminar/${id}`, {});
      if (res?.ok) {
        setSuccess("✅ Sede desactivada");
        await doRefresh();
      } else {
        setError(res?.message || "No se pudo desactivar la sede");
      }
    } catch {
      setError("Error eliminando sede");
    }
  };

  return (
    <div className="ctnGestion">
      <h2>Gestionar Sedes</h2>

      <div className="ctnAllFilters">
        <div className="input-field">
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar sede...</label>
        </div>

        <button className="btnAdd" onClick={openCreate}>
          <SVG.LocationAdd />
          Nueva sede
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
              <th>Distrito</th>
              {/* <th>Provincia</th> */}
              <th>Activo</th>
              <th>Editar</th>
            </tr>
          </thead>

          <tbody>
            {globalLoading ? (
              <tr>
                <td colSpan="7">Cargando...</td>
              </tr>
            ) : filteredSedes.length === 0 ? (
              <tr>
                <td colSpan="7">No hay sedes</td>
              </tr>
            ) : (
              filteredSedes.map((s) => (
                <tr key={s.id_sede}>
                  <td className="clickable" onClick={() => setSelectedSedeDetalle(s)}>
                    {s.id_sede}
                  </td>
                  <td>{s.nombre_sede}</td>
                  <td>{s.tipo_sede}</td>
                  <td>{s.distrito}</td>
                  {/* <td>{s.provincia}</td> */}
                  <td>{Number(s.activo) === 1 ? "Sí" : "No"}</td>
                  <td className="actionsCell">
                    <div className="btnSmall" onClick={() => openEdit(s)}>
                      <SVG.LocationEdit />
                    </div>
                    {/* <button className="btnSmall" onClick={() => handleDelete(s.id_sede)}>
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
            <h3>Crear Sede</h3>

            <form onSubmit={handleCreate} autoComplete="off">
              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_sede}
                  onChange={(e) => setForm({ ...form, nombre_sede: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre sede</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.tipo_sede}
                  onChange={(e) => setForm({ ...form, tipo_sede: e.target.value })}
                  placeholder=" "
                />
                <label>Tipo sede</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  placeholder=" "
                />
                <label>Dirección</label>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    value={form.distrito}
                    onChange={(e) => setForm({ ...form, distrito: e.target.value })}
                    placeholder=" "
                  />
                  <label>Distrito</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={form.provincia}
                    onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                    placeholder=" "
                  />
                  <label>Provincia</label>
                </div>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.departamento}
                  onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                  placeholder=" "
                />
                <label>Departamento</label>
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
      {showEdit && selectedSede && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Sede</h3>

            <form onSubmit={handleUpdate} autoComplete="off">
              <div className="input-field">
                <input type="text" value={selectedSede.id_sede} disabled placeholder=" " />
                <label>ID Sede</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.nombre_sede}
                  onChange={(e) => setForm({ ...form, nombre_sede: e.target.value })}
                  placeholder=" "
                  required
                />
                <label>Nombre sede</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.tipo_sede}
                  onChange={(e) => setForm({ ...form, tipo_sede: e.target.value })}
                  placeholder=" "
                />
                <label>Tipo sede</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  placeholder=" "
                />
                <label>Dirección</label>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    value={form.distrito}
                    onChange={(e) => setForm({ ...form, distrito: e.target.value })}
                    placeholder=" "
                  />
                  <label>Distrito</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={form.provincia}
                    onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                    placeholder=" "
                  />
                  <label>Provincia</label>
                </div>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  value={form.departamento}
                  onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                  placeholder=" "
                />
                <label>Departamento</label>
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
      {selectedSedeDetalle && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalle de Sede</h3>

            <div className="popup-item">
              <div className="triple__form">
                <div className="input-field">
                  <input type="text" value={selectedSedeDetalle.id_sede} readOnly />
                  <label>ID Sede</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getFecha(selectedSedeDetalle.created_at)} readOnly />
                  <label>Fecha creación</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedSedeDetalle.created_at)} readOnly />
                  <label>Hora creación</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={selectedSedeDetalle.nombre_sede ?? "—"} readOnly />
                  <label>Nombre</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedSedeDetalle.tipo_sede ?? "—"} readOnly />
                  <label>Tipo</label>
                </div>
              </div>

              <div className="input-field">
                <input type="text" value={selectedSedeDetalle.direccion ?? "—"} readOnly />
                <label>Dirección</label>
              </div>

              <div className="triple__form">
                <div className="input-field">
                  <input type="text" value={selectedSedeDetalle.distrito ?? "—"} readOnly />
                  <label>Distrito</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedSedeDetalle.provincia ?? "—"} readOnly />
                  <label>Provincia</label>
                </div>

                <div className="input-field">
                  <input type="text" value={selectedSedeDetalle.departamento ?? "—"} readOnly />
                  <label>Departamento</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={Number(selectedSedeDetalle.activo) === 1 ? "Sí" : "No"} readOnly />
                  <label>Activo</label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={usuariosMap?.[selectedSedeDetalle.id_admin] ?? selectedSedeDetalle.id_admin ?? "—"}
                    readOnly
                  />
                  <label>Responsable</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input type="text" value={getFecha(selectedSedeDetalle.updated_at)} readOnly />
                  <label>Última actualización</label>
                </div>

                <div className="input-field">
                  <input type="text" value={getHora(selectedSedeDetalle.updated_at)} readOnly />
                  <label>Hora actualización</label>
                </div>
              </div>
            </div>

            <button className="closeForm" onClick={() => setSelectedSedeDetalle(null)}>
              <SVG.Close className="icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}