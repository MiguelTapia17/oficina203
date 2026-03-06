import { SVG, IMAGES } from "../assets/imgSvg";
import '../styles/menu.css';
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Menu({ activeView, setActiveView }) {
  const { user } = useAuth();
  return (
    <div className="ctnBotones dos">
    <div className="ctnUsuario">
        <SVG.User className="iconUser"/>
        <div className="ctnTxt">
        <p className="name">{user?.usuario || "Usuario"}</p>
        <p className="rol">{user?.rol || "Rol"}</p>
        </div>
    </div>
    </div>
  );
}
