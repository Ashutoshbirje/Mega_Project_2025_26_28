import React from "react";
import "./Block3D.css";

function Block3D({ block }) {

  return (
    <div className="block3d-wrapper">
      <div className="block3d-scene">
        <div className="block3d-cube">
          <div className="block3d-face block3d-front">🔒</div>
          <div className="block3d-face block3d-back">🛡️</div>
          <div className="block3d-face block3d-right">🔑</div>
          <div className="block3d-face block3d-left">🧬</div>
          <div className="block3d-face block3d-top">⛓️</div>
          <div className="block3d-face block3d-bottom">✅</div>
        </div>
      </div>
    </div>
  );
}

export default Block3D;


