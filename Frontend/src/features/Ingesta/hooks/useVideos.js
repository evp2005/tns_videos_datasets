// @ts-nocheck
import { useState } from "react";
// Importamos las funciones API desde el archivo videoApi.js
import { fetchVideoTitle, uploadVideo } from "../services/videoApi.js"

/**
 * Función auxiliar para limpiar el título eliminando emojis y caracteres no estándar
 * que causan errores de encoding en MySQL (Error 1366).
 * @param {string} title - El título a limpiar.
 * @returns {string} El título limpio.
 */
const cleanTitleForDb = (title) => {
    if (!title) return "Sin título";

    // Quitar emojis comunes y otros símbolos que usan 4 bytes en UTF-8
    const cleaned = String(title)
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        // Quitar cualquier carácter de control o no imprimible si aún persiste
        .replace(/[^ -~]+/g, '')
        .trim();

    return cleaned || "Sin título";
};


/**
 * Hook personalizado para manejar el estado y la lógica de ingesta de videos.
 * Incluye la funcionalidad de obtener el título y agregar un video.
 */
export const useVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Llama a la API para obtener el título del video y limpia el resultado.
     * @param {string} url_video - URL del video.
     * @returns {Promise<string>} El título limpio del video.
     */
    const getVideoTitleFromUrl = async (url_video) => {
        try {
            console.log("🔍 Intentando obtener el título para la URL:", url_video);
            const titleResponse = await fetchVideoTitle(url_video);

            const fetchedTitle = (titleResponse && (titleResponse.title || titleResponse.data)) || null;

            // Usamos la función de limpieza para el título obtenido, así se muestra limpio en el input.
            const cleanTitle = cleanTitleForDb(fetchedTitle);

            console.log("✅ Título obtenido y limpio (desde endpoint):", cleanTitle);
            return cleanTitle;
        } catch (err) {
            console.error("⚠️ Error al obtener el título:", err);
            throw new Error(err.message || "Error de red: No se pudo conectar con el servidor para obtener el título.");
        }
    };

    /**
     * Procesa la adición de un video, usando el título actual
     * y subiendo la información a la base de datos a través de la API.
     * @param {object} videoData - Datos iniciales del video.
     * @returns {Promise<object>} La respuesta de la subida.
     */
    const addVideo = async (videoData) => {
        setLoading(true);
        setError(null);

        try {
            // FIX #1: Limpiamos el título (user-edited o fetched) justo antes de enviar
            const cleanedTitle = cleanTitleForDb(videoData.title);

            const completeVideoData = {
                title: cleanedTitle,
                // FIX #2: Si la duración está vacía, enviamos "" en lugar de null 
                // para evitar el error MySQL "Column 'duration' cannot be null".
                duration: videoData.duration || "",
                origin_video: videoData.origin_video,
                url_video: videoData.url_video,
                state: "Pending",
                language: videoData.language,
                user_id: 1, // HARDCODED como se solicitó
                created_at: new Date().toISOString()
            };

            console.log("📤 Intentando subir video a la base de datos con payload:", completeVideoData);

            // Llamada real al endpoint de subida
            const uploadResponse = await uploadVideo(completeVideoData);

            console.log("✅ Video subido exitosamente. Respuesta:", uploadResponse);

            // 3. Actualizar el estado local para reflejar la adición
            const newVideoId = uploadResponse.id || Date.now();

            setVideos(prevVideos => [...prevVideos, {
                ...completeVideoData,
                id: newVideoId,
                created_at: uploadResponse.created_at || completeVideoData.created_at
            }]);

            return uploadResponse;
        } catch (err) {
            const errorMessage = err.message || "Error al agregar el video a la cola. Revisa la consola y el backend de Django.";
            console.error("⚠️ Error agregando video (Final):", err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        videos,
        addVideo,
        getVideoTitleFromUrl,
        loading,
        error
    };
};