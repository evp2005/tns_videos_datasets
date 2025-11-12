import axios from "axios";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/apps/api/users/login_user", // ✅ URL correcta
            { email, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (err) {
        console.error("❌ Error al iniciar sesión:", err.response?.data || err.message);
        throw err;
    }
};
