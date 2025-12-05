// src/features/Doblaje/pages/DoblajePage.jsx
import { useState, useEffect } from 'react';
import Panel from '../../../Components/Panel';
import { FaArrowLeft, FaYoutube } from "react-icons/fa";
import { Select, Table, Slider, Checkbox, Modal, Spin } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";

function DoblajePage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { video: initialVideo } = state || {};

    const [video, setVideo] = useState(initialVideo);
    const [idiomaOrigen, setIdiomaOrigen] = useState("en");
    const [idiomaDestino, setIdiomaDestino] = useState("es");
    const [mantenerPistaOriginal, setMantenerPistaOriginal] = useState(false);
    const [volumen, setVolumen] = useState(0);
    const [velocidad, setVelocidad] = useState(1.0);
    const [useEdgeTTS, setUseEdgeTTS] = useState(true);

    // Estados de procesamiento
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");
    const [error, setError] = useState(null);

    // Cargar video desde sessionStorage si no viene en state
    useEffect(() => {
        if (!video) {
            const storedVideo = sessionStorage.getItem('currentVideo');
            if (storedVideo) {
                setVideo(JSON.parse(storedVideo));
            } else {
                // Redirigir a ingesta si no hay video
                navigate('/ingesta');
            }
        }
    }, [video, navigate]);

    // === DATOS DE LA TABLA DE TRADUCCIÓN (ejemplo estático) ===
    const segmentosTraduccion = [
        { key: 1, inicio: "00:00:01", fin: "00:00:04", textoOrigen: "Welcome", textoTrad: "Bienvenidos" },
        { key: 2, inicio: "00:00:04", fin: "00:00:07", textoOrigen: "This is React tutorial", textoTrad: "Este es un tutorial de React" },
        { key: 3, inicio: "00:00:07", fin: "00:00:09", textoOrigen: "Let's get started", textoTrad: "Empecemos" },
    ];

    const columnsTraduccion = [
        {
            title: '#',
            dataIndex: 'key',
            width: 60,
            align: "center",
            render: t => <span className='font-medium'>{t}</span>
        },
        {
            title: 'Inicio',
            dataIndex: 'inicio',
            render: t => <span className='font-mono text-sm'>{t}</span>
        },
        {
            title: 'Fin',
            dataIndex: 'fin',
            render: t => <span className='font-mono text-sm'>{t}</span>
        },
        {
            title: 'Texto Origen',
            dataIndex: 'textoOrigen',
            render: t => <span className='font-medium'>{t}</span>
        },
        {
            title: 'Texto traducido',
            dataIndex: 'textoTrad',
            render: t => <span className='font-medium'>{t}</span>
        }
    ];

    // Función para generar el doblaje
    const handleGenerarDoblaje = async () => {
        if (!video || !video.url_video) {
            setError("No hay URL de video disponible");
            return;
        }

        setLoading(true);
        setProgress(0);
        setStatusMessage("Iniciando proceso de doblaje...");
        setError(null);

        try {
            // Simular progreso
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 2000);

            setStatusMessage("Descargando video...");

            // Llamar al endpoint de doblaje desde URL
            const response = await axios.post(
                `${BASE_URL}/dubbing/dub-from-url/`,
                {
                    url: video.url_video,
                    target_lang: idiomaDestino,
                    origin_video: video.origin_video.toLowerCase(),
                    video_title: video.title,
                    source_lang: idiomaOrigen === "auto" ? "auto" : idiomaOrigen,
                    use_edge_tts: useEdgeTTS
                },
                {
                    responseType: 'blob', // Importante para recibir el video
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    }
                }
            );

            clearInterval(progressInterval);
            setProgress(100);
            setStatusMessage("¡Doblaje completado!");

            // Crear URL del blob y descargar
            const blob = new Blob([response.data], { type: 'video/mp4' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Nombre del archivo
            const safeTitle = video.title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
            link.download = `${safeTitle}_doblado_${idiomaDestino}.mp4`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            // Mostrar modal de éxito
            Modal.success({
                title: 'Doblaje Exitoso',
                content: 'El video ha sido doblado y descargado correctamente.',
                okText: 'Aceptar'
            });

        } catch (err) {
            console.error("Error en el doblaje:", err);
            setError(
                err.response?.data?.message ||
                "Error al procesar el doblaje. Por favor, intenta nuevamente."
            );

            Modal.error({
                title: 'Error en el Doblaje',
                content: err.response?.data?.message ||
                    "No se pudo completar el proceso de doblaje.",
                okText: 'Cerrar'
            });
        } finally {
            setLoading(false);
            setProgress(0);
            setStatusMessage("");
        }
    };

    if (!video) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" tip="Cargando información del video..." />
            </div>
        );
    }

    return (
        <section className='flex h-screen overflow-hidden'>
            <Panel />

            <main className='flex-1 lg:ml-64 p-8 bg-[#FAFAF7] overflow-y-auto'>

                {/* HEADER */}
                <div className='mb-8'>
                    <h1 className='font-bold text-3xl text-gray-900 mb-2'>Traducción y Doblaje</h1>
                    <p className='text-gray-600'>Flujo de doblaje automático desde URL</p>
                </div>

                {/* Mensajes de error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                        ❌ {error}
                    </div>
                )}

                {/* VIDEO + INFORMACIÓN */}
                <div className='bg-white border border-gray-200 rounded-xl p-8 mb-10'>
                    <div className='flex justify-between mb-6'>
                        <div>
                            <h2 className='text-xl font-semibold'>Material a Doblar</h2>
                            <p className='text-gray-600'>Video desde {video.origin_video}</p>
                        </div>

                        <Link to="/ingesta">
                            <button className='border-2 border-gray-200 px-5 py-1 rounded-lg flex items-center gap-2 hover:bg-gray-50'>
                                <FaArrowLeft /> Volver a Ingesta
                            </button>
                        </Link>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                        {/* VIDEO */}
                        <div>
                            <h3 className='font-semibold mb-3'>Video Original</h3>

                            <div className='h-60 rounded-lg overflow-hidden mb-3 bg-gray-100'>
                                {video.miniature ? (
                                    <img
                                        src={video.miniature}
                                        alt="thumbnail"
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Sin miniatura
                                    </div>
                                )}
                            </div>

                            <p className='font-medium'>{video.title}</p>

                            <div className='flex gap-4 mt-2 text-sm text-gray-600'>
                                <FaYoutube className="text-red-500" />
                                {video.origin_video}
                                <span>Duración: {video.duration}</span>
                            </div>

                            <div className='mt-2 text-xs text-gray-500 break-all'>
                                URL: {video.url_video}
                            </div>
                        </div>

                        {/* INFORMACIÓN DEL VIDEO */}
                        <div>
                            <h3 className='font-semibold mb-3'>Información del Video</h3>

                            <div className='p-5 bg-gray-50 rounded-lg border space-y-2'>
                                <p className='flex justify-between'>
                                    <b>Estado:</b>
                                    <span className="text-green-600">{video.state}</span>
                                </p>
                                <p className='flex justify-between'>
                                    <b>Idioma:</b> {video.language}
                                </p>
                                <p className='flex justify-between'>
                                    <b>Origen:</b> {video.origin_video}
                                </p>
                                <p className='flex justify-between'>
                                    <b>Duración:</b> {video.duration}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONFIGURACIÓN */}
                <div className='bg-white border border-gray-200 rounded-xl p-8 mb-10'>
                    <h3 className='text-xl font-semibold mb-4'>Configuración de Doblaje</h3>

                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>

                        <div>
                            <p className='font-semibold mb-2'>Idioma Origen</p>
                            <Select
                                value={idiomaOrigen}
                                onChange={setIdiomaOrigen}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "auto", label: "Detectar automáticamente" },
                                    { value: "en", label: "Inglés" },
                                    { value: "es", label: "Español" },
                                    { value: "fr", label: "Francés" },
                                    { value: "pt", label: "Portugués" },
                                    { value: "de", label: "Alemán" },
                                    { value: "it", label: "Italiano" }
                                ]}
                            />
                        </div>

                        <div>
                            <p className='font-semibold mb-2'>Idioma Destino</p>
                            <Select
                                value={idiomaDestino}
                                onChange={setIdiomaDestino}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "es", label: "Español" },
                                    { value: "en", label: "Inglés" },
                                    { value: "fr", label: "Francés" },
                                    { value: "pt", label: "Portugués" },
                                    { value: "de", label: "Alemán" },
                                    { value: "it", label: "Italiano" }
                                ]}
                            />
                        </div>

                        <div>
                            <p className='font-semibold mb-2'>Motor TTS</p>
                            <Select
                                value={useEdgeTTS ? "edge" : "gtts"}
                                onChange={(value) => setUseEdgeTTS(value === "edge")}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "edge", label: "Edge TTS (Recomendado)" },
                                    { value: "gtts", label: "Google TTS" }
                                ]}
                            />
                        </div>

                        <div className='flex items-center gap-3 mt-6'>
                            <Checkbox
                                checked={mantenerPistaOriginal}
                                onChange={e => setMantenerPistaOriginal(e.target.checked)}
                            >
                                Mantener pista original
                            </Checkbox>
                        </div>
                    </div>

                    {/* Controles adicionales */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
                        <div>
                            <p className='font-semibold mb-2'>Volumen: {volumen}</p>
                            <Slider
                                min={-20}
                                max={20}
                                value={volumen}
                                onChange={setVolumen}
                                disabled={true}
                                tooltip={{ formatter: (value) => `${value} dB` }}
                            />
                            <p className='text-xs text-gray-500 mt-1'>Funcionalidad en desarrollo</p>
                        </div>

                        <div>
                            <p className='font-semibold mb-2'>Velocidad: {velocidad}x</p>
                            <Slider
                                min={0.5}
                                max={1.5}
                                step={0.1}
                                value={velocidad}
                                onChange={setVelocidad}
                                disabled={true}
                                tooltip={{ formatter: (value) => `${value}x` }}
                            />
                            <p className='text-xs text-gray-500 mt-1'>Funcionalidad en desarrollo</p>
                        </div>
                    </div>
                </div>

                {/* TABLA DE TRADUCCIÓN (ejemplo estático) */}
                <div className='bg-white border border-gray-200 rounded-xl p-8 mb-10'>
                    <h3 className='text-xl font-semibold mb-4'>Vista Previa de Traducción</h3>
                    <p className='text-sm text-gray-500 mb-4'>
                        Ejemplo de cómo se verán los segmentos traducidos
                    </p>
                    <Table
                        dataSource={segmentosTraduccion}
                        columns={columnsTraduccion}
                        pagination={false}
                    />
                </div>

                {/* BOTÓN DE DOBLAJE */}
                <div className="flex flex-col items-start gap-4">
                    <button
                        onClick={handleGenerarDoblaje}
                        disabled={loading}
                        className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg 
                            hover:bg-blue-700 hover:shadow-blue-300 transition-all duration-300
                            active:scale-95 flex items-center justify-center gap-2
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <Spin size="small" />
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <span>🎙️</span>
                                <span>Generar Doblaje</span>
                            </>
                        )}
                    </button>

                    {/* Barra de progreso */}
                    {loading && (
                        <div className="w-full max-w-md">
                            <div className="mb-2 flex justify-between items-center">
                                <span className="text-sm text-gray-600">{statusMessage}</span>
                                <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </section>
    );
}

export default DoblajePage;