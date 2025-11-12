// @ts-nocheck

import { useState } from "react";
import Panel from '../../../Components/Panel';
import AgregadosIngresadosTable from '../../../Components/Tables/AgregadosIngresadosTable';
import { FuenteSelect, IdiomaSelect } from '../../../Components/Select/Select';
import { FaPlus } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { useVideos } from '../hooks/useVideos';

function IngestaPage() {
    const { videos, addVideo, getVideoTitleFromUrl, loading, error } = useVideos();
    const [videoInput, setVideoInput] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [durationInput, setDurationInput] = useState("");
    const [languageInput, setLanguageInput] = useState("Español");
    const [originInput, setOriginInput] = useState("YouTube");
    const [successMessage, setSuccessMessage] = useState("");
    const [isFetchingTitle, setIsFetchingTitle] = useState(false);

    const handleAddVideo = async () => {
        if (!videoInput) {
            alert("Por favor ingresa una URL de video");
            return;
        }

        setSuccessMessage("");

        try {
            let finalTitle = titleInput;

            // Si el título está vacío, intentar obtenerlo automáticamente
            if (!finalTitle || finalTitle.trim() === "") {
                setIsFetchingTitle(true);
                try {
                    console.log("🔍 Obteniendo título automáticamente...");
                    finalTitle = await getVideoTitleFromUrl(videoInput);
                    setTitleInput(finalTitle); // Actualizar el input con el título obtenido
                    console.log("✅ Título obtenido:", finalTitle);
                } catch (titleError) {
                    console.warn("⚠️ No se pudo obtener el título, usando 'Sin título'");
                    finalTitle = "Sin título";
                } finally {
                    setIsFetchingTitle(false);
                }
            }

            // Ahora sí, agregar el video con el título
            await addVideo({
                title: finalTitle,
                origin_video: originInput,
                duration: durationInput || "0", // Enviar "0" si está vacío
                state: "Pending",
                language: languageInput,
                url_video: videoInput,
                user_id: 1
            });

            // Limpiar inputs
            setVideoInput("");
            setTitleInput("");
            setDurationInput("");
            setSuccessMessage("✅ Video agregado correctamente");

            // Ocultar mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error:", err);
            // El error ya se maneja en el hook
        }
    };

    return (
        <section className='flex h-screen overflow-hidden'>
            <Panel />
            <main className='flex-1 ml-0 lg:ml-64 flex flex-col'>
                <div className='h-14 bg-white border-b border-gray-200'></div>

                <section className='flex-1 bg-[#FAFAF7] overflow-y-auto'>
                    <div className='flex justify-center p-8'>
                        <div className='w-full max-w-6xl'>
                            {/* Header */}
                            <div className='mb-8'>
                                <h1 className='font-bold text-3xl text-gray-900 mb-2'>
                                    Ingesta de Videos
                                </h1>
                                <p className='text-gray-600'>
                                    Agrega videos desde diferentes fuentes para procesarlos
                                </p>
                            </div>

                            {/* Mensajes de estado */}
                            {successMessage && (
                                <div className='bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4'>
                                    {successMessage}
                                </div>
                            )}

                            {error && (
                                <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4'>
                                    ❌ Error: {error}
                                </div>
                            )}

                            {/* Formulario Agregar Videos */}
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-6 mb-8'>
                                <div className='mb-6'>
                                    <h2 className='text-xl font-semibold text-gray-900 mb-2'>Agrega videos</h2>
                                    <p className='text-gray-600'>
                                        El título y duración se extraerán automáticamente del video
                                    </p>
                                </div>

                                <div className='grid grid-cols-3 gap-8 mb-6'>
                                    {/* Fuente */}
                                    <FuenteSelect
                                        onChange={(value) => setOriginInput(value)}
                                        defaultValue={originInput}
                                    />

                                    {/* URL/Archivo */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-900 mb-3'>
                                            URL/Archivo
                                        </label>
                                        <div className='flex gap-2'>
                                            <input
                                                type='text'
                                                placeholder='http://youtube.com/watch?v=...'
                                                className='flex-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                value={videoInput}
                                                onChange={(e) => setVideoInput(e.target.value)}
                                            />
                                            <button className='px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50'>
                                                <HiDownload className='text-sm' />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Idioma Origen */}
                                    <IdiomaSelect
                                        onChange={(value) => setLanguageInput(value)}
                                        defaultValue={languageInput}
                                    />
                                </div>



                                {/* Botón Agregar */}
                                <button
                                    onClick={handleAddVideo}
                                    disabled={loading || isFetchingTitle}
                                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <FaPlus className='text-xs' />
                                    {isFetchingTitle ? "Obteniendo título..." : loading ? "Agregando..." : "Agregar a Cola"}
                                </button>
                            </div>

                            {/* Tabla de Agregados Ingresados */}
                            <AgregadosIngresadosTable videos={videos} />

                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default IngestaPage;