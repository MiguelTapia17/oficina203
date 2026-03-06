import { useState } from "react";
import { SVG } from "../assets/imgSvg";
import GestionarUsuarios from "./gestion/GestionarUsuarios";
import GestionarActividades from "./gestion/GestionarActividades";
import GestionarSedes from "./gestion/GestionarSedes";
import GestionarTiposItem from "./gestion/GestionarTiposItem";
import GestionarUnidadesMedida from "./gestion/GestionarUnidadesMedida";
import GestionarCategorias from "./gestion/GestionarCategorias";


import "../styles/gestion.css";

export default function GestionAdmin() {
  // null = selector / preview
  const [subView, setSubView] = useState(null);

  const goBack = () => setSubView(null);

  // Header con volver cuando estás dentro de un submódulo
  const Header = ({ title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, width: "100%" }}>
      <button className="btnPrimary" type="button" onClick={goBack}>
        {/* Si no tienes Back, usa uno que exista */}
        {/* {SVG.Close ? <SVG.Close className="icon" /> : null} */}
        Volver
      </button>
      {/* <h2 style={{ margin: 0 }}>{title}</h2> */}
    </div>
  );

  if (subView === "usuarios") {
    return (
      <div className="ctnGestion">
        <Header title="Gestión de Usuarios" />
        <GestionarUsuarios />
      </div>
    );
  }

  if (subView === "actividades") {
    return (
      <div className="ctnGestion">
        <Header title="Gestión de Actividades" />
        <GestionarActividades />
      </div>
    );
  }

  // if (subView === "sedes") {
  //   return (
  //     <div className="ctnGestion">
  //       <Header title="Gestión de Sedes" />
  //       <GestionarSedes />
  //     </div>
  //   );
  // }

  // if (subView === "tipos") {
  //   return (
  //     <div className="ctnGestion">
  //       <Header title="Gestión de Tipos de Ítem" />
  //       <GestionarTiposItem />
  //     </div>
  //   );
  // }

  // if (subView === "unidades") {
  //   return (
  //     <div className="ctnGestion">
  //       <Header title="Gestión de Unidades de Medida" />
  //       <GestionarUnidadesMedida />
  //     </div>
  //   );
  // }

  // if (subView === "categorias") {
  //   return (
  //     <div className="ctnGestion">
  //       <Header title="Gestión de Categorías" />
  //       <GestionarCategorias />
  //     </div>
  //   );
  // }

  // Selector / Vista previa
  return (
    <div className="ctnGestionGeneral">
      <h2>Gestión</h2>

        <div className="ctnItems">
          <button className="btnItems" type="button" onClick={() => setSubView("usuarios")}>
            <SVG.User className="icon" />
            <p>Usuarios</p>
          </button>
          <button className="btnItems" type="button" onClick={() => setSubView("actividades")}>
            <SVG.Activity className="icon" />
            <p>Actividades</p>
          </button>
          {/* <button className="btnItems" type="button" onClick={() => setSubView("sedes")}>
            <SVG.Location className="icon" />
            <p>Sedes</p>
          </button>

          <button className="btnItems" type="button" onClick={() => setSubView("tipos")}>
            <SVG.ItemType className="icon" />
            <p>Tipos de ítem</p>
          </button>

          <button className="btnItems" type="button" onClick={() => setSubView("unidades")}>
            <SVG.Balance className="icon" />
            <p>Unidades de medida</p>
          </button>

          <button className="btnItems" type="button" onClick={() => setSubView("categorias")}>
            <SVG.Category className="icon" />
            <p>Categorías</p>
          </button> */}
        </div>
      {/* <div className="ctnTable" style={{ padding: 0, background: "transparent" }}>
      </div> */}
    </div>
  );
}