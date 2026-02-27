import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { apiGet } from "../services/api";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalData = async () => {
    try {
      const [itemsRes, sedesRes, actividadesRes, usuariosRes] = await Promise.all([
        apiGet("items"),
        apiGet("sedes"),
        apiGet("actividades"),
        apiGet("usuarios"),
      ]);

      const itemsData = itemsRes.data ?? [];
      setItems(itemsData);
      setSedes(sedesRes.data ?? []);
      setActividades(actividadesRes.data ?? []);
      setUsuarios(usuariosRes.data ?? []);

      const uniqueCategories = [...new Set(itemsData.map(i => i.nombre_categoria))];
      setCategories(uniqueCategories);

    } catch (error) {
      console.error("Error cargando datos globales", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  // Opcional: maps listos para usar (te simplifica Historial)
  const actividadesMap = useMemo(() => {
    const map = {};
    (actividades ?? []).forEach(a => { map[a.id_actividad] = a.nombre_actividad; });
    return map;
  }, [actividades]);

  const usuariosMap = useMemo(() => {
    const map = {};
    (usuarios ?? []).forEach(u => { map[u.id_admin] = u.nombre_completo; });
    return map;
  }, [usuarios]);

  const itemsMap = useMemo(() => {
    const map = {};
    (items ?? []).forEach(i => { map[i.id_item] = i.nombre_item; });
    return map;
  }, [items]);

  return (
    <GlobalDataContext.Provider
      value={{
        items,
        setItems,
        sedes,
        actividades,
        setActividades,
        usuarios, // NUEVO
        categories,
        loading,
        refreshGlobalData: fetchGlobalData,

        // NUEVO (opcional, pero recomendado)
        actividadesMap,
        usuariosMap,
        itemsMap,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);