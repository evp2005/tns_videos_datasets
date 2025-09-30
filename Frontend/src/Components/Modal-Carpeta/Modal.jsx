import { useState } from "react";
import "./Modal.css";

export function Modal({ onClose }) {
    const [nombre, setNombre] = useState("");

    const handleAceptar = () => {
        onClose(nombre); // devuelve el nombre al padre y cierra modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Crear carpeta</h3>
                <input
                    type="text"
                    placeholder="Nombre de la carpeta"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <div className="botones">
                    <button onClick={handleAceptar}>Aceptar</button>
                    <button onClick={() => onClose("")}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
