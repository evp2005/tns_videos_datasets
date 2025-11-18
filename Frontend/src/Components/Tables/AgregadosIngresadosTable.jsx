import { FaPlay } from "react-icons/fa";

const AgregadosIngresadosTable = ({ videos = [] }) => {
    // Obtener los últimos 3 videos
    const recentVideos = videos.slice(-3).reverse();

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Completado":
            case "Completed":
                return "bg-green-100 text-green-700 border border-green-200";
            case "Procesando":
            case "Processing":
                return "bg-blue-100 text-blue-700 border border-blue-200";
            case "Pendiente":
            case "Pending":
                return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-200";
        }
    };

    const getEstadoTexto = (estado) => {
        const traducciones = {
            "Pending": "Pendiente",
            "Processing": "Procesando",
            "Completed": "Completado"
        };
        return traducciones[estado] || estado;
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
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Miniatura
                            </th>
                            <th className="pb-4 text-left text-sm font-medium text-gray-700 pl-4">
                                Título
                            </th>
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Fuente
                            </th>
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
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
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgregadosIngresadosTable;