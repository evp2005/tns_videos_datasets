import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Configurar axios
axios.defaults.withCredentials = false;

<<<<<<< HEAD
// Función para extraer el video ID de YouTube
=======
// ✅ Función para extraer el video ID de una URL de YouTube
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
const getYouTubeVideoId = (url) => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
<<<<<<< HEAD
        if (match && match[1]) return match[1];
=======
        if (match && match[1]) {
            return match[1];
        }
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
    }
    return null;
};

<<<<<<< HEAD
// Función para obtener la miniatura
const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) return null;
=======
// ✅ Función para obtener la URL de la miniatura directamente
const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) return null;

    // YouTube tiene URLs predecibles para miniaturas
    // maxresdefault.jpg = mejor calidad (1280x720)
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const fetchVideoInfo = async (videoUrl) => {
    try {
        console.log("🔍 Obteniendo info del video:", videoUrl);

<<<<<<< HEAD
        const thumbnailUrl = getYouTubeThumbnail(videoUrl);
        console.log("🖼️ Thumbnail generada:", thumbnailUrl);

=======
        // ✅ Generar thumbnail PRIMERO (no depende del backend)
        const thumbnailUrl = getYouTubeThumbnail(videoUrl);
        console.log("🖼️ Thumbnail generada:", thumbnailUrl);

        // Obtener detalles del video del backend
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
        const detailsResponse = await axios.post(
            `${BASE_URL}/get-youtube-video-details`,
            { url: videoUrl }
        );

        console.log("✅ Info obtenida:", detailsResponse.data);

        const data = detailsResponse.data.result;

        return {
<<<<<<< HEAD
            title: data.title, // Con emojis
=======
            title: data.title,
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
            duration: data.duration_string,
            origin_video: "YouTube",
            url_video: videoUrl,
            state: "Pending",
<<<<<<< HEAD
            miniature: thumbnailUrl,
        };

    } catch (err) {
        console.warn("❌ Error al obtener info:", err.response?.data || err.message);
        const exampleThumbnail = getYouTubeThumbnail(videoUrl);

        return {
            title: "Video de ejemplo 🔥",
=======
            miniature: thumbnailUrl, // ✅ URL de miniatura generada
        };
    } catch (err) {
        console.warn("❌ Error al obtener info:", err.response?.data || err.message);
        console.warn("⚡ Usando video de ejemplo");

        // Incluso para el ejemplo, genera una miniatura
        const exampleThumbnail = getYouTubeThumbnail(videoUrl);
        console.log("🖼️ Thumbnail de ejemplo:", exampleThumbnail);

        return {
            title: "Video de ejemplo",
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
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
<<<<<<< HEAD
            { headers: { 'Content-Type': 'application/json' } }
=======
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
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
