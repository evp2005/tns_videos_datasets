import { useState, useEffect } from "react";
import { fetchVideoInfo, uploadVideo, fetchVideos } from "../services/videoApi";

// Eliminar emojis antes de enviar
const removeEmojis = (text) => {
    return text.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
};

export const useVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar los últimos 3 videos desde el backend al montar el componente
    useEffect(() => {
        loadLastThreeVideos();
    }, []);

    const loadLastThreeVideos = async () => {
        setLoading(true);
        setError(null);
        try {
            const allVideos = await fetchVideos();
            // Obtener los últimos 3 videos y mostrarlos en orden descendente
            const lastThree = allVideos.slice(-3).reverse();
            setVideos(lastThree);
        } catch (err) {
            console.error("Error al cargar videos:", err);
            setError("No se pudieron cargar los videos");
        } finally {
            setLoading(false);
        }
    };

    // Obtener información del video (miniatura, título, duración)
    const getVideoInfo = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const info = await fetchVideoInfo(url);
            if (!info) {
                setError("No se pudo obtener la información del video");
                return null;
            }
            return info;
        } catch (err) {
            console.error("Error al obtener info del video:", err);
            setError("No se pudo obtener la información del video");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Agregar video al backend
    const addVideo = async (videoData) => {
        if (!videoData) return null;

        setLoading(true);
        setError(null);

        try {
            // Obtener miniatura actualizada
            const info = await fetchVideoInfo(videoData.url_video);

            // Preparar datos para el backend
            const backendData = {
                ...videoData,
                title: removeEmojis(videoData.title),
                miniature: info?.miniature || videoData.miniature,
            };

            // Guardar en la base de datos
            const savedVideo = await uploadVideo(backendData);
            console.log("✅ Video guardado en DB:", savedVideo);

            // Recargar solo los últimos 3 videos desde el backend
            await loadLastThreeVideos();

            return savedVideo;

        } catch (err) {
            console.error("❌ Error al guardar video:", err);
            setError("Error al agregar el video");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        videos,
        loading,
        error,
        getVideoInfo,
        addVideo,
        loadLastThreeVideos, // Por si necesitas recargar manualmente
    };
};