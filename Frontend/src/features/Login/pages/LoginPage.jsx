import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin.js";
import imagen from "../../../assets/Imagen Windows11.jpg";
import logo from "../../../assets/logo_2.png";

function LoginPage() {
    const { login, loading, error } = useLogin();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    // 🚀 Si ya hay token, redirigir automáticamente a /inicio
    useEffect(() => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) navigate("/inicio");
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password, rememberMe);
            console.log("✅ Login exitoso:", data);
            navigate("/inicio");
        } catch (err) {
            console.error("❌ Error login:", err.message);
            alert("Error al iniciar sesión");
        }
    };

    return (
        <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] p-[1.25rem] gap-[1.25rem]">
            <article className="flex justify-center items-center lg:items-start">
                <div className="w-full max-w-[28rem]">
                    <div className="flex mb-[5rem] py-[1.25rem] 2xl:mb-40">
                        <img className="h-[2rem] w-auto" src={logo} alt="Logo" />
                    </div>
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="space-y-[1.5rem] px-10 lg:w-full">
                            <h1 className="text-[1.5rem] font-bold text-gray-900 leading-tight">Ingresar</h1>
                            <p className="text-[0.875rem] text-gray-600 leading-relaxed">Por favor ingrese con su correo de Senati</p>

                            <div className="space-y-[1rem]">
                                <div className="relative mb-[0.625rem]">
                                    <input
                                        type="text"
                                        id="Usuario"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder=" "
                                        className="peer w-96 h-[3rem] rounded-lg border border-gray-300 px-[1rem] outline-none bg-gray-50 focus:border-blue-500 focus:bg-white"
                                    />
                                    <label htmlFor="Usuario" className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-gray-500 text-[0.875rem] pointer-events-none peer-focus:top-0 peer-focus:text-[0.75rem] peer-focus:text-blue-500">Email</label>
                                </div>

                                <div className="relative mb-[0.625rem]">
                                    <input
                                        type="password"
                                        id="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder=" "
                                        className="peer w-96 h-[3rem] rounded-lg border border-gray-300 px-[1rem] outline-none bg-gray-50 focus:border-blue-500 focus:bg-white"
                                    />
                                    <label htmlFor="Contraseña" className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-gray-500 text-[0.875rem] pointer-events-none peer-focus:top-0 peer-focus:text-[0.75rem] peer-focus:text-blue-500">Contraseña</label>
                                </div>

                                <div className="flex items-center gap-[0.5rem]">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-[1rem] h-[1rem] rounded cursor-pointer"
                                    />
                                    <span className="text-[0.875rem] text-gray-700">Mantener sesión iniciada</span>
                                </div>

                                <button
                                    className="w-96 h-[3rem] rounded-lg bg-[#367AFF] text-white font-medium hover:bg-[#2563EB]"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Ingresando..." : "Ingresar"}
                                </button>

                                {error && <p className="text-red-500 mt-2">{error}</p>}
                            </div>
                        </div>
                    </form>
                </div>
            </article>
            <article className="hidden lg:block">
                <img className="w-full h-full object-cover rounded-2xl" src={imagen} alt="" />
            </article>
        </section>
    );
}

export default LoginPage;
