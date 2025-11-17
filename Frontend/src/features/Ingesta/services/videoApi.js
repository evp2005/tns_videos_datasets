import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // endpoint real

export const fetchVideoInfo = async (videoUrl) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/get-youtube-video-details`,
            { url: videoUrl }
        );

        const data = response.data.result;

        return {
            title: data.title,
            duration: data.duration_string, // formato HH:MM:SS
            origin_video: "YouTube",
            url_video: videoUrl,
            state: "Pending",
        };
    } catch (err) {
        console.warn("❌ No se pudo obtener la info del video, usando ejemplo");
        // ⚡ simulación: devuelve video de ejemplo
        return {
            title: "Video de ejemplo",
            origin_video: "YouTube",
            duration: "01:23:45",
            state: "Pending",
            language: "Español",
            url_video: videoUrl,
            user_id: 1
        };
    }
};
