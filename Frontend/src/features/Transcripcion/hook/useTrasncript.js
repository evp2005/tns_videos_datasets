import { useState } from "react";
import { getTranscriptPlainText } from "../services/videoTranscriptService";

export const useTranscriptPlain = () => {
    const [transcript, setTranscript] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchPlainTranscript = async (videoUrl) => {
        setLoading(true);
        try {
            const text = await getTranscriptPlainText(videoUrl);
            setTranscript(text);
        } catch {
            setTranscript("❌ Error al obtener la transcripción.");
        }
        setLoading(false);
    };

    return { transcript, loading, fetchPlainTranscript };
};
