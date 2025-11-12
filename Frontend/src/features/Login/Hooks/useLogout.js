import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // 🧹 Borra el token guardado (ya sea en localStorage o sessionStorage)
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        console.log("👋 Sesión cerrada");
        navigate("/"); // 🔁 Redirige al login
    };

    return { logout };
};
