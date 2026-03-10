import { useEffect, useState } from "react";
import "../styles/toast.css";

export default function Toast({
  message,
  title,
  type = "success",
  onClose
}) {

  const [isAnimating, setIsAnimating] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = setTimeout(() => setIsAnimating(true), 50);

    // cierre automático a los 4s
    const autoClose = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => {
      clearTimeout(start);
      clearTimeout(autoClose);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`toastSuccess ${type} ${visible ? "show" : "hide"}`}>
      <div className="toastBox">

        <div className="ctnCheck">

          {type === "success" && (
            <div className="advanced-checkbox success">
              <input type="checkbox" checked={isAnimating} readOnly />
              <label>
                <div className="box">
                  <div className="front"></div>
                  <div className="back"></div>
                  <div className="left"></div>
                  <div className="right"></div>
                  <div className="top"></div>
                  <div className="bottom"></div>
                </div>
                <span className="checkmark"></span>
              </label>
            </div>
          )}

          {type === "error" && (
            <div className="advanced-checkbox error">
              <input type="checkbox" checked={isAnimating} readOnly />
              <label>
                <div className="box">
                  <div className="front"></div>
                  <div className="back"></div>
                  <div className="left"></div>
                  <div className="right"></div>
                  <div className="top"></div>
                  <div className="bottom"></div>
                </div>
                <span className="checkmark-3d"></span>
              </label>
            </div>
          )}

          <p className="title">{title}</p>
        </div>

        <p>{message}</p>

        {type === "error" && (
          <button className="toastBtn" onClick={handleClose}>
            Entendido
          </button>
        )}

      </div>
    </div>
  );
}