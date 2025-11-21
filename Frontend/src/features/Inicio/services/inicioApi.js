import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

axios.defaults.withCredentials = true;

export const fetchVideos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/video/get_videos`);
        return response.data;
    } catch (err) {
        console.error("Error fetching videos:", err.response?.data || err.message);
        return [];
    }
};
