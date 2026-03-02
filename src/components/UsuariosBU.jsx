import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../services/api";
import { SVG } from "../assets/imgSvg";
import "../styles/usuarios.css";

const makeEmptyForm = () => ({
  usuario: "",
  password: "", // en editar: opcional, si va vacío no se envía
  nombre_completo: "",
  email: "",
  rol: "",
  estado: "activo",
  id_sede: 1,
});

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  // Popups
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Form
  const [selectedUser, setSelectedUser] = useState(null); // el usuario de la fila
  const [form, setForm] = useState(makeEmptyForm());

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const fetchUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet("usuarios");
      if (res?.ok) {
        setUsuarios(Array.isArray(res.data) ? res.data : []);
      } else {
        setUsuarios([]);
        setError(res?.message || "Error al obtener usuarios");
      }
    } catch (e) {
      setUsuarios([]);
      setError("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredUsuarios = useMemo(() => {
    if (!search.trim()) return usuarios;

    const q = normalize(search);
    return usuarios.filter((u) => {
      const row = normalize(
        `${u.id_admin} ${u.usuario} ${u.nombre_completo} ${u.email} ${u.rol} ${u.estado} ${u.id_sede}`
      );
      return row.includes(q);
    });
  }, [usuarios, search]);

  const openCreate = () => {
    setError("");
    setSuccess("");
    setSelectedUser(null);
    setForm(makeEmptyForm());
    setShowCreate(true);
  };

  const openEdit = (u) => {
    setError("");
    setSuccess("");
    setSelectedUser(u);
    setForm({
      usuario: u.usuario ?? "",
      password: "", // opcional
      nombre_completo: u.nombre_completo ?? "",
      email: u.email ?? "",
      rol: u.rol ?? "",
      estado: u.estado ?? "activo",
      id_sede: Number(u.id_sede ?? 1),
    });
    setShowEdit(true);
  };

  const closePopups = () => {
    setShowCreate(false);
    setShowEdit(false);
    setSelectedUser(null);
    setForm(makeEmptyForm());
    setError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // validaciones mínimas
    if (!form.usuario.trim()) {
      setSaving(false);
      setError("El usuario es obligatorio");
      return;
    }
    if (!form.password) {
      setSaving(false);
      setError("La contraseña es obligatoria");
      return;
    }
    if (!form.rol) {
      setSaving(false);
      setError("Seleccione un rol");
      return;
    }

    try {
      const payload = {
        usuario: form.usuario.trim(),
        password: form.password,
        nombre_completo: form.nombre_completo?.trim() || "",
        email: form.email?.trim() || "",
        rol: form.rol,
        estado: form.estado || "activo",
        id_sede: Number(form.id_sede || 1),
      };

      const res = await apiPost("usuarios-crear", payload);

      if (res?.ok) {
        setSuccess("✅ Usuario creado correctamente");
        // lo más confiable: recargar lista
        await fetchUsuarios();
        setShowCreate(false);
        setForm(makeEmptyForm());
      } else {
        setError(res?.message || "Error creando el usuario");
      }
    } catch (err) {
      setError("Error de servidor creando el usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser?.id_admin) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // payload completo (como pide tu API)
      const payload = {
        id_admin: Number(selectedUser.id_admin),
        usuario: form.usuario.trim(),
        nombre_completo: form.nombre_completo?.trim() || "",
        email: form.email?.trim() || "",
        rol: form.rol,
        estado: form.estado,
        id_sede: Number(form.id_sede || 1),
        ...(form.password ? { password: form.password } : {}), // solo si se escribe
      };

      const res = await apiPost("usuarios-actualizar", payload);

      if (res?.ok) {
        setSuccess("✅ Usuario actualizado");
        await fetchUsuarios();
        setShowEdit(false);
        setSelectedUser(null);
        setForm(makeEmptyForm());
      } else {
        setError(res?.message || "Error actualizando el usuario");
      }
    } catch (err) {
      setError("Error de servidor actualizando el usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id_admin) => {
    const ok = window.confirm("¿Seguro que deseas desactivar este usuario?");
    if (!ok) return;

    setError("");
    setSuccess("");

    try {
      const res = await apiPost(`usuarios-eliminar/${id_admin}`, {});
      if (res?.ok) {
        setSuccess("✅ Usuario desactivado");
        await fetchUsuarios();
      } else {
        setError(res?.message || "No se pudo desactivar el usuario");
      }
    } catch (err) {
      setError("Error desactivando el usuario");
    }
  };

  return (
    <div className="gestionUsuarios">
      <h2>Gestionar Usuarios</h2>

      <div className="filtersUsuarios">
        <div className="input-field">
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar (id, usuario, nombre, email, rol...)</label>
        </div>

        <button className="btnPrimary" onClick={openCreate}>
          + Nuevo usuario
        </button>
      </div>

      {error && <p className="errorTxt">{error}</p>}
      {success && <p className="successTxt">{success}</p>}

      <div className="ctnTable">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Sede</th>
              <th>Último acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Cargando...</td>
              </tr>
            ) : filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan="9">No hay usuarios registrados</td>
              </tr>
            ) : (
              filteredUsuarios.map((u) => (
                <tr key={u.id_admin}>
                  <td>{u.id_admin}</td>
                  <td>{u.usuario}</td>
                  <td>{u.nombre_completo}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>{u.estado}</td>
                  <td>{u.id_sede}</td>
                  <td>{u.ultimo_acceso ?? "-"}</td>
                  <td className="actionsCell">
                    <button className="btnSmall" onClick={() => openEdit(u)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Crear */}
      {showCreate && (
        <div className="popup">
          <div className="popup-content">
            <h3>Crear usuario</h3>

            <form onSubmit={handleCreate} autoComplete="off">
              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    name="new_usuario"
                    autoComplete="off"
                    value={form.usuario}
                    onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                    placeholder=" "
                    required
                  />
                  <label>Usuario</label>
                </div>

                <div className="input-field">
                  <input
                    type="password"
                    name="new_password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder=" "
                    required
                  />
                  <label>Contraseña</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    value={form.nombre_completo}
                    onChange={(e) =>
                      setForm({ ...form, nombre_completo: e.target.value })
                    }
                    placeholder=" "
                  />
                  <label>Nombre completo</label>
                </div>

                <div className="input-field">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder=" "
                  />
                  <label>Email</label>
                </div>
              </div>

              <div className="triple__form">
                <div className="input-field">
                  <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    required
                  >
                    <option value=""></option>
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                  <label>Rol</label>
                </div>

                <div className="input-field">
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                  <label>Estado</label>
                </div>

                <div className="input-field">
                  <input
                    type="number"
                    min="1"
                    value={form.id_sede}
                    onChange={(e) => setForm({ ...form, id_sede: e.target.value })}
                    placeholder=" "
                  />
                  <label>ID Sede</label>
                </div>
              </div>

              {error && <p className="errorTxt">{error}</p>}

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

      {/* Popup Editar */}
      {showEdit && selectedUser && (
        <div className="popup">
          <div className="popup-content">
            {/* <h3>Editar usuario (ID:  {selectedUser.id_admin})</h3> */}
            <h3>Editar usuario </h3>

            <form onSubmit={handleUpdate}>
              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    value={selectedUser.id_admin}
                    onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                    placeholder=" "
                    required
                    disabled
                  />
                  <label>Id</label>
                </div>

                <div className="input-field">
                  <input
                    type="number"
                    min="1"
                    value={form.id_sede}
                    onChange={(e) =>
                      setForm({ ...form, id_sede: e.target.value })
                    }
                    placeholder=" "
                  />
                  <label>ID Sede</label>
                </div>

              </div>

            <div className="double__form">
              <div className="input-field">
                  <input
                    type="text"
                    value={form.usuario}
                    onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                    placeholder=" "
                    required
                  />
                  <label>Usuario</label>
                </div>

                <div className="input-field">
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder=" "
                  />
                  <label>Nueva contraseña (opcional)</label>
                </div>
            </div>

              <div className="double__form">
                <div className="input-field">
                  <input
                    type="text"
                    value={form.nombre_completo}
                    onChange={(e) =>
                      setForm({ ...form, nombre_completo: e.target.value })
                    }
                    placeholder=" "
                  />
                  <label>Nombre completo</label>
                </div>

                <div className="input-field">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder=" "
                  />
                  <label>Email</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    required
                  >
                    <option value=""></option>
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                    <option value="asesor">Asesor</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                  <label>Rol</label>
                </div>

                <div className="input-field">
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                  <label>Estado</label>
                </div>

                
              </div>

              {error && <p className="errorTxt">{error}</p>}

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
    </div>
  );
}