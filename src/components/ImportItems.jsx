import React, { useState, useEffect } from "react";
import { apiUpload } from "../services/api";
import "../styles/importItems.css";

export default function ImportItems() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Seleccione un archivo CSV");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await apiUpload("items/import", file);
      setResult(response);
    } catch (err) {
      setError("Error al importar archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ctnImport">
      <h2>Importar Items</h2>
      {/* <div className="import">
        <input type="file" accept=".csv" onChange={handleFileChange} />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Procesando..." : "Importar"}
        </button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="resultado">
            <p>Total filas: {result.total_filas}</p>
            <p>Insertadas: {result.insertadas}</p>
            <p>Errores: {result.errores}</p>

            {result.detalle_errores && result.detalle_errores.length > 0 && (
              <ul>
                {result.detalle_errores.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div> */}
      <div className="container">
        <div className="folder">
          <div className="top" />
          <div className="bottom" />
        </div>
        <label className="custom-file-upload">
          <input className="title" type="file" accept=".csv" onChange={handleFileChange} />
          Seleccione un archivo
        </label>
        <div className="ctnError">
          {error && <p className="error">{error}</p>}
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Procesando..." : "Importar"}
        </button>
        
        {result && (
          <div className="resultado">
            <p>Total filas: {result.total_filas}</p>
            <p>Insertadas: {result.insertadas}</p>
            <p>Errores: {result.errores}</p>

            {result.detalle_errores && result.detalle_errores.length > 0 && (
              <ul>
                {result.detalle_errores.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
    </div>
    
  );
}