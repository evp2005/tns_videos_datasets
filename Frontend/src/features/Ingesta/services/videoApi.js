import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Configurar axios
axios.defaults.withCredentials = true;

// 🔹 Extraer ID de YouTube
export const getYouTubeVideoId = (url) => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
};

// 🔹 Obtener miniatura de YouTube
export const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// 🔹 Obtener info de video desde backend
export const fetchVideoInfo = async (videoUrl) => {
    try {
        const thumbnailUrl = getYouTubeThumbnail(videoUrl);

        const response = await axios.post(
            `${BASE_URL}/get-youtube-video-details`,
            { url: videoUrl }
        );

        const data = response.data.result;

        return {
            title: data.title,
            duration: data.duration_string,
            origin_video: "YouTube",
            url_video: videoUrl,
            state: "Completed",
            miniature: thumbnailUrl,
        };
    } catch (err) {
        console.warn("Error obteniendo info:", err.response?.data || err.message);
        return {
            title: "Video de ejemplo 🔥",
            origin_video: "YouTube",
            duration: "00:00:00",
            state: "Completed",
            language: "Español",
            url_video: videoUrl,
            miniature: getYouTubeThumbnail(videoUrl),
            user_id: 1,
        };
    }
};

// 🔹 Subir video al backend
export const uploadVideo = async (videoData, isFile = false) => {
    try {
        const config = { withCredentials: true };
        if (!isFile) config.headers = { "Content-Type": "application/json" };

        const response = await axios.post(
            `${BASE_URL}/video/upload_video`,
            videoData,
            config
        );

        return response.data;
    } catch (err) {
        console.error("Error al guardar video:", err.response?.data || err.message);
        throw err;
    }
};

// 🔹 Traer todos los videos del backend
export const fetchVideos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/video/get_videos`);
        return response.data;
    } catch (err) {
        console.error("Error fetching videos:", err.response?.data || err.message);
        return [];
    }
};

// 🔹 NUEVO: Obtener un video específico por ID desde la base de datos
export const getVideoById = async (videoId) => {
    try {
        const response = await axios.get(`${BASE_URL}/video/${videoId}`);
        return response.data;
    } catch (err) {
        console.error("Error al obtener video por ID:", err.response?.data || err.message);
        throw err;
    }
};