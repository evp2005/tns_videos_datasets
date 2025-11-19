import { useState } from "react";
import { getTranscriptPlainText, getTranscriptSRT } from "../services/videoTranscriptService";

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

export const useTranscriptSRT = () => {
    const [transcript, setTranscript] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchSRTTranscript = async (videoUrl) => {
        setLoading(true);
        try {
            const srtData = await getTranscriptSRT(videoUrl);
            setTranscript(srtData.result || srtData);    
        } catch {
            setTranscript("❌ Error al obtener la transcripción en SRT.");
        }
        setLoading(false);
    };

    return { transcript, loading, fetchSRTTranscript };
}