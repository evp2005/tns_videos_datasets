// @ts-nocheck

import { useState } from "react";
import { uploadVideo } from "../services/videoApi";

export function useVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const addVideo = async (videoData) => {
        setLoading(true);
        try {
            const newVideo = await uploadVideo(videoData);
            setVideos(prev => [...prev, newVideo]);
        } catch (err) {
            console.error("Error agregando video:", err);
        } finally {
            setLoading(false);
        }
    };

    return { videos, addVideo, loading };
}
