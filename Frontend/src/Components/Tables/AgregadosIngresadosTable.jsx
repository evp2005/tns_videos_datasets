import { useState } from "react";
import { FaPlay, FaEllipsisV } from "react-icons/fa";
import Completado from "../../Components/Estados/Completado";
import Error from "../../Components/Estados/Error";
import Pendiente from "../../Components/Estados/Pendiente";
import Procesando from "../../Components/Estados/Procesando";
import Revision from "../../Components/Estados/Revision";

const AgregadosIngresadosTable = ({ videos = [] }) => {
<<<<<<< HEAD
    const [openMenuId, setOpenMenuId] = useState(null);
=======
    // Obtener los últimos 3 videos
    const recentVideos = videos.slice(-3).reverse();
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a

    // Obtener los últimos 3 videos
    const recentVideos = videos.slice(-3).reverse();

    const getEstadoComponent = (estado) => {
        switch (estado) {
            case "Completado":
            case "Completed":
<<<<<<< HEAD
                return <Completado />;
            case "Procesando":
            case "Processing":
                return <Procesando />;
            case "Pendiente":
            case "Pending":
                return <Pendiente />;
            case "Error":
                return <Error />;
            case "Revision":
                return <Revision />;
=======
                return "bg-green-100 text-green-700 border border-green-200";
            case "Procesando":
            case "Processing":
                return "bg-blue-100 text-blue-700 border border-blue-200";
            case "Pendiente":
            case "Pending":
                return "bg-yellow-100 text-yellow-700 border border-yellow-200";
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
            default:
                return <Pendiente />;
        }
    };

<<<<<<< HEAD
    const getProgressValue = (estado, progress) => {
        // Si hay un valor de progreso específico, usarlo
        if (progress !== undefined && progress !== null) {
            return progress;
        }

        // Si no, determinar por estado
        switch (estado) {
            case "Completado":
            case "Completed":
                return 100;
            case "Procesando":
            case "Processing":
                return 50; // Por defecto si está procesando
            case "Pendiente":
            case "Pending":
                return 0;
            default:
                return 0;
        }
    };

    const handleMenuClick = (videoId) => {
        setOpenMenuId(openMenuId === videoId ? null : videoId);
    };

    const handleOptionClick = (videoId, option) => {
        console.log(`Video ${videoId}: ${option}`);
        setOpenMenuId(null);
        // Aquí puedes agregar la lógica para cada opción
=======
    const getEstadoTexto = (estado) => {
        const traducciones = {
            "Pending": "Pendiente",
            "Processing": "Procesando",
            "Completed": "Completado"
        };
        return traducciones[estado] || estado;
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
    };

    if (recentVideos.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-8 py-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Agregados Ingresados</h3>
                    <p className="text-gray-600">Selecciona qué hacer con cada video</p>
                </div>
                <div className="p-12 text-center text-gray-500">
                    No hay videos agregados todavía
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Agregados Ingresados</h3>
                <p className="text-gray-600">Últimos {recentVideos.length} videos agregados</p>
            </div>

            <div className="p-6">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">
                                Miniatura
                            </th>
<<<<<<< HEAD
                            <th className="pb-4 text-left text-sm font-bold text-gray-700 pl-4">
=======
                            <th className="pb-4 text-left text-sm font-medium text-gray-700 pl-4">
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
                                Título
                            </th>
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">
                                Fuente
                            </th>
<<<<<<< HEAD
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">
                                Progreso
                            </th>
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">
=======
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
                                Estado
                            </th>
                            <th className="pb-4 text-center text-sm font-bold text-gray-700 w-20">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
<<<<<<< HEAD
                        {recentVideos.map((video, index) => {
                            const progressValue = getProgressValue(video.state, video.progress);

                            return (
                                <tr
                                    key={video.id}
                                    className={`transition-all hover:bg-gray-50 ${index !== recentVideos.length - 1 ? 'border-b border-gray-200' : ''
                                        }`}
                                >
                                    {/* Miniatura */}
                                    <td className="py-5 px-4">
                                        <div className="flex items-center justify-center">
                                            {video.miniature ? (
                                                <img
                                                    src={video.miniature}
                                                    alt={video.title}
                                                    className="w-32 h-20 object-cover rounded-lg shadow-sm"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            {/* Placeholder */}
                                            <div
                                                className={`items-center justify-center w-32 h-20 bg-gray-200 rounded-lg ${video.miniature ? 'hidden' : 'flex'
                                                    }`}
                                            >
                                                <FaPlay className="text-gray-400 text-xl" />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Título + duración */}
                                    <td className="py-5 px-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                                                {video.title}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {video.duration}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Fuente */}
                                    <td className="px-4 text-sm text-gray-700 text-center">
                                        <span className="font-medium">{video.origin_video}</span>
                                    </td>

                                    {/* Progreso */}
                                    <td className="px-4">
                                        <div className="flex items-center gap-3 justify-center">
                                            <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ease-out rounded-full ${progressValue === 100
                                                            ? 'bg-blue-500'
                                                            : progressValue > 0
                                                                ? 'bg-blue-400'
                                                                : 'bg-gray-300'
                                                        }`}
                                                    style={{ width: `${progressValue}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 min-w-[42px]">
                                                {progressValue}%
                                            </span>
                                        </div>
                                    </td>

                                    {/* Estado */}
                                    <td className="px-4 text-center">
                                        {getEstadoComponent(video.state)}
                                    </td>

                                    {/* Menú de opciones */}
                                    <td className="px-4 text-center">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => handleMenuClick(video.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                aria-label="Opciones"
                                            >
                                                <FaEllipsisV className="text-gray-600" />
                                            </button>

                                            {/* Dropdown menu */}
                                            {openMenuId === video.id && (
                                                <>
                                                    {/* Overlay para cerrar el menú */}
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setOpenMenuId(null)}
                                                    />

                                                    {/* Menú */}
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                                        <button
                                                            onClick={() => handleOptionClick(video.id, 'segmentacion')}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                            </svg>
                                                            Segmentación
                                                        </button>

                                                        <button
                                                            onClick={() => handleOptionClick(video.id, 'transcripcion')}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Transcripción
                                                        </button>

                                                        <button
                                                            onClick={() => handleOptionClick(video.id, 'doblaje')}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                            </svg>
                                                            Doblaje
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
=======
                        {recentVideos.map((video, index) => (
                            <tr key={video.id} className={`${index !== recentVideos.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <td className="py-6 w-40">
                                    <div className="flex items-center justify-center">
                                        {video.miniature ? (
                                            <img
                                                src={video.miniature}
                                                alt={video.title}
                                                className="w-32 h-20 object-cover rounded-lg"
                                                onError={(e) => {
                                                    // Si la imagen falla al cargar, mostrar el ícono
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`items-center justify-center w-32 h-20 bg-gray-100 rounded-lg ${video.miniature ? 'hidden' : 'flex'}`}
                                            style={video.miniature ? { display: 'none' } : { display: 'flex' }}
                                        >
                                            <FaPlay className="text-gray-400 text-xl" />
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 pl-4">
                                    <div>
                                        <div className="font-medium text-gray-900 mb-1 line-clamp-2">
                                            {video.title}
                                        </div>
                                        <div className="text-sm text-gray-500">{video.duration}</div>
                                    </div>
                                </td>
                                <td className="py-6 text-center">
                                    <span className="text-gray-700">{video.origin_video}</span>
                                </td>
                                <td className="py-6 text-center">
                                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(video.state)}`}>
                                        {getEstadoTexto(video.state)}
                                    </span>
                                </td>
                            </tr>
                        ))}
>>>>>>> 8e1041521493bdbe11ce0c098572ff23805f835a
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgregadosIngresadosTable;