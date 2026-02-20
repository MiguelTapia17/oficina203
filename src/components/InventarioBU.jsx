import { useState, useEffect } from "react";
import { apiPost, apiGet } from "../services/api";
import { useGlobalData } from "../context/GlobalDataContext";
import { SVG } from "../assets/imgSvg";
import "../styles/inventario.css";

export default function Inventario() {

  const { items, sedes, categories } = useGlobalData();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedSede, setSelectedSede] = useState("");

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [movementType, setMovementType] = useState("");

  const [currentStock, setCurrentStock] = useState(0);
  const [stockPorSede, setStockPorSede] = useState([]);
  const MAX_OBS = 150; // limite de campo observaciones
  const [observaciones, setObservaciones] = useState("");

  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  /* ================================
     CARGAR STOCK POR SEDE
  ===================================*/
  useEffect(() => {
    const fetchStockPorSede = async () => {
      try {
        const res = await apiGet("stock-sede-item");
        if (res.ok) {
          setStockPorSede(res.data);
        }
      } catch (error) {
        console.error("Error cargando stock por sede", error);
      }
    };

    fetchStockPorSede();
  }, []);

  /* ================================
     FILTRADO
  ===================================*/
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

  /* ================================
     OBTENER STOCK SEGÚN SEDE
  ===================================*/
  const getStock = (item) => {

    if (!selectedSede) {
      const stocks = stockPorSede.filter(
        s => Number(s.id_item) === Number(item.id_item)
      );

      const total = stocks.reduce(
        (acc, curr) => acc + Number(curr.cantidad_actual || 0),
        0
      );

      return Number.isFinite(total) ? total : 0;
    }

    const stock = stockPorSede.find(
      s =>
        Number(s.id_item) === Number(item.id_item) &&
        Number(s.id_sede) === Number(selectedSede)
    );

    return stock ? Number(stock.cantidad_actual) : 0;
  };

  /* ================================
     EDITAR
  ===================================*/
  const handleEdit = (item) => {
    const stock = getStock(item);

    setSelectedItem(item);
    setCurrentStock(stock);
    setEditStock("");
    setMovementType("");
    setObservaciones("");
    setShowEditPopup(true);
  };

  /* ================================
     GUARDAR STOCK
  ===================================*/
  const handleSaveStock = async () => {

    if (!movementType) {
      alert("Seleccione tipo de movimiento");
      return;
    }

    if (!selectedSede) {
      alert("Debe seleccionar una sede");
      return;
    }

    if (editStock === "" || Number(editStock) <= 0) {
      alert("Cantidad inválida");
      return;
    }

    const cantidad = Number(editStock);

    // Movimientos que RESTAN
    const movimientosResta = ["salida", "merma"];

    if (movimientosResta.includes(movementType) && cantidad > currentStock) {
      alert("No puede restar más del stock actual");
      return;
    }

    // 🔥 Calcular nuevo stock correctamente
    let nuevoStock = currentStock;

    if (movimientosResta.includes(movementType)) {
      nuevoStock = currentStock - cantidad;
    } else {
      nuevoStock = currentStock + cantidad;
    }

    try {

      const item = selectedItem;

      const payload = {
        id_item: Number(item.id_item),
        nombre_item: String(item.nombre_item),
        id_categoria: Number(item.id_categoria),
        id_tipo: Number(item.id_tipo),
        id_unidad: Number(item.id_unidad),
        descripcion: item.descripcion ?? "",
        estado: item.estado ?? "Nuevo",
        peresible: item.peresible ?? "No",
        fecha_caducidad: item.fecha_caducidad ?? null,
        cantidad: cantidad, // 👈 solo movimiento
        id_sede: Number(selectedSede),
        observaciones: observaciones,
        activo: Number(item.activo ?? 1),
        id_admin: Number(item.id_admin)
      };

      const update = await apiPost("items-actualizar", payload);

      if (!update.ok) {
        throw new Error("Falló actualización");
      }

      // 🔥 Actualizar estado local correctamente
      setStockPorSede(prev => {
        const existe = prev.find(
          s =>
            Number(s.id_item) === Number(item.id_item) &&
            Number(s.id_sede) === Number(selectedSede)
        );

        if (existe) {
          return prev.map(s =>
            Number(s.id_item) === Number(item.id_item) &&
            Number(s.id_sede) === Number(selectedSede)
              ? { ...s, cantidad_actual: nuevoStock }
              : s
          );
        }

        return [
          ...prev,
          {
            id_item: Number(item.id_item),
            id_sede: Number(selectedSede),
            cantidad_actual: nuevoStock
          }
        ];
      });

      setShowEditPopup(false);
      setSelectedItem(null);

    } catch (error) {
      console.error(error);
      alert("El servidor rechazó la actualización");
    }
  };

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
          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
          >
            <option value="">Todas las categorias</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <label>Categoria</label>
        </div>

        <div className='input-field'>
          <select
            value={selectedSede}
            onChange={(e) => setSelectedSede(e.target.value)}
          >
            <option value="">Todas</option>
            {sedes.map((sede) => (
              <option key={sede.id_sede} value={sede.id_sede}>
                {sede.nombre_sede}
              </option>
            ))}
          </select>
          <label>Sede</label>
        </div>
      </div>

      <div className="ctnTable">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Stock</th>
              {selectedSede && <th>Editar</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {

              const stock = getStock(item);

              if (selectedSede && stock === 0) return null;

              return (
                <tr key={item.id_item}>
                  <td>{item.id_item}</td>
                  <td>{item.nombre_item}</td>
                  <td>{item.nombre_categoria}</td>
                  <td>{item.descripcion}</td>
                  <td>{stock}</td>

                  {selectedSede && (
                    <td className="center">
                      <SVG.BoxEdit
                        className="icon"
                        onClick={() => handleEdit(item)}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showEditPopup && selectedItem && (
        <div className="popup">
          <div className="popup-content editStock">
            <h3>Editar Stock</h3>
            {/* ID Y NOMBRE */}
            <div className="double__form2">
              <div className='input-field'>
                <input value={selectedItem.id_item} readOnly disabled />
                <label className="active">ID</label>
              </div>

              <div className='input-field'>
                <input value={selectedItem.nombre_item} readOnly disabled />
                <label className="active">Nombre</label>
              </div>
            </div>
            {/* TIPO DE MOVIMIENTO */}
            <div className='input-field'>
              <select
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
                required
              >
                <option value=""></option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="sobrante">Sobrante</option>
                <option value="merma">Merma</option>
                <option value="transferencia">Transferencia</option>
              </select>
              <label>Tipo de movimiento</label>
            </div>
            {/* SEDES */}
            <div className="double__form">
              <div className='input-field'>
                <select
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                >
                  <option value="">Todas</option>
                  {sedes.map((sede) => (
                    <option key={sede.id_sede} value={sede.id_sede}>
                      {sede.nombre_sede}
                    </option>
                  ))}
                </select>
                <label className="active">Sede actual</label>
              </div>
              <div className='input-field'>
                <select
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                >
                  <option value="">Todas</option>
                  {sedes.map((sede) => (
                    <option key={sede.id_sede} value={sede.id_sede}>
                      {sede.nombre_sede}
                    </option>
                  ))}
                </select>
                <label className="active">Sede a transferir 

                </label>
              </div>
            </div>
            {/* STOCK ACTUAL Y NUEVO */}
            <div className="double__form">
              <div className='input-field'>
                <input type="number" value={currentStock} disabled />
                <label className="active">Stock actual</label>
              </div>
              <div className='input-field'>
                <input
                  type="number"
                  min="1"
                  step="1"
                  max={
                    ["salida", "merma"].includes(movementType)
                      ? currentStock
                      : undefined
                  }
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  required
                  placeholder=""
                />
                <label className="active">Cantidad</label>
              </div>
            </div>
            {/* OBSERVACIONES */}
            <div className='input-field'>
              <textarea
                maxLength={MAX_OBS}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder=""
                rows="3"
              />
              <label className="active">Observaciones</label>

              <div className="char-counter">
                {observaciones.length} / {MAX_OBS}
              </div>
            </div>

            <div className="actions">
              <button className="saveEdit" onClick={handleSaveStock}>
                Guardar
              </button>
              <button
                className="closeForm"
                onClick={() => setShowEditPopup(false)}
              >
                <SVG.Close className="icon" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}