import "../styles/contenido.css";
import Loader from "./Loader";
import { viewConfig } from "../config/viewConfig";

export default function Contenido({ activeView, loading }) {

  const ViewComponent = viewConfig[activeView];

  return (
    <div className="ctnContenido">
      {loading ? <Loader /> : ViewComponent ? <ViewComponent /> : null}
    </div>
  );
}