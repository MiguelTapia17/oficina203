import React, { useState, useEffect } from "react";
import { apiPost, apiGet } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useGlobalData } from "../context/GlobalDataContext";
import { SVG } from "../assets/imgSvg";
import "../styles/inventario.css";
import NewProduct from "./NewProduct"; // Importamos el componente

export default function Inventario() {
  const [showNewProductPopup, setShowNewProductPopup] = useState(false); // Controlamos la visibilidad del popup
  const [successMessage, setSuccessMessage] = useState("");

  // Mostrar el popup
  const handleAddNewProduct = () => {
    setShowNewProductPopup(true);
  };

  // Ocultar el popup
  const handleClosePopup = () => {
    setShowNewProductPopup(false);
  };
    
  const { items, sedes, categories, actividades } = useGlobalData();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [movementType, setMovementType] = useState("");
  const [selectActividad, setSelectActividad] =useState(""); 
  
  const [currentStock, setCurrentStock] = useState(0);
  const [stockPorSede, setStockPorSede] = useState([]);
  
  const [sedeTransferencia, setSedeTransferencia] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedItemDetalle, setSelectedItemDetalle] = useState(null);
  
  const MAX_OBS = 150; // limite de campo observaciones
  const [observaciones, setObservaciones] = useState("");
  
  //FILTROS
  const [showFilters, setShowFilters] = useState(false);


  const [stockFilter, setStockFilter] = useState("all"); 
  const normalize = (str) =>
    String(str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();



  /* ================================
     FILTRAR SEDE POR USUARIO
  ===================================*/

  /* usuarios */
  const { user } = useAuth();
  const userRole = user?.rol?.toLowerCase();
  const userSede = user?.id_sede;
  useEffect(() => {
    if (userRole === "admin" || userRole === "asesor") {
      setSelectedSede(userSede);
    }
  }, [userRole, userSede]);

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
     OBTENER STOCK SEGÚN SEDE
  ===================================*/
  const getStock = (item) => {

    if (!selectedSede) {
      const stocks = stockPorSede.filter(
        s => Number(s.id_item) === Number(item.id_item)
      );

      return stocks.reduce(
        (acc, curr) => acc + Number(curr.cantidad_actual || 0),
        0
      );
    }

    const stock = stockPorSede.find(
      s =>
        Number(s.id_item) === Number(item.id_item) &&
        Number(s.id_sede) === Number(selectedSede)
    );

    return stock ? Number(stock.cantidad_actual) : 0;
  };
  /* ================================
     STOCK DETALLE
  ===================================*/
  const getStockPorSedeDetalle = (itemId) => {
    return sedes.map((sede) => {
      const stock = stockPorSede.find(
        s =>
          Number(s.id_item) === Number(itemId) &&
          Number(s.id_sede) === Number(sede.id_sede)
      );

      return {
        nombre_sede: sede.nombre_sede,
        id_sede: sede.id_sede,
        cantidad: stock ? Number(stock.cantidad_actual) : 0
      };
    });
  };
  /* ================================
     FILTRADO
  ===================================*/
//   const filteredItems = items.filter((item) => {
//   // Comparamos el ID de la categoría de `item` con el valor de `categoryFilter`
//   const matchesCategory = categoryFilter
//     ? item.id_categoria === parseInt(categoryFilter) // Convertimos `categoryFilter` a número
//     : true;  // Si `categoryFilter` está vacío, no se aplica filtro

//   if (!search.trim()) return matchesCategory;

//   const rowString = normalize(`
//     ${item.id_item}
//     ${item.nombre_item}
//     ${item.descripcion}
//   `);

//   return matchesCategory && rowString.includes(normalize(search)); // Se aplica el filtro de búsqueda
// });
const handleStockFilterToggle = () => {
  setStockFilter(prev => {
    if (prev === "all") return "with";
    if (prev === "with") return "without";
    return "all";
  });
};
  const filteredItems = items.filter((item) => {

    const matchesCategory = categoryFilter
      ? item.id_categoria === parseInt(categoryFilter)
      : true;

    const stock = getStock(item);

    // 🔥 Filtro por stock
    const matchesStock =
      stockFilter === "with"
        ? stock > 0
        : stockFilter === "without"
        ? stock === 0
        : true;

    if (!search.trim()) {
      return matchesCategory && matchesStock;
    }

    const rowString = normalize(`
      ${item.id_item}
      ${item.nombre_item}
      ${item.descripcion}
    `);

    return (
      matchesCategory &&
      matchesStock &&
      rowString.includes(normalize(search))
    );
  });

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
    setSedeTransferencia("");
    setShowEditPopup(true);
  };

  /* ================================
     GUARDAR STOCK
  ===================================*/
  const handleSaveStock = async () => {

    if (isSaving) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (!movementType) {
      setErrorMsg("Seleccione tipo de movimiento");
      return;
    }

    if (!selectedSede) {
      setErrorMsg("Debe seleccionar una sede");
      return;
    }

    if (movementType === "transferencia" && !sedeTransferencia) {
      setErrorMsg("Debe seleccionar sede destino");
      return;
    }

    if (movementType === "salida" && !selectActividad) {
      setErrorMsg("Debe seleccionar una actividad");
      return;
    }

    if (!editStock || Number(editStock) <= 0) {
      setErrorMsg("La cantidad debe ser mayor o igual a 0.");
      return;
    }
    if (movementType === "transferencia" && selectedSede === sedeTransferencia) {
      setErrorMsg("No puede transferir a la misma sede");
      return;
    }
        
    let cantidad = Number(editStock);
    // Movimientos que RESTAN
    const movimientosResta = ["salida", "merma", "transferencia"];

    if (["salida", "merma", "transferencia"].includes(movementType) && cantidad > currentStock) {      
      setErrorMsg("No puede restar más del stock actual");
      return;
    }

    setIsSaving(true);
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
        estado: item.estado ?? "",
        peresible: item.peresible ?? "",
        fecha_caducidad: item.fecha_caducidad ?? "",
        cantidad: cantidad,
        id_sede: Number(selectedSede),
        id_sede2: movementType === "transferencia"
          ? Number(sedeTransferencia)
          : "",
        observaciones: observaciones,
        activo: Number(item.activo ?? 1),
        id_admin: Number(item.id_admin),
        tipo_movimiento: movementType,
        id_actividad: selectActividad ? Number(selectActividad) : null
      };
      console.log("Payload enviado al servidor:", payload);  // Esto te permitirá ver todos los datos antes de enviarlos
      const update = await apiPost("items-actualizar", payload);

      if (!update.ok) throw new Error("Falló actualización");

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
      const detalleMovimiento = `
        Movimiento: ${movementType}
        Cantidad: ${cantidad}
        Nuevo stock: ${nuevoStock}
        `;

        setSuccessMsg(`Actualización exitosa. ${detalleMovimiento}`);
        setErrorMsg("");

        setTimeout(() => {
          setSuccessMsg("");
        }, 5000);
      // setShowEditPopup(false);
      setTimeout(() => {
        setShowEditPopup(false);
        setSelectedItem(null);
      }, 5000);

    } catch (error) {
      console.error(error);
      alert("El servidor rechazó la actualización");
    }finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="inventario">
      <h2>Inventario</h2>
          {/* Mostrar mensaje de éxito */}
          {successMessage && <div className="successMessage">{successMessage}</div>}

          {/* Condicionalmente mostrar el popup */}
          {showNewProductPopup && (
            <NewProduct setShowPopup={setShowNewProductPopup} setShowSuccessMessage={setSuccessMessage} />
          )}
      <div className="ctnAllFilters">

        <div className='input-field'>
          <input
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Buscar (id, nombre, desc.)</label>
        </div>
        <div className="filters">
          <div className="filtersCTA" onClick={() => setShowFilters(!showFilters)} style={{ cursor: "pointer" }}>
            <SVG.Filter className="icon" />
            <p>Filtros</p>
          </div>
          {showFilters && (
            <div className="ctnFilters">
              <div className="input-field">
                <select
                  value={categoryFilter}  // El valor es el `id_categoria` seleccionado
                  onChange={(e) => setCategoryFilter(e.target.value)}  // Actualizamos el filtro de categoría
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id_categoria} value={category.id_categoria}>
                      {category.nombre_categoria}  {/* Mostramos el nombre de la categoría */}
                    </option>
                  ))}
                </select>
                <label>Categoria</label>
              </div>
              {/* <div className='input-field'>
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
              </div> */}
              {userRole === "superadmin" && (
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
              )}
              <div className='input-field'>
                <select 
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="with">Con Stock</option>
                  <option value="without">Sin stock</option>

                </select>
                <label>Stock</label>
              </div>

              {/* <div className="stockFilterButtons">
                <div 
                  className={`filterBtn ${stockFilter}`}
                  onClick={handleStockFilterToggle}
                >
                  {stockFilter === "all" && "Todos"}
                  {stockFilter === "with" && "Con Stock"}
                  {stockFilter === "without" && "Sin Stock"}
                </div>
              </div> */}
            </div>)}

        </div>
        
        {/* Botón para agregar un nuevo producto */}
        <div className="btnAdd" onClick={handleAddNewProduct}>
          <SVG.BoxAdd className="icon" /> Nuevo Producto
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

              // if (selectedSede && stock === 0) return null;

              return (
                <tr key={item.id_item}>
                  <td className="clickable" onClick={() => setSelectedItemDetalle(item)} >
                    {item.id_item}
                  </td>
                  
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
            {/* SEDE */}
            <div className='input-field'>
              {/* <input value={selectedItem.sede} readOnly disabled /> */}
              <input
                value={
                  selectedSede
                    ? sedes.find(s => Number(s.id_sede) === Number(selectedSede))?.nombre_sede || ""
                    : "Todas las sedes"
                }
                readOnly
                disabled
              />
              <label className="active">Sede</label>
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
            {/* ACTIVIDAD */}
            {movementType === "salida" && (
              <div className='input-field'>
                <select value={selectActividad} 
                        onChange={(e) => setSelectActividad(e.target.value)} required >
                  <option value=""></option>
                  {actividades.map((actividades) => (
                      <option key={actividades.id_actividad} value={actividades.id_actividad}>
                        {actividades.nombre_actividad}
                      </option>
                    ))}
                </select>
                <label>Seleccionar actividad</label>
              </div>
            )}
            {/* SEDES */}
            {movementType === "transferencia" && (
              <div className="double__form">
              {/* <div className="double__form" style={{ 
                display: movementType === "transferencia" ? "flex" : "none" }}> */}
                <div className='input-field'>
                  <select value={selectedSede} required disabled >
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
                    value={sedeTransferencia}
                    onChange={(e) => setSedeTransferencia(e.target.value)}
                    required={movementType === "transferencia"}
                  >
                    <option value=""></option>
                    {sedes.map((sede) => (
                      <option key={sede.id_sede} value={sede.id_sede}>
                        {sede.nombre_sede}
                      </option>
                    ))}
                  </select>
                  <label className="active">Sede a transferir</label>
                </div>
              </div>
            )}
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
                    ["salida", "merma", "transferencia"].includes(movementType)
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
            <div className='input-field ctnTextArea'>
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
            
            <div className="disclaimer">
              {errorMsg && <p className="error"><b> {errorMsg}</b></p>}
              {successMsg && <p className="success">{successMsg}</p>}
            </div>

            <div className="actions">
              {/* <button className="saveEdit" onClick={handleSaveStock}>
                Guardar
              </button> */}
              <button
                className="saveEdit"
                onClick={handleSaveStock}
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar"}
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

      {selectedItemDetalle && (
        <div className="popup">
          <div className="popup-content">
            <h3>Detalle del Producto</h3>

            <div className="popup-item">

              <div className="double__form">
                <div className="input-field">
                  <input value={selectedItemDetalle.id_item} readOnly />
                  <label>ID</label>
                </div>

                <div className="input-field">
                  <input value={selectedItemDetalle.nombre_item} readOnly />
                  <label>Nombre</label>
                </div>
              </div>

              <div className="double__form">
                <div className="input-field">
                  <input value={selectedItemDetalle.nombre_categoria} readOnly />
                  <label>Categoría</label>
                </div>

                <div className="input-field">
                  <input value={selectedItemDetalle.descripcion || "—"} readOnly />
                  <label>Descripción</label>
                </div>
              </div>

              {/* STOCK + SEDE */}
              <div className="double__form">

                <div className="input-field">
                  <input
                    value={
                      selectedSede
                        ? sedes.find(s => Number(s.id_sede) === Number(selectedSede))?.nombre_sede || ""
                        : "Todas las sedes"
                    }
                    readOnly
                  />
                  <label>Sede</label>
                </div>

                <div className="input-field">
                  <input value={getStock(selectedItemDetalle)} readOnly />
                  <label>Stock</label>
                </div>


              </div>

              {/* SOLO MOSTRAR STOCK POR SEDE SI ES ALL */}
              {!selectedSede && (
                <>
                  <h4 style={{ marginTop: "20px" }}>Stock por sede</h4>

                  {getStockPorSedeDetalle(selectedItemDetalle.id_item).map((sede) => (
                    <div
                      key={sede.id_sede}
                      className="double__form"
                    >
                      <div className="input-field">
                        <input value={sede.nombre_sede} readOnly />
                        <label>Sede</label>
                      </div>

                      <div className="input-field">
                        <input value={sede.cantidad} readOnly />
                        <label>Cantidad</label>
                      </div>
                    </div>
                  ))}
                </>
              )}

            </div>

            <button
              className="closeForm"
              onClick={() => setSelectedItemDetalle(null)}
            >
              <SVG.Close className="icon" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

