import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const user = sessionStorage.getItem("token"); // 👈 ahora usa sessionStorage

    if (!user) {
        console.log("⚠️ Debes iniciar sesión para acceder a esta página");
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
