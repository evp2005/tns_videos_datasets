import { FaPlay } from "react-icons/fa";

const AgregadosIngresadosTable = () => {
    const videos = [
        {
            id: 1,
            titulo: "Curso de Python Básico",
            duracion: "1:15:00",
            fuente: "YouTube",
            progreso: 100,
            estado: "Completado"
        },
        {
            id: 2,
            titulo: "JavaScript ES2024",
            duracion: "2:00:00",
            fuente: "Escuela.it",
            progreso: 45,
            estado: "Procesando"
        },
        {
            id: 3,
            titulo: "React Hooks Avanzando",
            duracion: "0:45:00",
            fuente: "Udemy",
            progreso: 100,
            estado: "Completado"
        }
    ];

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Completado":
                return "bg-green-100 text-green-700 border border-green-200";
            case "Procesando":
                return "bg-blue-100 text-blue-700 border border-blue-200";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-200";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Agregados Ingresados</h3>
                <p className="text-gray-600">Selecciona qué hacer con cada video</p>
            </div>

            <div className="p-6">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Miniatura
                            </th>
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Título
                            </th>
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Fuente
                            </th>
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Progreso
                            </th>
                            <th className="pb-4 text-center text-sm font-medium text-gray-700">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map((video, index) => (
                            <tr key={video.id} className={`${index !== videos.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <td className="py-6 w-40">
                                    <div className="flex items-center justify-center w-32 h-20 bg-gray-100 rounded-lg">
                                        <FaPlay className="text-gray-400 text-xl" />
                                    </div>
                                </td>
                                <td className="py-6 pl-2">
                                    <div>
                                        <div className="font-medium text-gray-900 mb-1">{video.titulo}</div>
                                        <div className="text-sm text-gray-500">{video.duracion}</div>
                                    </div>
                                </td>
                                <td className="py-6 text-center">
                                    <span className="text-gray-700">{video.fuente}</span>
                                </td>
                                <td className="py-6 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="bg-gray-200 rounded-full h-2 w-24">
                                            <div
                                                className="h-2 bg-blue-600 rounded-full"
                                                style={{ width: `${video.progreso}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-medium text-gray-900">{video.progreso}%</span>
                                    </div>
                                </td>
                                <td className="py-6 text-center">
                                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(video.estado)}`}>
                                        {video.estado}
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