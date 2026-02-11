import { useState, useEffect } from 'react';
import { apiGet, apiPost } from "../services/api";
import { SVG } from "../assets/imgSvg";
import '../styles/inventario.css';

export default function Inventario() {

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editStock, setEditStock] = useState("");

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // =======================
  // CARGAR ITEMS
  // =======================
  const fetchItems = async () => {
    try {
      const data = await apiGet(`items?t=${Date.now()}`); // evita cache
      setItems(data.data);

      const uniqueCategories = [
        ...new Set(data.data.map(item => item.nombre_categoria))
      ];
      setCategories(uniqueCategories);

    } catch (error) {
      setError("No se pudo cargar el inventario.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // =======================
  // FILTRO
  // =======================
  const filteredItems = items.filter((item) => {

    const matchesCategory = categoryFilter
      ? item.nombre_categoria === categoryFilter
      : true;

    if (!search.trim()) return matchesCategory;

    const rowString = normalize(`
      ${item.id_item}
      ${item.nombre_item}
      ${item.descripcion}
    `);

    return matchesCategory && rowString.includes(normalize(search));
  });

  // =======================
  // ABRIR EDITAR
  // =======================
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditStock(item.cantidad_disponible ?? 0);
    setShowEditPopup(true);
  };

  // =======================
  // GUARDAR STOCK
  // =======================
  const handleSaveStock = async () => {

    if (editStock === "" || Number(editStock) < 0) {
      alert("Cantidad inválida");
      return;
    }

    try {
      // obtener item real
      const res = await apiGet(`items/${selectedItem.id_item}?t=${Date.now()}`);
      const item = res.data;

      const payload = {
        id_item: Number(item.id_item),
        nombre_item: String(item.nombre_item),
        id_categoria: Number(item.id_categoria),
        id_tipo: Number(item.id_tipo),
        id_unidad: Number(item.id_unidad),
        descripcion: item.descripcion ?? "",
        cantidad: Number(editStock),
        activo: Number(item.activo ?? 1),
        id_admin: Number(item.id_admin)
      };

      const update = await apiPost("items-actualizar", payload);

      if (!update.ok) throw new Error("Falló actualización");

      // 🔥 ACTUALIZAR LOCALMENTE SIN ESPERAR REFETCH
      setItems(prev => prev.map(i =>
        i.id_item === item.id_item
          ? { ...i, cantidad_disponible: Number(editStock) }
          : i
      ));

      // cerrar popup
      setShowEditPopup(false);
      setSelectedItem(null);

      // sincronizar silenciosamente con backend
      fetchItems();

    } catch (error) {
      console.error(error);
      alert("El servidor rechazó la actualización");
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="inventario">
      <h2>Inventario</h2>

      <div className="filters">

        <div className='input-field'>
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar en inventario</label>
        </div>

        <div className='input-field'>
          <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
            <option value="">Todas las categorias</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <label>Categoria</label>
        </div>

      </div>

      {showEditPopup && selectedItem && (
        <div className="popup">
          <div className="popup-content editStock">

            <h3>Editar Stock</h3>

            <div className='input-field'>
              <input value={selectedItem.id_item} readOnly disabled/>
              <label className="active">ID</label>
            </div>

            <div className='input-field'>
              <input value={selectedItem.nombre_item} readOnly disabled/>
              <label className="active">Nombre</label>
            </div>

            <div className='input-field'>
              <input value={selectedItem.nombre_categoria} readOnly disabled />
              <label className="active">Categoría</label>
            </div>

            <div className='input-field'>
              <input value={selectedItem.descripcion} readOnly disabled/>
              <label className="active">Descripción</label>
            </div>

            <div className='input-field'>
              <input
                type="number"
                min="0"
                step="1"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
              />
              <label className="active">Stock disponible</label>
            </div>

            <div className="actions">
              <button className="saveEdit" onClick={handleSaveStock}>Guardar</button>
              <button className="closeForm" onClick={() => setShowEditPopup(false)}>
                <SVG.Close className="icon"/>
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="ctnTable">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id_item}>
                <td>{item.id_item}</td>
                <td>{item.nombre_item}</td>
                <td>{item.nombre_categoria}</td>
                <td>{item.descripcion}</td>
                <td>{parseInt(item.cantidad_disponible)}</td>
                <td className="center">
                  <SVG.BoxEdit className="icon" onClick={() => handleEdit(item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
