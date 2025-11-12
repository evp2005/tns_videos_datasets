import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/apps";

// 🧩 1️⃣ Obtener el título del video desde la URL
export const fetchVideoTitle = async (videoUrl) => {
    try {
        const response = await axios.post(`${BASE_URL}/agent/get-title/`, {
            url: videoUrl,
        });
        return response.data; // devuelve { title: "..." }
    } catch (err) {
        console.error("❌ Error al obtener el título:", err);
        throw err;
    }
};

// 🧩 2️⃣ Subir el video a la base de datos
export const uploadVideo = async (videoData) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/users/upload_video/`, videoData,
            {
                withCredentials: true // ⬅️ Añade esto
            }

        );
        return response.data;
    } catch (err) {
        console.error("❌ Error al subir el video:", err);
        throw err;
    }
};