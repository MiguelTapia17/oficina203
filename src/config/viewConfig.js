/* ACA VEMOS TODAS LAS VISTAS POSIBLES */
import Inicio from "../components/Inicio";
import Inventario from "../components/Inventario";
import Historial from "../components/Historial";
import Gestion from "../components/Gestion";
import GestionAdmin from "../components/GestionAdmin";
import ImportItems from "../components/ImportItems";

export const viewConfig = {
  inicio: Inicio,
  inventario: Inventario,
  historial: Historial,
  gestion: Gestion,
  gestionAdmin: GestionAdmin,
  // gestionAdmin: GestionAdmin,
  importItems: ImportItems
};