import { useState, useEffect } from "react";
import { FaPlay, FaEllipsisV } from "react-icons/fa";
import Completado from "../../Components/Estados/Completado";
import Error from "../../Components/Estados/Error";
import Pendiente from "../../Components/Estados/Pendiente";
import Procesando from "../../Components/Estados/Procesando";
import Revision from "../../Components/Estados/Revision";
import { Link } from 'react-router-dom';

const AgregadosIngresadosTable = ({ videos = [], newlyAddedId }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [animatedProgress, setAnimatedProgress] = useState({});
    const [animatedState, setAnimatedState] = useState({});

    const recentVideos = videos.slice(-3).reverse();

    const getEstadoComponent = (estado) => {
        switch (estado) {
            case "Completado":
            case "Completed":
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
            default:
                return <Pendiente />;
        }
    };

    const getProgressValue = (estado, progress) => {
        if (progress !== undefined && progress !== null) return progress;
        switch (estado) {
            case "Completado":
            case "Completed":
                return 100;
            case "Procesando":
            case "Processing":
                return 50;
            case "Pendiente":
            case "Pending":
                return 0;
            default:
                return 0;
        }
    };

    // Animar solo el video recién agregado pasando por todos los estados
    useEffect(() => {
        if (!newlyAddedId) return;

        const video = videos.find(v => v.id === newlyAddedId);
        if (!video || video.state === "Completado") return;

        const estados = ["Pendiente", "Procesando", "Revision", "Completado"];
        let progress = 0;

        const interval = setInterval(() => {
            progress += 5;
            if (progress > 100) progress = 100;

            const estadoIndex = Math.min(Math.floor((progress / 100) * (estados.length - 1)), estados.length - 1);
            setAnimatedState(prev => ({ ...prev, [newlyAddedId]: estados[estadoIndex] }));
            setAnimatedProgress(prev => ({ ...prev, [newlyAddedId]: progress }));

            if (progress === 100) {
                clearInterval(interval);
                setAnimatedState(prev => ({ ...prev, [newlyAddedId]: "Completado" }));
            }
        }, 300);
    }, [newlyAddedId, videos]);

    const handleMenuClick = (videoId) => setOpenMenuId(openMenuId === videoId ? null : videoId);
    const handleOptionClick = (videoId, option) => { console.log(`Video ${videoId}: ${option}`); setOpenMenuId(null); }

    if (!recentVideos.length) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Agregados Ingresados</h3>
                <p className="text-gray-600">Selecciona qué hacer con cada video</p>
            </div>
            <div className="p-12 text-center text-gray-500">No hay videos agregados todavía</div>
        </div>
    );

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
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">Miniatura</th>
                            <th className="pb-4 text-left text-sm font-bold text-gray-700 pl-4">Título</th>
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">Fuente</th>
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">Progreso</th>
                            <th className="pb-4 text-center text-sm font-bold text-gray-700">Estado</th>
                            <th className="pb-4 text-center text-sm font-bold text-gray-700 w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentVideos.map((video, index) => {
                            const isAnimating = animatedProgress[video.id] !== undefined;
                            const progressValue = isAnimating ? animatedProgress[video.id] : getProgressValue(video.state, video.progress);
                            const estadoActual = isAnimating ? animatedState[video.id] : video.state;

                            return (
                                <tr key={video.id} className={`transition-all hover:bg-gray-50 ${index !== recentVideos.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center justify-center">
                                            {video.miniature ? (
                                                <img
                                                    src={video.miniature}
                                                    alt={video.title}
                                                    className="w-32 h-20 object-cover rounded-lg shadow-sm"
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                                                />
                                            ) : null}
                                            <div className={`items-center justify-center w-32 h-20 bg-gray-200 rounded-lg ${video.miniature ? 'hidden' : 'flex'}`}>
                                                <FaPlay className="text-gray-400 text-xl" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">{video.title}</div>
                                            <div className="text-xs text-gray-500">{video.duration}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 text-sm text-gray-700 text-center"><span className="font-medium">{video.origin_video}</span></td>

                                    <td className="px-4">
                                        <div className="flex items-center gap-3 justify-center">
                                            <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-150 ease-out rounded-full ${progressValue === 100 ? 'bg-blue-500' : progressValue > 0 ? 'bg-blue-400' : 'bg-gray-300'}`}
                                                    style={{ width: `${progressValue}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 min-w-[42px]">{progressValue}%</span>
                                        </div>
                                    </td>

                                    <td className="px-4 text-center">{getEstadoComponent(estadoActual)}</td>

                                    <td className="px-4 text-center">
                                        <div className="relative inline-block">
                                            <button onClick={() => handleMenuClick(video.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <FaEllipsisV className="text-gray-600" />
                                            </button>

                                            {openMenuId === video.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                                        <button onClick={() => handleOptionClick(video.id, 'segmentacion')} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">Segmentación</button>
                                                        <Link to="/transcripcion" state={{ video }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">Transcripción</Link>
                                                        <button onClick={() => handleOptionClick(video.id, 'doblaje')} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">Doblaje</button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgregadosIngresadosTable;
