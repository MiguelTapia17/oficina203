import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { apiGet } from "../services/api";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [usuarios, setUsuarios] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [tipos, setTipos] = useState([]); // Nuevo estado para tipos
  const [unidades, setUnidades] = useState([]); // Nuevo estado para unidades
  const [loading, setLoading] = useState(true);

  const fetchGlobalData = async () => {
    try {
      const [
        itemsRes, 
        sedesRes, 
        actividadesRes, 
        usuariosRes, 
        tiposRes, 
        unidadesRes, 
        categoriasRes
      ] = await Promise.all([
        apiGet("items"),
        apiGet("sedes"),
        apiGet("actividades"),
        apiGet("usuarios"),
        apiGet("tipos-item"),
        apiGet("unidades-medida"),
        apiGet("categorias-item"),
      ]);
      const itemsData = itemsRes.data ?? [];
      setItems(itemsData);
      setSedes(sedesRes.data ?? []);
      setActividades(actividadesRes.data ?? []);
      setUsuarios(usuariosRes.data ?? []);
      setTipos(tiposRes.data ?? []);  // Establecemos los tipos
      setUnidades(unidadesRes.data ?? []);  // Establecemos las unidades
      setCategories(categoriasRes.data ?? []); // Establecemos las categorías
      
      // const uniqueCategories = [...new Set(itemsData.map(i => i.nombre_categoria))];
      // setCategories(uniqueCategories);

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

  const tiposMap = useMemo(() => {
    const map = {};
    (tipos ?? []).forEach(t => { map[t.id_tipo] = t.nombre_tipo; });  // Creamos el mapa de tipos
    return map;
  }, [tipos]);

  const unidadesMap = useMemo(() => {
    const map = {};
    (unidades ?? []).forEach(u => { map[u.id_unidad] = u.nombre_unidad; });  // Creamos el mapa de unidades
    return map;
  }, [unidades]);

  const categoriesMap = useMemo(() => {
    const map = {};
    (categories ?? []).forEach(c => { map[c.id_categoria] = c.nombre_categoria; });  // Creamos el mapa de categorías
    return map;
  }, [categories]);

  const refreshActividades = async () => {
    try {
      const res = await apiGet("actividades");
      if (res?.ok) {
        setActividades(res.data ?? []);
      }
    } catch (error) {
      console.error("Error refrescando actividades", error);
    }
  };
  const sedesMap = useMemo(() => {
    const map = {};
    (sedes ?? []).forEach(s => {
      map[s.id_sede] = s.nombre_sede;
    });
    return map;
  }, [sedes]);
  return (
    <GlobalDataContext.Provider
      value={{
        items,
        setItems,
        sedes,
        actividades,
        setActividades,
        usuarios,
        categories,
        tipos,
        unidades,
        loading,
        refreshGlobalData: fetchGlobalData,
        // Nuevos maps
        sedesMap,
        actividadesMap,
        usuariosMap,
        itemsMap,
        tiposMap,
        unidadesMap,
        categoriesMap,
        refreshActividades
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);