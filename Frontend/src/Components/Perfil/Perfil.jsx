import Persona from "../../assets/anonimo.png";
import Salida from "../../assets/Salida.svg";
import Folder from "../../assets/Folder.svg";
import "./Perfil.css";
import { useState } from "react";
import { Modal } from "../Modal-Carpeta/Modal";

export function Perfil() {
    const [clickCarpeta, setclickCarpeta] = useState(false);

    const crearCarpeta = () => {
        setclickCarpeta(true);
    };

    return (
        <div className="perfil">
            {/* Parte superior */}
            <div className="carpetas-section">
                <div className="Carpetas">
                    <span onClick={crearCarpeta}>
                        <img src={Folder} alt="" />
                        Nueva Carpeta
                    </span>
                </div>

                <div className="titleHistoria">
                    <h3>Archivos recientes</h3>
                </div>
                <div className="Historial">
                    <span>Video 1</span>
                    <span>Video 2</span>
                    <span>Video 3</span>
                    <span>Video 4</span>
                    <span>Video 5</span>
                    <span>Video 6</span>
                    <span>Video 7</span>
                    <span>Video 8</span>
                    <span>Video 9</span>
                    <span>Video 10</span>
                    <span>Video 11</span>
                    <span>Video 12</span>
                    <span>Video 13</span>
                </div>
            </div>

            {/* Parte inferior */}
            <div className="cerrar">
                <div className="image">
                    <img src={Persona} alt="imagen" />
                </div>
                <span>Nombre del usuario</span>
                <a href="">
                    <img src={Salida} alt="salida" />
                </a>
            </div>

            {/* Modal */}
            {clickCarpeta && (
                <Modal onClose={() => setclickCarpeta(false)} />
            )}
        </div>
    );
}
