import axios from "axios";

export const getTranscriptPlainText = async (videoUrl) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/get-youtube-transcript-plain-text",
    { url: videoUrl }
  );
  return response.data; // texto plano
};

export const getTranscriptSRT = async (videoUrl) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/get-youtube-transcript-srt",
    { url: videoUrl }
  );
  return response.data; // texto en formato SRT
};

export const getTranscriptMarkdownYT = async (videoUrl) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/agent/process-vtt-youtube",
    { url: videoUrl }
  );
  return response.data;
};

export const getTranscriptSRTEIT = async (videoUrl) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/get-escuelait-transcript-vtt",
    { url: videoUrl }
  );
  return response.data; // texto en formato VTT (compatible con SRT)
};

export const getTranscriptPlainTextEIT = async (videoUrl) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/get-escuelait-transcript-plain-text",
    { url: videoUrl }
  );
  return response.data;
};

export const getTranscriptMarkdownEIT = async (videoUrl) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/agent/process-vtt-escuelait",
    { url: videoUrl }
  );
  return response.data;
};
