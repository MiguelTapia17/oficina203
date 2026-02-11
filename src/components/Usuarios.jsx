import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../services/api";
import "../styles/usuarios.css";


export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch de usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await apiGet("usuarios");
        setUsuarios(response.data);
      } catch (error) {
        setError("Error al obtener usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // Crear usuario
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiPost("usuarios-crear", { usuario, password, rol });
      if (response.ok) {
        setUsuarios([...usuarios, response.data]); // Agrega el nuevo usuario a la lista
        setUsuario("");
        setPassword("");
        setRol("");
      } else {
        setError("Error creando el usuario");
      }
    } catch (err) {
      setError("Error de servidor");
    }
  };

  // Eliminar usuario
  const handleEliminarUsuario = async (id) => {
    try {
      const response = await apiPost(`usuarios-eliminar/${id}`);
      if (response.ok) {
        setUsuarios(usuarios.filter((user) => user.id !== id)); // Elimina el usuario de la lista
      } else {
        setError("No se pudo eliminar el usuario");
      }
    } catch (error) {
      setError("Error eliminando el usuario");
    }
  };

  // Actualizar rol de usuario
  const handleActualizarRol = async (id, newRole) => {
    try {
      const response = await apiPost(`usuarios-actualizar/${id}`, { rol: newRole });
      if (response.ok) {
        const updatedUsuarios = usuarios.map((user) =>
          user.id === id ? { ...user, rol: newRole } : user
        );
        setUsuarios(updatedUsuarios);
      } else {
        setError("Error actualizando el rol");
      }
    } catch (error) {
      setError("Error al actualizar el rol");
    }
  };

  return (
    <div className="gestionUsuarios">
      <h2>Gestionar Usuarios</h2>

      {/* Formulario de creación de usuario */}
      <form onSubmit={handleCrearUsuario}>
        <div className="triple__form">
            <div className="input-field">
            <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="" required/>
            <label>Nombre de Usuario</label>
            </div>
            <div className="input-field">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" required/>
            <label>Contraseña</label>
            </div>
            <div className="input-field">
            <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                <option value=""></option>
                <option value="admin">Administrador</option>
                <option value="usuario">Usuario</option>
                <option value="superadmin">Superadmin</option>
            </select>
            <label>Seleccionar rol</label>
            </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Crear Usuario"}
        </button>
        {error && <p className="errorTxt">{error}</p>}
      </form>

      {/* Lista de usuarios */}
      <div className="usuariosLista">
        <h3>Usuarios Registrados</h3>
        <div className="ctnUsuarios">
          {usuarios.length === 0 ? (
            <p>No hay usuarios registrados</p>
          ) : (
            usuarios.map((user) => (
              <div key={user.id} className="usuarioItem">
                <p>
                  <strong>{user.usuario}</strong> - {user.rol}
                </p>
                  {/* Selector de roles */}
                  <select value={user.rol} onChange={(e) => handleActualizarRol(user.id, e.target.value)}>
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                    <option value="superadmin">Superadmin</option>
                  </select>

                  {/* Botón de eliminación */}
                  <button onClick={() => handleEliminarUsuario(user.id)}>
                    Eliminar
                  </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
