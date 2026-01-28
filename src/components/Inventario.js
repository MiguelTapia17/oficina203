// import { useState, useEffect } from 'react';
// import { apiGet } from "../services/api";
// import '../styles/inventario.css';

// export default function Inventario() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const data = await apiGet("items");
//         setItems(data.data);
//         setLoading(false);
//       } catch (error) {
//         setError("No se pudo cargar el inventario.");
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   // loader
//   if (loading) {
//     return (
//       <div class="loader">
//         <div class="box1"></div>
//         <div class="box2"></div>
//         <div class="box3"></div>
//       </div>

//     );
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div className="inventario">
//       <h2>Inventario</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Id</th>
//             <th>Nombre</th>
//             <th>Categoría</th>
//             {/* <th>Cantidad</th> */}
//             <th>Descripción</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => (
//             <tr key={item.id_item}>
//               <td>{item.id_item}</td>
//               <td>{item.nombre_item}</td>
//               <td>{item.nombre_categoria}</td>
//               {/* <td>{item.cantidad}</td> */}
//               <td>{item.descripcion}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
/* PARTE 2 */


import { useState, useEffect } from 'react';
import { apiGet } from "../services/api";
import '../styles/inventario.css';

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");  // Estado para el buscador por nombre
  const [categoryFilter, setCategoryFilter] = useState("");  // Filtro por categoría

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await apiGet("items");  // Llamada a la API para obtener los items
        setItems(data.data);
        setLoading(false);
      } catch (error) {
        setError("No se pudo cargar el inventario.");
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filtrado por nombre y categoría
  const filteredItems = items.filter((item) => {
    const matchesName = item.nombre_item.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? item.nombre_categoria === categoryFilter : true;
    return matchesName && matchesCategory;
  });

  // loader
  if (loading) {
    return (
      <div className="loader">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="inventario">
      <h2>Inventario</h2>

      {/* Buscador */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}  // Actualiza el estado del buscador
        />

        {/* Filtro por categoría */}
        <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
          <option value="">Todas las categorías</option>
          {/* Aquí asumo que tienes varias categorías para mostrar */}
          <option value="Categoria A">Categoria A</option>
          <option value="Categoria B">Categoria B</option>
          <option value="Categoria C">Categoria C</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id_item}>
              <td>{item.id_item}</td>
              <td>{item.nombre_item}</td>
              <td>{item.nombre_categoria}</td>
              <td>{item.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
