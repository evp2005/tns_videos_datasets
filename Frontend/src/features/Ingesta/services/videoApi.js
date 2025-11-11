import axios from "axios";

const API_URL = "http://127.0.0.1:8000/apps/api/users";

export const uploadVideo = async (videoData) => {
    try {
        const response = await axios.post(`${API_URL}/upload_video`, videoData);
        return response.data;
    } catch (err) {
        console.error("Error al subir el video:", err);
        throw err;
    }
};
