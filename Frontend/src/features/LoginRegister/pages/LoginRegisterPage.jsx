// @ts-nocheck


import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import imagen from "../../../assets/Imagen Windows11.jpg";
import logo from "../../../assets/logo_2.png";

function LoginRegisterPage() {
    const { register, loading, message } = useRegister();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const success = await register({
            username: form.username,
            email: form.email,
            password: form.password,
        });

        if (success) {
            setForm({ username: "", email: "", password: "", confirmPassword: "" });
            alert("✅ Usuario creado correctamente");
        }
    };

    return (
        <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] p-[1.25rem] gap-[1.25rem]">
            <article className="flex justify-center items-center lg:items-start">
                <div className="w-full max-w-[28rem]">
                    <div className="flex mb-[2rem] py-[1.25rem] 2xl:mb-20">
                        <img className="h-[2rem] w-auto 2xl:h-[2.7rem]" src={logo} alt="Logo" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-[1rem] lg:px-16">
                        <h1 className="text-xl font-bold text-gray-900">Registrate</h1>
                        <p className="text-sm text-gray-600">Completa el formulario para crear tu cuenta</p>

                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-80 2xl:w-96 h-[3rem] border border-gray-300 rounded-lg px-3"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-80 2xl:w-96 h-[3rem] border border-gray-300 rounded-lg px-3"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-80 2xl:w-96 h-[3rem] border border-gray-300 rounded-lg px-3"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar Contraseña"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-80 2xl:w-96 h-[3rem] border border-gray-300 rounded-lg px-3"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-80 2xl:w-96 h-[3rem] bg-[#367AFF] text-white rounded-lg hover:bg-[#2563EB]"
                        >
                            {loading ? "Creando..." : "Crear cuenta"}
                        </button>

                        {message && <p className="text-sm text-center text-gray-600 mt-2">{message}</p>}
                    </form>
                </div>
            </article>

            <article className="hidden lg:block">
                <img className="w-full h-full object-cover rounded-2xl" src={imagen} alt="" />
            </article>
        </section>
    );
}

export default LoginRegisterPage;
