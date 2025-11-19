import axios from "axios";

export const getTranscriptPlainText = async (videoUrl) => {
    const response = await axios.post(
        "http://127.0.0.1:8000/api/get-youtube-transcript-plain-text",
        { url: videoUrl }
    );
    return response.data; // texto plano
};
