// @ts-nocheck

import { useState } from "react";
import Panel from '../../../Components/Panel';
import AgregadosIngresadosTable from '../../../Components/Tables/AgregadosIngresadosTable';
import { FuenteSelect, IdiomaSelect } from '../../../Components/Select/Select';
import { FaPlus } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { useVideos } from '../hooks/useVideos';

function IngestaPage() {
    const { videos, addVideo, loading } = useVideos();
    const [videoInput, setVideoInput] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [durationInput, setDurationInput] = useState("");
    const [languageInput, setLanguageInput] = useState("Español");
    const [originInput, setOriginInput] = useState("YouTube");

    const handleAddVideo = async () => {
        if (!videoInput || !titleInput || !durationInput) return;
        await addVideo({
            title: titleInput,
            origin_video: originInput,
            duration: durationInput,
            state: "Pending",
            language: languageInput,
            url_video: videoInput,
            user_id: 1
        });

        // Limpiar inputs
        setVideoInput("");
        setTitleInput("");
        setDurationInput("");
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
                                                className='flex-1 px-3 py-1 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
                                    disabled={loading}
                                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50'
                                >
                                    <FaPlus className='text-xs' />
                                    {loading ? "Agregando..." : "Agregar a Cola"}
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
