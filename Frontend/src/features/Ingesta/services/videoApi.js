import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Configurar axios
axios.defaults.withCredentials = false;

// Función para extraer el video ID de YouTube
const getYouTubeVideoId = (url) => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
};

// Función para obtener la miniatura
const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const fetchVideoInfo = async (videoUrl) => {
    try {
        console.log("🔍 Obteniendo info del video:", videoUrl);

        const thumbnailUrl = getYouTubeThumbnail(videoUrl);
        console.log("🖼️ Thumbnail generada:", thumbnailUrl);

        const detailsResponse = await axios.post(
            `${BASE_URL}/get-youtube-video-details`,
            { url: videoUrl }
        );

        console.log("✅ Info obtenida:", detailsResponse.data);

        const data = detailsResponse.data.result;

        return {
            title: data.title, // Con emojis
            duration: data.duration_string,
            origin_video: "YouTube",
            url_video: videoUrl,
            state: "Pending",
            miniature: thumbnailUrl,
        };

    } catch (err) {
        console.warn("❌ Error al obtener info:", err.response?.data || err.message);
        const exampleThumbnail = getYouTubeThumbnail(videoUrl);

        return {
            title: "Video de ejemplo 🔥",
            origin_video: "YouTube",
            duration: "01:23:45",
            state: "Pending",
            language: "Español",
            url_video: videoUrl,
            user_id: 1,
            miniature: exampleThumbnail
        };
    }
};

export const uploadVideo = async (videoData) => {
    try {
        console.log("📤 Enviando video al backend:", videoData);

        const response = await axios.post(
            `${BASE_URL}/users/upload_video`,
            videoData,
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log("✅ Video guardado exitosamente:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error al guardar video:", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
        });
        throw err;
    }
};
