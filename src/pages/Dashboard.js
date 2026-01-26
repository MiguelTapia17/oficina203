import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return <h1>Bienvenido {user.name}</h1>;
}

export default Dashboard;