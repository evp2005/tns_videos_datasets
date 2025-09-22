// src/views/Menu.jsx
import "./Menu.css";

function Menu() {
    return (
        <main className="menu-page">
            <div className="perfil">
                <div className="image">
                    <img src="" alt="imagen" />

                </div>
            </div>
            <div className="hero">
                <div className="name">
                    <h2 className="title">Hola bienvenido</h2>
                </div>
                <div className="archivos
                ">
                    <h2>Selecciona tu archivo</h2>
                    <div className="buttons">
                        <button className="button">Archivo</button>
                        <button className="button">Audio</button>

                    </div>

                </div>
            </div>
        </main>
    );
}

export default Menu;
