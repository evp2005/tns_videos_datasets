import { useState } from "react";
import { fetchVideoInfo } from "../services/videoApi";

export const useVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getVideoInfo = async (url) => {
        setError(null);
        setLoading(true);
        try {
            const info = await fetchVideoInfo(url);
            if (!info) {
                setError("No se pudo obtener la información del video");
                return null;
            }
            return info;
        } catch (err) {
            setError("No se pudo obtener la información del video");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addVideo = (videoData) => {
        if (!videoData) return;

        setVideos(prev => {
            const newVideos = [...prev, videoData];

            // ⚡ mostrar en consola todos los títulos y duraciones
            console.log("Videos agregados:", newVideos.map(v => ({
                title: v.title,
                duration: v.duration,
                origin: v.origin_video
            })));

            return newVideos;
        });
    };

    return {
        videos,
        loading,
        error,
        getVideoInfo,
        addVideo, // ✅ Nombre correcto exportado
    };
};