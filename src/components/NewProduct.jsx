import React, { useState } from "react";
import { apiPost } from "../services/api";
import { useGlobalData } from "../context/GlobalDataContext";
import { SVG } from "../assets/imgSvg"; 
// import "../styles/newProduct.css";

export default function NewProduct({ setShowPopup, setShowSuccessMessage }) {
  const [nombreItem, setNombreItem] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidad, setUnidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("Disponible");
  // const [peresible, setPeresible] = useState("Sí");
  const [peresible, setPeresible] = useState("si");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [cantidad, setCantidad] = useState("0.00");
  const [stock_minimo, setStockMinimo] = useState("0.00");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { categories, tipos, unidades, uploadItemImage, refreshGlobalData } = useGlobalData();
  // const { categories, tipos, unidades } = useGlobalData();

  const handleSaveProduct = async () => {
    if (isSaving) return;
    setErrorMsg("");

    if (!nombreItem) return setErrorMsg("Por favor ingresa un nombre.");
    if (!categoria) return setErrorMsg("Selecciona una categoría.");
    if (!tipo) return setErrorMsg("Selecciona un tipo.");
    if (!unidad) return setErrorMsg("Selecciona una unidad.");
    if (!descripcion) return setErrorMsg("Ingresa descripción.");

    if (peresible === "si" && !fechaCaducidad) {
      return setErrorMsg("Debe seleccionar fecha de caducidad.");
    }

    if (!cantidad || Number(cantidad) <= 0) {
      return setErrorMsg("Cantidad inválida.");
    }

    setIsSaving(true);

    try {
      const payload = {
        nombre_item: nombreItem,
        id_categoria: categoria,
        id_tipo: tipo,
        id_unidad: unidad,
        descripcion: descripcion,
        estado: "disponible",
        peresible: peresible,
        fecha_caducidad: peresible === "si" ? fechaCaducidad : null,
        cantidad: cantidad,
        activo: 1,
        stock_minimo: stock_minimo,
        id_admin: 5,
      };

      const response = await apiPost("items-crear", payload);

      if (!response.ok) throw new Error("Error creando producto");

      const newItemId = response.data?.id_item;

      if (imageFile && newItemId) {
        const ok = await uploadItemImage(imageFile, newItemId);
        if (!ok) throw new Error("Error subiendo imagen");
      }

      // 🔥 refresca
      await refreshGlobalData();

      // 🔥 pequeño delay para evitar glitch visual
      setTimeout(() => {
        setShowSuccessMessage("Producto creado correctamente.");
        setShowPopup(false);
      }, 300);

    } catch (error) {
      console.error(error);
      setErrorMsg("Error al crear producto.");
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

        {/* TIPO */}
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

        {/* ES PERESIBLE Y FECHA DE CADUCIDAD */}
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

        {/* UNIDAD DE MEDIDA Y CANTIDAD */}
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
        
        {/* STOCK MINIMO */}
        <div className="input-field">
          <input  type="number"  value={stock_minimo}  onChange={(e) => setStockMinimo(e.target.value)} step="1" placeholder="" required/>
          <label>Stock Minimo del Producto</label>
        </div>
        {/* DESCRIPCIÓN */}
        <div className="input-field">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder=" "
            required
          ></textarea>
          <label>Descripción</label>
        </div>
        {/* AGREGAR IMAGEN */}
        <div className="input-field">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <label className="active">Imagen del producto</label>
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