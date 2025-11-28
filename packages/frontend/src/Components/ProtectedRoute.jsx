import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    // 👀 Revisamos ambos storage
    const user = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!user) {
        console.log("⚠️ Debes iniciar sesión para acceder a esta página");
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
