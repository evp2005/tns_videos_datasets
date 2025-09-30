
import Micro from "../../assets/Micro.svg";
import Archivo from "../../assets/Archivo.svg";
import "./Hero.css"
export function Hero() {
    return (
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
        </div>)
}