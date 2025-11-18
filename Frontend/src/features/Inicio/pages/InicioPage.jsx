import { Link } from "react-router-dom";
import Panel from '../../../Components/Panel'
import { FaArrowRight } from "react-icons/fa6";
import Completado from '../../../Components/Estados/Completado';
import Procesando from '../../../Components/Estados/Procesando';
import Revision from '../../../Components/Estados/Revision';
import Pendiente from '../../../Components/Estados/Pendiente';
import ErrorEstado from '../../../Components/Estados/Error';
import { useVideos } from '../../../features/Ingesta/hooks/useVideos'; // 🔹 Importa tu hook

function InicioPage() {
    const { videos } = useVideos(); // 🔹 Traer los últimos 3 videos

    // 🔹 Función para mapear estado a componente
    const renderEstado = (estado) => {
        switch (estado) {
            case "Completed":
            case "Completado":
                return <Completado />;
            case "Processing":
            case "Procesando":
                return <Procesando />;
            case "Revision":
                return <Revision />;
            case "Pending":
            case "Pendiente":
                return <Pendiente />;
            case "Error":
                return <ErrorEstado />;
            default:
                return <Pendiente />;
        }
    };

    // 🔹 Función para barra de progreso según estado
    const getProgressWidth = (estado) => {
        switch (estado) {
            case "Completed":
            case "Completado":
                return "w-full";
            case "Processing":
            case "Procesando":
                return "w-3/4";
            case "Revision":
                return "w-2/3";
            case "Pending":
            case "Pendiente":
                return "w-1/4";
            case "Error":
                return "w-1/2";
            default:
                return "w-0";
        }
    };

    return (
        <section className='flex'>
            <Panel />
            <main className='flex-1 lg:ml-64'>
                <div className='h-14'></div>
                <section className='h-max bg-[#FAFAF7] border-t-2 border-solid'>
                    <div className='mt-6 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-28 2xl:mx-32'>
                        <h3 className='font-bold text-base sm:text-lg mb-4'>Últimos Trabajos</h3>

                        <div className="border border-[#EEEFEF] bg-white rounded-xl shadow-sm mb-20">
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
                                    {videos.map((video, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-4">{video.id}</td>
                                            <td className="px-4 py-4">{video.title}</td>
                                            <td className="px-4 py-4">{video.origin_video}</td>
                                            <td className="px-4 py-4">{renderEstado(video.state)}</td>
                                            <td className="px-4 py-4">
                                                <div className="w-28 bg-gray-200 rounded-full h-2">
                                                    <div className={`bg-blue-500 h-2 rounded-full ${getProgressWidth(video.state)}`}></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">{video.duration || "00:00:00"}</td>
                                            <td className="px-4 py-4">{video.created_at || new Date().toISOString().split('T')[0]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    )
}

export default InicioPage;
