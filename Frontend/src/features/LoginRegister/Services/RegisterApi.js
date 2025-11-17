import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

export const registerApi = async (userData) => {
    try {
        const response = await axios.post(
            `${API_URL}create_user`,
            userData,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Error en RegisterApi:", error.response?.data || error.message);
        throw error;
    }
};
