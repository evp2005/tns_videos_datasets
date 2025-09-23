// src/views/Menu.jsx
import "./Menu.css";
import Micro from "../assets/Micro.svg"; // ✅ correcto
import Persona from "../assets/anonimo.png"
import Archivo from "../assets/Archivo.svg"

function Menu() {
    return (
        <main className="menu-page">
            <div className="perfil">
                <div className="image">
                    <img src={Persona} alt="imagen" />
                </div>
                <div className="titleHistoria">
                    <h3>Historial</h3>
                </div>
                <div className="Historial">
                    <span>Video 1</span>
                    <span>Video 2</span>

                </div>
                <div className="cerrar">
                    <a href="">Cerrar Seccion</a>
                </div>
            </div>



            <div className="hero">
                <div className="name">
                    <h2 className="title">Bienvenido a DataScript</h2>
                </div>
                <div className="archivos">
                    <div className="seleccion">
                        <h2>Selecciona tu archivo</h2>

                    </div>
                    <div className="buttons">
                        <button className="button" id="archivo"><img src={Archivo} alt="" /> Sube tu archivo</button>
                        <button className="button" id="grabar"> <img src={Micro} alt="MICRO" /></button>

                    </div>

                </div>
            </div>
        </main>
    );
}

export default Menu;
