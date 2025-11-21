import { Link } from "react-router-dom";
import Panel from '../../../Components/Panel'
import { TbArrowDownFromArc } from "react-icons/tb";
import { HiDocumentText } from "react-icons/hi2";
import { RiScissorsCutFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import Completado from '../../../Components/Estados/Completado';
import Procesando from '../../../Components/Estados/Procesando';
import Revision from '../../../Components/Estados/Revision';
import Pendiente from '../../../Components/Estados/Pendiente';
import Error from '../../../Components/Estados/Error';
import { useVideos } from '../hooks/useInicio'; // tu hook personalizado

function InicioPage() {
    const { videos, loading, error } = useVideos();

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

    return (
        <section className='flex'>
            <Panel />
            <main className='flex-1 lg:ml-64'>
                <div className='h-14'></div>
                <section className='h-max bg-[#FAFAF7] border-t-2 border-solid'>
                    <div className='mt-6 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-28 2xl:mx-32'>
                        {/* Accesos Rápidos */}
                        <div className='flex flex-col gap-5'>
                            <h2 className='font-bold text-2xl sm:text-3xl lg:text-4xl'>Dataset Transcripción</h2>
                            <span className='max-w-lg text-sm sm:text-base'>Sistema Completo para gestionar transcripción, segmentación y doblaje de contenido educativo.</span>
                            <Link to="/ingesta">
                                <button className='rounded-lg mt-3 flex items-center justify-center font-bold text-white bg-[#196DFF] gap-3 w-32 sm:w-40 h-10 text-sm sm:text-base'>
                                    Comenzar <FaArrowRight className='text-sm sm:text-lg' />
                                </button>
                            </Link>
                        </div>
                        <div className='my-8 lg:my-10'>
                            <h3 className='font-bold text-base sm:text-lg'>Accesos Rápidos</h3>
                        </div>
                        <section className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                            <Link to="/ingesta">
                                <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                    <TbArrowDownFromArc className='text-[#196DFF] text-2xl' />
                                    <h3 className='font-bold text-xl sm:text-2xl text-[#196DFF]'>Ingesta</h3>
                                    <span className='text-xs sm:text-sm text-[#989898] pr-4'>Agregar nuevos videos a procesar</span>
                                </article>
                            </Link>
                            <Link to="/transcripcion">
                                <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                    <HiDocumentText className='text-[#02B272] text-2xl' />
                                    <h3 className='font-bold text-xl sm:text-2xl text-[#02B272]'>Transcripción</h3>
                                    <span className='text-xs sm:text-sm text-[#989898] pr-4'>Extraer y limpiar transcripciones</span>
                                </article>
                            </Link>
                            <Link to="/segmentacion">
                                <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                    <RiScissorsCutFill className='text-[#C4B223] text-2xl' />
                                    <h3 className='font-bold text-xl sm:text-2xl text-[#C4B223]'>Segmentación</h3>
                                    <span className='text-xs sm:text-sm text-[#989898] pr-4'>Dividir videos en clips temáticos</span>
                                </article>
                            </Link>
                            <Link to="/doblaje">
                                <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                    <MdTranslate className='text-[#F07B78] text-2xl' />
                                    <h3 className='font-bold text-xl sm:text-2xl text-[#F07B78]'>Doblaje</h3>
                                    <span className='text-xs sm:text-sm text-[#989898] pr-4'>Traducir y generar doblaje</span>
                                </article>
                            </Link>
                        </section>

                        {/* Tabla dinámica */}
                        <div className='my-8 lg:my-10'>
                            <h3 className='font-bold text-base sm:text-lg'>Últimos Trabajos</h3>
                        </div>
                        <div className="border border-[#EEEFEF] bg-white rounded-xl shadow-sm mb-20">
                            {loading && <p className="p-6 text-gray-500">Cargando videos...</p>}
                            {error && <p className="p-6 text-red-500">{error}</p>}
                            {!loading && !error && (
                                <table className="text-[#989898] my-10 w-full text-sm text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-700">
                                        <tr className='bg-[#EEEFEF]'>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">TÍTULO</th>
                                            <th className="px-4 py-3">FUENTE</th>
                                            <th className="px-4 py-3">ESTADO</th>
                                            <th className="px-4 py-3">PROGRESO</th>
                                            <th className="px-4 py-3">DURACIÓN</th>
                                            <th className="px-4 py-3">FECHA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {videos.map((video, idx) => (
                                            <tr key={video.id || idx} className="border-t">
                                                <td className="px-4 py-4">{video.id || `VID-${idx + 1}`}</td>
                                                <td className="px-4 py-4">{video.title}</td>
                                                <td className="px-4 py-4">{video.origin_video}</td>
                                                <td className="px-4 py-4">{getEstadoComponent(video.state)}</td>
                                                <td className="px-4 py-4">
                                                    <div className="w-28 bg-gray-200 rounded-full h-2">
                                                        <div className={`h-2 rounded-full ${getProgressValue(video.state, video.progress) === 100 ? 'bg-blue-500' : 'bg-blue-400'}`} style={{ width: `${getProgressValue(video.state, video.progress)}%` }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">{video.duration || "00:00:00"}</td>
                                                <td className="px-4 py-4">{video.uploaded_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                    </div>
                </section>
            </main >
        </section >
    );
}

export default InicioPage;
