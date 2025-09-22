// src/views/Login.jsx
import { useState } from "react";
import "./Login.css"
import { useNavigate } from "react-router-dom";




function Login() {
    const [contraseña, setContraseña] = useState("")
    const [usuarios, setUsuarios] = useState("")

    const users = {
        "usuario": "franco",
        "contraseñas": "123",
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // evita recargar la página
        // aquí podrías validar usuario/contraseña

        if (users.usuario === usuarios && users.contraseñas === contraseña) {
            navigate("/menu")
        } else if (usuarios === "" || contraseña === "") {
            alert("faltan campos")
        } else {
            alert("contraseña incorrecta")
        }
    };
    const logueoUser = (e) => {
        setUsuarios(e.target.value)
    }
    const logueoPass = (e) => {
        setContraseña(e.target.value)
    }

    return (
        <section>
            <article>
                <form onSubmit={handleSubmit} >
                    <h1>Registrar</h1>
                    <div className="inputs">
                        <label htmlFor="Usuario">Usuario:</label>
                        <input type="text" id="Usuario" onChange={logueoUser} />
                        <label htmlFor="Contraseña">Contraseña</label>
                        <input type="password" onChange={logueoPass} id="Contraseña" />
                    </div>
                    <div className="enlace">
                        <button type="submit">Ingresar</button>
                    </div>

                </form>
            </article>
        </section>

















    );
}

export default Login;

