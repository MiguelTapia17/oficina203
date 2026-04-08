import React, { useState } from "react";
import { apiPost } from "../services/api";
import { useGlobalData } from "../context/GlobalDataContext";
import { SVG } from "../assets/imgSvg"; 
// import "../styles/newProduct.css";

export default function NewProduct({ setShowPopup, setShowSuccessMessage }) {
  const [nombreItem, setNombreItem] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidad, setUnidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [peresible, setPeresible] = useState("Sí");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [cantidad, setCantidad] = useState("0.00");
  const [stock_minimo, setStockMinimo] = useState("0.00");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { categories, tipos, unidades } = useGlobalData(); 

  const handleSaveProduct = async () => {
    if (isSaving) return;
    setErrorMsg("");

    if (!nombreItem) {
      setErrorMsg("Por favor ingresa un nombre.");
      return;
    }

    if (!categoria) {
      setErrorMsg("Por favor selecciona una categoría.");
      return;
    }

    if (!tipo) {
      setErrorMsg("Debe seleccionar un tipo.");
      return;
    }

    if (!unidad) {
      setErrorMsg("Debe seleccionar una unidad.");
      return;
    }

    if (!descripcion) {
      setErrorMsg("Por favor ingresa una descripción.");
      return;
    }

    if (peresible === "Sí" && !fechaCaducidad) {
      setErrorMsg("Debe seleccionar una fecha de caducidad.");
      return;
    }

    if (!cantidad || Number(cantidad) <= 0) {
      setErrorMsg("La cantidad debe ser mayor a 0.");
      return;
    }

    setIsSaving(true);

    const payload = {
      nombre_item: nombreItem,
      id_categoria: categoria,
      id_tipo: tipo,
      id_unidad: unidad,
      descripcion: descripcion,
      estado: "disponible",  // Siempre disponible por defecto
      peresible: peresible,
      fecha_caducidad: peresible === "Sí" ? fechaCaducidad : null,  // Solo incluimos fecha si `peresible` es "Sí"
      cantidad: cantidad,
      activo: 1,
      stock_minimo: stock_minimo,
      id_admin: 5, // Asegúrate de que este valor corresponda al ID del admin actual
    };

    console.log("Payload enviado al servidor:", payload);  // Verifica el payload

    try {
      const response = await apiPost("items-crear", payload);

      if (response.ok) {
        setShowSuccessMessage("Producto creado correctamente.");
        setShowPopup(false);
      } else {
        setErrorMsg("Hubo un error al crear el producto.");
      }
    } catch (error) {
      console.error("Error creando el producto", error);
      setErrorMsg("Error de servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content newProductForm">
        <h3>Nuevo Producto</h3>

        <div className="input-field">
          <input
            type="text"
            value={nombreItem}
            onChange={(e) => setNombreItem(e.target.value)}
            placeholder=""
            required
          />
          <label>Nombre del producto</label>
        </div>
        
        <div className="input-field">
          
          <select
            value={categoria}  // El valor es el ID de la categoría seleccionada
            onChange={(e) => setCategoria(e.target.value)}  // Actualizamos el estado de `categoria` con el `id_categoria`
            required
          >
            <option value=""></option>
            {categories.map((category) => (  // Iteramos sobre las categorías
              <option key={category.id_categoria} value={category.id_categoria}>  {/* Usamos el `id_categoria` */}
                {category.nombre_categoria}  {/* Mostramos el `nombre_categoria` */}
              </option>
            ))}
          </select>
          <label>Selecciona una categoría</label>
        </div>

        <div className="input-field">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value=""></option>
            {tipos.map((tipo) => (
              <option key={tipo.id_tipo} value={tipo.id_tipo}>
                {tipo.nombre_tipo}
              </option>
            ))}
          </select>
          <label>Selecciona un tipo</label>
        </div>

        <div className="input-field">
          <select
            value={peresible}
            onChange={(e) => setPeresible(e.target.value)}
            required
          >
            <option value=""></option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
          <label>¿Es Peresible?</label>
        </div>

        {peresible === "si" && (
        <div className="input-field">
          <input
            type="date"
            value={fechaCaducidad}
            onChange={(e) => setFechaCaducidad(e.target.value)}
            required={peresible === "si"}
          />
          <label>Fecha de caducidad</label>
        </div>
        )}
        <div className="double__form">
          <div className="input-field">
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              required
            >
              <option value=""></option>
              {unidades.map((unidad) => (
                <option key={unidad.id_unidad} value={unidad.id_unidad}>
                  {unidad.nombre_unidad}
                </option>
              ))}
            </select>
            <label>Unidad de medida</label>
          </div>

          <div className="input-field">
            <input 
              type="number" 
              value={cantidad} 
              onChange={(e) => setCantidad(e.target.value)}
              step="1"
              placeholder=""
              required
            />
            <label>Cantidad</label>
          </div>
        </div>

        <div className="input-field">
          <input  type="number"  value={stock_minimo}  onChange={(e) => setStockMinimo(e.target.value)} step="1" placeholder="" required/>
          <label>Stock Minimo del Producto</label>
        </div>

        <div className="input-field">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder=" "
            required
          ></textarea>
          <label>Descripción</label>
        </div>

        <div className="disclaimer">
          {errorMsg && <p className="error">{errorMsg}</p>}
        </div>

        <div className="actions">
          <button
            className="saveEdit"
            onClick={handleSaveProduct}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar Producto"}
          </button>
          <button
            className="closeForm"
            onClick={() => setShowPopup(false)}
          >
            <SVG.Close className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
}