import { useState, useEffect } from "react";
import { fetchVideoInfo } from "../services/videoApi";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";
const STORAGE_KEY = "last_three_videos";

// 🔹 Función para eliminar emojis antes de enviar al backend
const removeEmojis = (text) => {
    return text.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
};

export const useVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 🔹 Cargar del localStorage al iniciar
    useEffect(() => {
        const storedVideos = localStorage.getItem(STORAGE_KEY);
        if (storedVideos) setVideos(JSON.parse(storedVideos));
    }, []);

    // 🔹 Guardar siempre los últimos 3 en localStorage
    const saveToLocalStorage = (videoList) => {
        const lastThree = videoList.slice(-3);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lastThree));
    };

    const getVideoInfoSafe = async (url) => {
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
            // Asignar un ID temporal si no viene del backend
            const tempId = Date.now();
            const newVideo = { ...videoData, id: tempId, state: "Pending" };

            // Agregar al estado local y guardar en localStorage
            setVideos(prev => {
                const newVideos = [...prev, newVideo].slice(-3);
                saveToLocalStorage(newVideos);
                return newVideos;
            });

            // Simular proceso de subida/progreso
            setTimeout(() => {
                setVideos(prev => {
                    const updated = prev.map(v => v.id === tempId ? { ...v, state: "Procesando" } : v);
                    saveToLocalStorage(updated);
                    return updated;
                });
            }, 1000); // 1s después pasa a Procesando

            setTimeout(() => {
                setVideos(prev => {
                    const updated = prev.map(v => v.id === tempId ? { ...v, state: "Completado" } : v);
                    saveToLocalStorage(updated);
                    return updated;
                });
            }, 4000); // 4s después pasa a Completado

            return newVideo;

        } catch (err) {
            console.error("❌ Error al guardar:", err);
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
        getVideoInfo: getVideoInfoSafe,
        addVideo
    };
};
