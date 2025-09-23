import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
    const [contraseña, setContraseña] = useState("");
    const [usuario, setUsuario] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    // función para enviar datos al backend Django
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario || !contraseña) {
            alert("Faltan campos");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/users/login_user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: usuario,
                    password: contraseña,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // login correcto → redirigimos
                setMensaje("Login correcto");
                navigate("/menu");
            } else {
                // error en login
                alert(data.error || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <section>
            <article>
                <form onSubmit={handleSubmit}>
                    <h1>Iniciar sesión</h1>
                    <div className="inputs">
                        <label htmlFor="Usuario">Usuario:</label>
                        <input
                            type="text"
                            id="Usuario"
                            onChange={(e) => setUsuario(e.target.value)}
                            value={usuario}
                        />
                        <label htmlFor="Contraseña">Contraseña</label>
                        <input
                            type="password"
                            id="Contraseña"
                            onChange={(e) => setContraseña(e.target.value)}
                            value={contraseña}
                        />
                    </div>
                    <div className="enlace">
                        <button type="submit">Ingresar</button>
                    </div>
                    {mensaje && <p>{mensaje}</p>}
                </form>
            </article>
        </section>
    );
}

export default Login;
