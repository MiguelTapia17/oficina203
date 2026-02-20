import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../services/api";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [sedes, setSedes] = useState([]);
  // const [admins, setAdmins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalData = async () => {
    try {
      const [itemsRes, sedesRes, adminRes] = await Promise.all([
        apiGet("items"),
        apiGet("sedes"),
        // apiGet("admins"),
      ]);

      setItems(itemsRes.data);
      setSedes(sedesRes.data);
      // setAdmins(adminRes.data);

      const uniqueCategories = [
        ...new Set(itemsRes.data.map(i => i.nombre_categoria))
      ];
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

  return (
    <GlobalDataContext.Provider
      value={{
        items,
        setItems,
        sedes,
        // admins,
        categories,
        loading,
        refreshGlobalData: fetchGlobalData
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);