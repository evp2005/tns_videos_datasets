// src/views/Lotes/Lotes.jsx
import { useState } from 'react';
import Panel from '../../../Components/Panel';
import { FaFileCsv, FaPlay, FaEllipsisV, FaChevronDown, FaPlus } from "react-icons/fa";
import { Table, Progress, Select } from 'antd';
import Completado from '../../../Components/Estados/Completado';
import Procesando from '../../../Components/Estados/Procesando';
import Pendiente from '../../../Components/Estados/Pendiente';
import { Play } from 'lucide-react';

const { Option } = Select;

function Lotes() {
    const [nombreLote, setNombreLote] = useState("El Curso de react completo");
    const [presetDoblaje, setPresetDoblaje] = useState("es-masculino");
    const [presetProcesamiento, setPresetProcesamiento] = useState("asr-nuevo");
    const [presetExportes, setPresetExportes] = useState("youtube");
    const [urls, setUrls] = useState("https://www.youtube.com/watch?v=G5qwN6k4Fy8\nhttps://www.youtube.com/watch?v=4Dz0SqxH86c\nhttps://www.youtube.com/watch?v=Fy8&start_radio=1");

    // Opciones de preset de doblaje
    const opcionesPreset = [
        { value: 'es-masculino', label: 'Español Voz Masculina' },
        { value: 'es-femenino', label: 'Español Voz Femenina' },
        { value: 'es-nino', label: 'Español Voz Niño' },
        { value: 'en-masculino', label: 'Inglés Voz Masculina' },
        { value: 'en-femenino', label: 'Inglés Voz Femenina' },
        { value: 'es-espana', label: 'Español España - Voz Neutral' },
        { value: 'es-latam', label: 'Español Latino - Voz Neutral' },
    ];

    // Opciones de preset de procesamiento
    const opcionesProcesamiento = [
        { value: 'asr-nuevo', label: 'ASR NUEVO' },
        { value: 'asr-mejorado', label: 'ASR MEJORADO' },
        { value: 'asr-rapido', label: 'ASR RÁPIDO' },
    ];

    // Opciones de preset de exportes
    const opcionesExportes = [
        { value: 'youtube', label: 'YouTube' },
        { value: 'vimeo', label: 'Vimeo' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
    ];

    // Datos de ejemplo para la tabla - ACTUALIZADOS según la imagen
    const datosLotes = [
        {
            key: '1',
            id: 'BATCH-001-1',
            video: {
                titulo: 'Curso React - Módulo 1',
                duracion: '45.00'
            },
            preset: 'ASR Nuevo + ES Voz',
            estado: 'Completado',
            progreso: 100,
            acciones: <Play className="text-gray-1000 w-5 h-5" />
        },
        {
            key: '2',
            id: 'BATCH-001-2',
            video: {
                titulo: 'Curso React - Módulo 2',
                duracion: '45.00'
            },
            preset: 'ASR Nuevo + ES Voz',
            estado: 'Procesando',
            progreso: 60,
            acciones: <Play className="text-gray-1000 w-5 h-5" />
        },
        {
            key: '3',
            id: 'BATCH-001-3',
            video: {
                titulo: 'Curso React - Módulo 3',
                duracion: '45.00'
            },
            preset: 'ASR Nuevo + ES Voz',
            estado: 'Pendiente',
            progreso: 0,
            acciones: <Play className="text-gray-1000 w-5 h-5" />
        }
    ];

    // Columnas para la tabla - ACTUALIZADAS según la imagen
    const columnas = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '15%',
            render: (id) => (
                <span className="text-sm font-bold text-gray-900">{id}</span>
            )
        },
        {
            title: 'Video',
            dataIndex: 'video',
            key: 'video',
            width: '25%',
            render: (video) => (
                <div>
                    <div className="text-sm font-bold text-gray-900">{video.titulo}</div>
                    <div className="text-xs text-gray-500">{video.duracion}</div>
                </div>
            )
        },
        {
            title: 'Preset Aplicado',
            dataIndex: 'preset',
            key: 'preset',
            width: '20%',
            render: (preset) => (
                <span className="text-sm text-gray-700">{preset}</span>
            )
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: '15%',
            render: (estado) => {
                switch (estado) {
                    case 'Completado':
                        return <span className="font-bold text-green-600">Completado</span>;
                    case 'Procesando':
                        return <span className="font-bold text-blue-600">Procesando</span>;
                    case 'Pendiente':
                        return <span className="text-gray-600">Pendiente</span>;
                    default:
                        return <span>{estado}</span>;
                }
            }
        },
        {
            title: 'Proceso',
            dataIndex: 'progreso',
            key: 'progreso',
            width: '15%',
            render: (progreso) => (
                <div className="flex items-center gap-2">
                    <Progress
                        percent={progreso}
                        size="small"
                        strokeColor={
                            progreso === 100 ? '#52c41a' :
                                progreso > 0 ? '#1890ff' : '#d9d9d9'
                        }
                        style={{ margin: 0, flex: 1 }}
                    />
                    <span className="text-xs text-gray-600 w-8">{progreso}%</span>
                </div>
            )
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            width: '10%',
            render: (acciones) => (
                <button className="p-1 hover:bg-gray-100 rounded flex items-center justify-center">
                    {acciones}
                </button>
            )
        }
    ];

    return (
        <section className='flex h-screen overflow-hidden'>
            <Panel />
            <main className='flex-1 ml-0 lg:ml-64 flex flex-col'>
                <div className='h-14 bg-white border-b border-gray-200'></div>

                <section className='flex-1 bg-[#FAFAF7] overflow-y-auto'>
                    <div className='flex justify-center p-8'>
                        <div className='w-full max-w-7xl'>
                            {/* Header */}
                            <div className='mb-8'>
                                <h1 className='font-bold text-3xl text-gray-900 mb-2'>
                                    Procesamiento por lotes
                                </h1>
                                <p className='text-gray-600'>
                                    Procesa múltiples vídeos con las mismas configuraciones
                                </p>
                            </div>

                            {/* Card Principal Unificado */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8'>
                                <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                                    Crear Lotes
                                </h2>
                                <p className='text-gray-600 mb-6'>
                                    Configura en un nuevo lote de procesamiento
                                </p>

                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                    {/* Columna Izquierda - Formulario Principal */}
                                    <div className='space-y-6'>
                                        {/* Nombre del lote */}
                                        <div>
                                            <label className='text-base block font-semibold text-gray-900 mb-2'>
                                                Nombre del lote
                                            </label>
                                            <input
                                                type="text"
                                                value={nombreLote}
                                                onChange={(e) => setNombreLote(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Ej: Curso de react completo"
                                            />
                                        </div>

                                        {/* Preset de doblaje */}
                                        <div>
                                            <label className='text-base block font-semibold text-gray-900 mb-2'>
                                                Preset de doblaje
                                            </label>
                                            <div className="relative">
                                                <Select
                                                    value={presetDoblaje}
                                                    onChange={setPresetDoblaje}
                                                    style={{ width: '100%' }}
                                                    size="large"
                                                    suffixIcon={<FaChevronDown className="text-gray-400" />}
                                                    className="custom-select-preset"
                                                    dropdownStyle={{
                                                        borderRadius: '12px',
                                                        padding: '8px 0'
                                                    }}
                                                >
                                                    {opcionesPreset.map(preset => (
                                                        <Option
                                                            key={preset.value}
                                                            value={preset.value}
                                                            className="px-4 py-2 hover:bg-gray-50 text-sm"
                                                        >
                                                            {preset.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>

                                        {/* URLs */}
                                        <div>
                                            <label className='block text-base font-semibold text-gray-900 mb-2'>
                                                URLs (una por línea o CSV)
                                            </label>
                                            <textarea
                                                value={urls}
                                                onChange={(e) => setUrls(e.target.value)}
                                                rows={6}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm text-[#535353]"
                                                placeholder="https://www.youtube.com/watch?v=5SqxM864Fy8&list=RD5SqxM864Fy8&start_radio=1"
                                            />
                                        </div>

                                        {/* Botones */}
                                        <div className='space-y-4'>
                                            <div className='flex gap-4 items-center'>
                                                <button className='flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm'>
                                                    <FaFileCsv className="text-sm" />
                                                    Importar CSV
                                                </button>
                                                <span className='text-gray-600 text-sm'>
                                                    o pega directamente la url
                                                </span>
                                            </div>

                                            {/* Botón Crear Lote */}
                                            <button className='flex items-center justify-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm'>
                                                <FaPlus className="text-sm" />
                                                Crear lotes
                                            </button>
                                        </div>
                                    </div>

                                    {/* Columna Derecha - Presets de Procesamiento */}
                                    <div className='space-y-6 pl-48'>
                                        {/* Preset de procesamiento */}
                                        <div>
                                            <h3 className='text-base font-semibold text-gray-900 mb-2'>
                                                Preset de procesamiento
                                            </h3>
                                            <p className='text-gray-600 mb-4 text-sm'>
                                                Configuración del procesamiento automático
                                            </p>

                                            <div className='space-y-6'>
                                                {/* ASR NUEVO */}
                                                <div>
                                                    <label className='text-base block font-semibold text-gray-900 mb-2'>
                                                        ASR NUEVO
                                                    </label>
                                                    <div className="relative w-1/3">
                                                        <Select
                                                            value={presetProcesamiento}
                                                            onChange={setPresetProcesamiento}
                                                            style={{ width: '100%' }}
                                                            size="large"
                                                            suffixIcon={<FaChevronDown className="text-gray-400" />}
                                                            className="custom-select-preset"
                                                            dropdownStyle={{
                                                                borderRadius: '12px',
                                                                padding: '8px 0'
                                                            }}
                                                        >
                                                            {opcionesProcesamiento.map(preset => (
                                                                <Option
                                                                    key={preset.value}
                                                                    value={preset.value}
                                                                    className="px-4 py-2 hover:bg-gray-50 text-sm"
                                                                >
                                                                    {preset.label}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Preset de Exportes */}
                                                <div>
                                                    <label className='text-base block font-semibold text-gray-900 mb-2'>
                                                        Preset de Exportes
                                                    </label>
                                                    <div className="relative w-1/3">
                                                        <Select
                                                            value={presetExportes}
                                                            onChange={setPresetExportes}
                                                            style={{ width: '100%' }}
                                                            size="large"
                                                            suffixIcon={<FaChevronDown className="text-gray-400" />}
                                                            className="custom-select-preset"
                                                            dropdownStyle={{
                                                                borderRadius: '12px',
                                                                padding: '8px 0'
                                                            }}
                                                        >
                                                            {opcionesExportes.map(preset => (
                                                                <Option
                                                                    key={preset.value}
                                                                    value={preset.value}
                                                                    className="px-4 py-2 hover:bg-gray-50 text-sm"
                                                                >
                                                                    {preset.label}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card de Trabajos de Lote Actual - CON MÁS ESPACIO */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-10 mb-8'>
                                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                                    Trabajos de Lote Actual
                                </h2>
                                <p className='text-gray-600 mb-8 font-semibold'>
                                    BATCH-001: Curso React Complete
                                </p>

                                {/* Tabla con más espacio */}
                                <Table
                                    columns={columnas}
                                    dataSource={datosLotes}
                                    pagination={false}
                                    className="segments-table"
                                    size="middle"
                                />
                            </div>

                            {/* Estadísticas - DIRECTAMENTE EN EL LAYOUT SIN CARD CONTENEDOR */}
                            <div className='grid grid-cols-4 gap-6 mb-8'>
                                {/* Total Videos */}
                                <div className='bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm'>
                                    <div className='text-3xl font-bold text-gray-900 mb-2'>3</div>
                                    <div className='text-gray-600'>Total Videos</div>
                                </div>

                                {/* Completados */}
                                <div className='bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm'>
                                    <div className='text-3xl font-bold text-green-600 mb-2'>1</div>
                                    <div className='text-gray-600'>Completados</div>
                                </div>

                                {/* En Proceso */}
                                <div className='bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm'>
                                    <div className='text-3xl font-bold text-blue-600 mb-2'>1</div>
                                    <div className='text-gray-600'>En Proceso</div>
                                </div>

                                {/* Pendientes */}
                                <div className='bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm'>
                                    <div className='text-3xl font-bold text-gray-600 mb-2'>1</div>
                                    <div className='text-gray-600'>Pendientes</div>
                                </div>
                            </div>

                            {/* Espacio vacío pequeño debajo */}
                            <div className='h-8'></div>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default Lotes;