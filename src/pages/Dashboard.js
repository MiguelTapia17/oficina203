import "../styles/dashboard.css"
import Menu from "../components/Menu";
import Contenido from "../components/Contenido";

export default function Dashboard() {
  return (
    <div className="ctnDashboard">
      <div className="dashboard">
        <Menu />
        <Contenido />
      </div>
    </div>
  );
}
