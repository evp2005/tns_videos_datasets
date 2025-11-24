import { useEffect, useState } from "react";
import { fetchVideos } from "../services/inicioApi";

export const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await fetchVideos();
        const lastFive = data.slice(-5).reverse(); // reverse para mostrar el más reciente primero
        setVideos(lastFive);
      } catch (err) {
        setError(err.message || "Error al cargar videos");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return { videos, loading, error };
};
