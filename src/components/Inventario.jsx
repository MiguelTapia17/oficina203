import { useState, useEffect } from 'react';
import { apiGet } from "../services/api";
import { SVG } from "../assets/imgSvg";
import '../styles/inventario.css';

export default function Inventario({ loading }) {  // Recibimos el estado de carga desde Dashboard
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");  // Buscador por nombre
  const [id, setID] = useState("");  // Buscador por ID
  const [categoryFilter, setCategoryFilter] = useState("");  // Filtro Categoria
  const [categories, setCategories] = useState([]);  // Estado para las categorías únicas

  const [editingItem, setEditingItem] = useState(null);  // Estado para el ítem que estamos editando
  const [newQuantity, setNewQuantity] = useState("");  // Estado para la nueva cantidad del ítem
  

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await apiGet("items");  // Llamada a la API para obtener los items
        setItems(data.data);
        
        // Extraer las categorías únicas de los items
        const uniqueCategories = [
          ...new Set(data.data.map(item => item.nombre_categoria))
        ];
        setCategories(uniqueCategories);  // Guardar las categorías únicas en el estado
      } catch (error) {
        setError("No se pudo cargar el inventario.");
      }
    };

    fetchItems();
  }, []);

  // Filtrado por nombre, categoría e ID
  const filteredItems = items.filter((item) => {
    const matchesName = item.nombre_item.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? item.nombre_categoria === categoryFilter : true;
    const matchesID = id ? item.id_item.toString().includes(id) : true;  // Filtro por ID
    return matchesName && matchesCategory && matchesID;  // Filtrado combinado
  });

  // Función para manejar la edición de la cantidad
  const handleEdit = (item) => {
    setEditingItem(item);  // Establecemos el ítem que estamos editando
    setNewQuantity(item.cantidad);  // Establecemos el valor actual de cantidad como valor inicial
  };

  // Función para guardar los cambios de cantidad
  const handleSave = () => {
    // Aquí podrías realizar una llamada a la API para actualizar el stock
    const updatedItem = {
      ...editingItem,
      cantidad: newQuantity
    };

    // Actualizamos el estado de los items
    setItems(items.map(item => item.id_item === updatedItem.id_item ? updatedItem : item));
    setEditingItem(null);  // Cerramos el modo de edición
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="inventario">
      <h2>Inventario</h2>
      <div className="filters">
        {/* Filtro por ID */}
        <input type="number" placeholder="Buscar por ID"
          value={id}
          onChange={(e) => setID(e.target.value)}  // Actualiza el estado del filtro por ID
        />
        {/* Buscador por nombre */}
        <input type="text" placeholder="Buscar por nombre" value={search} 
        onChange={(e) => setSearch(e.target.value)}  // Actualiza el estado del buscador por nombre
        />

        {/* Filtro por categoría dinámica */}
        <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
          <option value="">Todas las categorías</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>

      </div>
      <div className='ctnTable'>
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
                <td>
                  {editingItem && editingItem.id_item === item.id_item ? (
                    <input className='cantidad' type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)}/>  // Actualiza la nueva cantidad
                  ) : (
                    parseInt(item.cantidad_disponible)
                  )}
                </td>
                <td className="center">
                  {editingItem && editingItem.id_item === item.id_item ? (
                    <button onClick={handleSave}>
                      Guardar
                    </button>
                  ) : (
                    <SVG.BoxEdit className="icon" onClick={() => handleEdit(item)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
