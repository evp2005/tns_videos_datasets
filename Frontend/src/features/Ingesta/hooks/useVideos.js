<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
import { fetchVideoInfo } from "../services/videoApi";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";
<<<<<<< HEAD
const STORAGE_KEY = "last_three_videos";

// 🔹 Función para eliminar emojis antes de enviar al backend
const removeEmojis = (text) => {
    return text.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
};

=======

>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
export const useVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

<<<<<<< HEAD
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
=======
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
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
        setError(null);
        setLoading(true);
        try {
<<<<<<< HEAD
            const info = await fetchVideoInfo(url);
            if (!info) {
                setError("No se pudo obtener la información del video");
                return null;
            }
            return info;
        } catch (err) {
            setError("No se pudo obtener la información del video");
            return null;
=======
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
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
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
<<<<<<< HEAD
        getVideoInfo: getVideoInfoSafe,
        addVideo
=======
        getVideoInfo,
        addVideo,
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
    };
};
