/* ESCOGEMOS QUE OPCIONES SE MOSTRARA SEGUN EL ROL*/
import { SVG } from "../assets/imgSvg";

export const menuConfig = {
  superadmin: [
    { key: "inicio", label: "Dashboard", icon: SVG.Dashboard },
    { key: "inventario", label: "Inventario", icon: SVG.Box },
    { key: "historial", label: "Historial de movimientos", icon: SVG.History },
    { key: "gestion", label: "Gestión", icon: SVG.UserSetting },
    { key: "importItems", label: "Importar Items", icon: SVG.Importar }
  ],

  admin: [
    { key: "inicio", label: "Dashboard", icon: SVG.Dashboard },
    { key: "inventario", label: "Inventario", icon: SVG.Box },
    { key: "historial", label: "Historial de movimientos", icon: SVG.History },
    { key: "gestionAdmin", label: "Gestión", icon: SVG.UserSetting }
  ],

  asesor: [
    { key: "inventario", label: "Inventario", icon: SVG.Box },
    { key: "historial", label: "Historial", icon: SVG.History }
  ]
};