import { useState } from "react";
import Panel from "../../../Components/Panel";
import AgregadosIngresadosTable from "../../../Components/Tables/AgregadosIngresadosTable";
import { FuenteSelect, IdiomaSelect } from "../../../Components/Select/Select";
import { FaPlus } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { useVideos } from "../hooks/useVideos"; // Asumo que este hook existe
import axios from "axios"; // Importamos axios para la llamada a la API
function IngestaPage() {
  const { videos, loading, error, addVideo } = useVideos(); // Quitamos getVideoInfo del hook
  const [videoInput, setVideoInput] = useState("");
  const [originInput, setOriginInput] = useState("youtube");
  const [languageInput, setLanguageInput] = useState("Español");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [lastAddedVideoId, setLastAddedVideoId] = useState(null); // <--- ID del último video agregado

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Esta función ahora vive aquí, pero idealmente estaría en tu hook `useVideos`
  const getVideoInfo = async (url, origin) => {
    let endpoint = "";
    if (origin === "youtube") {
      endpoint = "http://127.0.0.1:8000/api/get-youtube-video-details";
    } else if (origin === "EscuelaIT") {
      endpoint = "http://127.0.0.1:8000/api/get-escuelait-video-details";
    } else {
      throw new Error("Origen de video no soportado");
    }

    try {
      const response = await axios.post(endpoint, { url });
      return response.data.result; // Devuelve el objeto con title, duration, miniature
    } catch (err) {
      console.error(`Error fetching video info from ${origin}:`, err);
      return null;
    }
  };

  const handleAddVideo = async () => {
    if (!videoInput.trim()) {
      alert("Por favor ingresa una URL de video");
      return;
    }

    try {
      const info = await getVideoInfo(videoInput, originInput);
      if (!info) {
        showMessage("⚠️ No se pudo obtener la información del video", "error");
        return;
      }

      const videoData = {
        title: info.title,
        duration: info.duration || info.duration_string,
        origin_video: originInput,
        url_video: videoInput,
        state: "Pending",
        language: languageInput,
        user_id: 1,
        miniature: info.miniature || null,
      };

      const savedVideo = await addVideo(videoData);
      console.log("✅ Video agregado a DB y estado:", savedVideo);

      setLastAddedVideoId(savedVideo.id); // <--- guardamos ID del video agregado
      showMessage("✅ Video agregado correctamente");
      setVideoInput("");
    } catch (err) {
      console.error("❌ Error al agregar video:", err);
      showMessage("❌ Ocurrió un error al agregar el video", "error");
    }
  };

  return (
    <section className="flex h-screen overflow-hidden">
      <Panel />
      <main className="flex-1 ml-0 lg:ml-64 flex flex-col">
        <div className="h-14 bg-white border-b border-gray-200"></div>
        <section className="flex-1 bg-[#FAFAF7] overflow-y-auto">
          <div className="flex justify-center p-8">
            <div className="w-full max-w-6xl">
              <div className="mb-8">
                <h1 className="font-bold text-3xl text-gray-900 mb-2">
                  Ingesta de Videos
                </h1>
                <p className="text-gray-600">
                  Agrega videos desde diferentes fuentes para procesarlos
                </p>
              </div>

              {message.text && (
                <div
                  className={`px-4 py-3 rounded-lg mb-4 ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                  ❌ Error: {error}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Agrega videos
                </h2>
                <p className="text-gray-600 mb-6">
                  El título, duración y miniatura se extraerán automáticamente
                  del video
                </p>

                <div className="grid grid-cols-3 gap-8 mb-6">
                  <FuenteSelect
                    onChange={setOriginInput}
                    defaultValue={originInput}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      URL/Archivo
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="http://youtube.com/watch?v=..."
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={videoInput}
                        onChange={(e) => setVideoInput(e.target.value)}
                      />
                      <label className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer inline-flex items-center gap-1">
                        <HiDownload className="text-sm" />
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                  <IdiomaSelect
                    onChange={setLanguageInput}
                    defaultValue={languageInput}
                  />
                </div>

                <button
                  onClick={handleAddVideo}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <FaPlus
                    className={`text-xs ${loading ? "animate-spin" : ""}`}
                  />
                  {loading ? "Agregando..." : "Agregar a Cola"}
                </button>
              </div>

              {/* Tabla de videos agregados */}
              <AgregadosIngresadosTable
                videos={videos}
                newlyAddedId={lastAddedVideoId}
              />
            </div>
          </div>
        </section>
      </main>
    </section>
  );
}

export default IngestaPage;
