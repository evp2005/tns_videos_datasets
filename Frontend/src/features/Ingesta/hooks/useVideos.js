import { useState } from "react";
import { fetchVideoInfo } from "../services/videoApi";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

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

    const addVideo = async (videoData) => {
        if (!videoData) return;

        setLoading(true);
        setError(null);

        try {
            console.log("📤 Enviando al backend:", videoData);

            // ✅ ENVIAR AL BACKEND PRIMERO
            const response = await axios.post(
                `${BASE_URL}/users/upload_video`,
                videoData
            );

            console.log("✅ Respuesta del backend:", response.data);

            // ✅ Si se guardó exitosamente, agregar al estado local
            const savedVideo = {
                ...videoData,
                id: response.data.id // ID generado por la base de datos
            };

            setVideos(prev => {
                const newVideos = [...prev, savedVideo];

                console.log("📊 Videos en estado:", newVideos.map(v => ({
                    id: v.id,
                    title: v.title,
                    duration: v.duration,
                    origin: v.origin_video
                })));

                return newVideos;
            });

            return response.data;

        } catch (err) {
            console.error("❌ Error al guardar en DB:", err.response?.data || err.message);
            setError("Error al guardar el video en la base de datos");
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
    };
};