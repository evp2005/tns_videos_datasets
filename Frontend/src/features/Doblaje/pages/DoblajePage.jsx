// src/views/Doblaje/Doblaje.jsx
import { useState } from 'react';
import Panel from '../../../Components/Panel'
import { FaArrowLeft, FaYoutube, FaPlay, FaPause, FaDownload, FaVolumeUp, FaCheck } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { Select, Table, Progress, Slider, Checkbox } from 'antd';


function DoblajePage() {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [playbackTime, setPlaybackTime] = useState('00:00');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volumen, setVolumen] = useState(0);
    const [velocidad, setVelocidad] = useState(1.0);
    const [mantenerPistaOriginal, setMantenerPistaOriginal] = useState(false);
    const [idiomaOrigen, setIdiomaOrigen] = useState('en');

    // Datos para la tabla de traducción (según la imagen)
    const segmentosTraduccion = [
        {
            key: 1,
            inicio: "00:00:00",
            fin: "00:00:00",
            textoOrigen: "Welcome",
            textoTrad: "Bienvenidos"
        },
        {
            key: 2,
            inicio: "00:00:00",
            fin: "00:00:00",
            textoOrigen: "Welcome",
            textoTrad: "Bienvenidos"
        },
        {
            key: 3,
            inicio: "00:00:00",
            fin: "00:00:00",
            textoOrigen: "Welcome",
            textoTrad: "Bienvenidos"
        },
        {
            key: 4,
            inicio: "00:00:00",
            fin: "00:00:00",
            textoOrigen: "Welcome",
            textoTrad: "Bienvenidos"
        },
        {
            key: 5,
            inicio: "00:00:00",
            fin: "00:00:00",
            textoOrigen: "Welcome",
            textoTrad: "Bienvenidos"
        }
    ];

    // Columnas para la tabla de traducción (según la imagen)
    const columnsTraduccion = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: '10%',
            align: 'center',
            render: (text) => (
                <span className='text-sm text-gray-900 font-medium'>{text}</span>
            ),
        },
        {
            title: 'Inicio',
            dataIndex: 'inicio',
            key: 'inicio',
            width: '15%',
            align: 'center',
            render: (text) => (
                <span className='text-sm text-gray-700 font-mono font-medium'>{text}</span>
            ),
        },
        {
            title: 'Fin',
            dataIndex: 'fin',
            key: 'fin',
            width: '15%',
            align: 'center',
            render: (text) => (
                <span className='text-sm text-gray-700 font-mono font-medium'>{text}</span>
            ),
        },
        {
            title: 'Texto Origen',
            dataIndex: 'textoOrigen',
            key: 'textoOrigen',
            width: '30%',
            render: (text) => (
                <span className='text-sm text-gray-900 font-medium'>{text}</span>
            ),
        },
        {
            title: 'Texto traducido',
            dataIndex: 'textoTrad',
            key: 'textoTrad',
            width: '30%',
            render: (text) => (
                <span className='text-sm text-gray-900 font-medium'>{text}</span>
            ),
        },
    ];

    // Mantenemos las estadísticas originales para las otras secciones
    const segmentosDoblaje = [
        {
            key: 1,
            tema: "Introducción a React Hooks",
            inicio: "00:00",
            fin: "05:30",
            duracion: "5:30",
            estado: "Completado",
            progreso: 100,
            voz: "Voz Masculina ES",
            idioma: "Español"
        },
        {
            key: 2,
            tema: "¿Qué es useState?",
            inicio: "05:30",
            fin: "12:15",
            duracion: "6:45",
            estado: "Procesando",
            progreso: 75,
            voz: "Voz Femenina ES",
            idioma: "Español"
        },
        {
            key: 3,
            tema: "Ejemplos prácticos de useState",
            inicio: "12:15",
            fin: "18:45",
            duracion: "6:30",
            estado: "Pendiente",
            progreso: 0,
            voz: "-",
            idioma: "-"
        },
        {
            key: 4,
            tema: "Introducción a useEffect",
            inicio: "18:45",
            fin: "25:00",
            duracion: "6:15",
            estado: "Pendiente",
            progreso: 0,
            voz: "-",
            idioma: "-"
        }
    ];

    const estadisticas = {
        totalSegmentos: segmentosDoblaje.length,
        completados: segmentosDoblaje.filter(s => s.estado === "Completado").length,
        enProceso: segmentosDoblaje.filter(s => s.estado === "Procesando").length,
        pendientes: segmentosDoblaje.filter(s => s.estado === "Pendiente").length,
    };

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
                                    Traducción y Doblaje
                                </h1>
                                <p className='text-gray-600'>
                                    Flujo de doblaje simple mono-voz
                                </p>
                            </div>

                            {/* Material a Doblajar */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <h2 className='text-xl font-semibold text-gray-900 mb-2'>Material a Segmentar</h2>
                                        <p className='text-gray-600'>Video y Transcripción recibidos desde Transcripción</p>
                                    </div>
                                    <button className='flex items-center gap-3 px-5 py-1 border-2 border-[#EEEFEF] bg-[#FAFAF7] text-[#333333] hover:bg-[#f0f0f0] rounded-lg transition-colors text-sm font-medium'>
                                        <FaArrowLeft className='text-sm' />
                                        Volver a Transcripción
                                    </button>
                                </div>

                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
                                    {/* Video Original */}
                                    <div>
                                        <h3 className='font-semibold text-gray-900 mb-6'>Video Original</h3>
                                        <div className='bg-[#D9D9D9] rounded-lg h-44 mb-6 relative'>
                                            <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3'>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-sm'>{playbackTime}</span>
                                                    <button
                                                        className='text-white hover:text-gray-300 transition-colors'
                                                        onClick={() => setIsPlaying(!isPlaying)}
                                                    >
                                                        {isPlaying ? <FaPause /> : <FaPlay />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className='text-gray-900 font-medium mb-3'>Introducción a React Hooks - Tutorial Completo</p>
                                        <div className='flex items-center gap-3'>
                                            <div className='flex items-center gap-2'>
                                                <FaYoutube className='text-red-500 text-sm' />
                                                <span className='text-sm text-gray-600'>YouTube</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center'>
                                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                                </div>
                                                <span className='text-sm text-gray-600'>45:32</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transcripción Original */}
                                    <div>
                                        <h3 className='font-semibold text-gray-900 mb-6'>Transcripción Original</h3>
                                        <div className='border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50 h-44 flex flex-col justify-center'>
                                            <div className='space-y-4'>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600 font-medium'>Formato:</span>
                                                    <span className='text-gray-900 font-semibold'>SRT</span>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600 font-medium'>Idioma:</span>
                                                    <span className='text-gray-900 font-semibold'>Inglés</span>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600 font-medium'>Segmentos:</span>
                                                    <span className='text-gray-900 font-semibold'>156</span>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600 font-medium'>Generado:</span>
                                                    <span className='text-gray-900 font-semibold'>2025-03-03 15:45</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className='w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium'>
                                            Ver Transcripción completa
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* CONFIGURACIÓN DE DOBLAJE (PRIMERO) */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <LuSparkles className='text-blue-600 text-xl' />
                                    <h3 className='text-xl font-semibold text-gray-900'>Configuración</h3>
                                </div>
                                <p className='text-gray-600 mb-6'>Ajustes de idioma y voz</p>

                                {/* Fila de 4 columnas */}
                                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6'>
                                    {/* Columna 1: Idioma Origen y Volumen */}
                                    <div className='space-y-4'>
                                        <div>
                                            <label className='block text-sm font-semibold text-gray-900 mb-3'>
                                                Idioma Origen
                                            </label>
                                            <Select
                                                value={idiomaOrigen}
                                                onChange={setIdiomaOrigen}
                                                style={{ width: '100%' }}
                                                options={[
                                                    { value: 'en', label: 'Inglés' },
                                                    { value: 'es', label: 'Español' },
                                                    { value: 'fr', label: 'Francés' },
                                                    { value: 'de', label: 'Alemán' },
                                                    { value: 'it', label: 'Italiano' },
                                                    { value: 'pt', label: 'Portugués' },
                                                    { value: 'ja', label: 'Japonés' },
                                                    { value: 'ko', label: 'Coreano' },
                                                ]}
                                                size="large"
                                            />
                                        </div>

                                        {/* Volumen debajo de Idioma Origen */}
                                        <div>
                                            <label className='block text-sm font-semibold text-gray-900 mb-3'>
                                                Volumen: {volumen}dB
                                            </label>
                                            <div className='flex items-center gap-2'>
                                                <FaVolumeUp className='text-gray-500' />
                                                <Slider
                                                    value={volumen}
                                                    onChange={setVolumen}
                                                    min={-20}
                                                    max={20}
                                                    step={1}
                                                    className='flex-1'
                                                    tooltip={{ formatter: (value) => `${value}dB` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna 2: Idioma Destino */}
                                    <div>
                                        <label className='block text-sm font-semibold text-gray-900 mb-3'>
                                            Idioma Destino
                                        </label>
                                        <Select
                                            defaultValue="es"
                                            style={{ width: '100%' }}
                                            options={[
                                                { value: 'es', label: 'Español' },
                                                { value: 'en', label: 'Inglés' },
                                                { value: 'fr', label: 'Francés' },
                                                { value: 'de', label: 'Alemán' },
                                                { value: 'it', label: 'Italiano' },
                                                { value: 'pt', label: 'Portugués' },
                                                { value: 'ja', label: 'Japonés' },
                                                { value: 'ko', label: 'Coreano' },
                                            ]}
                                            size="large"
                                        />
                                        <div className='mt-3'>
                                            <Checkbox
                                                checked={mantenerPistaOriginal}
                                                onChange={(e) => setMantenerPistaOriginal(e.target.checked)}
                                            >
                                                Mantener pista original
                                            </Checkbox>
                                        </div>
                                    </div>

                                    {/* Columna 3: Voz */}
                                    <div>
                                        <label className='block text-sm font-semibold text-gray-900 mb-3'>
                                            Voz
                                        </label>
                                        <Select
                                            defaultValue="carlos"
                                            style={{ width: '100%' }}
                                            options={[
                                                { value: 'carlos', label: 'Masculina (Carlos)' },
                                                { value: 'ana', label: 'Femenina (Ana)' },
                                                { value: 'miguel', label: 'Masculina (Miguel)' },
                                                { value: 'laura', label: 'Femenina (Laura)' },
                                            ]}
                                            size="large"
                                        />
                                    </div>

                                    {/* Columna 4: Velocidad */}
                                    <div>
                                        <label className='block text-sm font-semibold text-gray-900 mb-3'>
                                            Velocidad: {velocidad}x
                                        </label>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray-500 text-sm'>0.5x</span>
                                            <Slider
                                                value={velocidad}
                                                onChange={setVelocidad}
                                                min={0.5}
                                                max={2.0}
                                                step={0.1}
                                                className='flex-1'
                                                tooltip={{ formatter: (value) => `${value}x` }}
                                            />
                                            <span className='text-gray-500 text-sm'>2.0x</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-8'>
                                    <button className='bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 font-medium text-base'>
                                        Aplicar Configuración
                                    </button>
                                </div>
                            </div>

                            {/* TRADUCCIÓN (SEGUNDO) */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <LuSparkles className='text-blue-600 text-xl' />
                                    <h3 className='text-xl font-semibold text-gray-900'>Traducción</h3>
                                </div>
                                <p className='text-gray-600 mb-6'>Gestión de glosario y frases traducidas</p>

                                {/* Glosario */}
                                <div className='mb-6'>
                                    <h4 className='font-semibold text-gray-900 mb-4'>Glosario(JSON)</h4>
                                    <div className='border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[100px]'>
                                        <p className='text-gray-500 text-sm'>El glosario se cargará aquí en formato JSON</p>
                                    </div>
                                </div>

                                {/* Botón Traducir con glosario */}
                                <div className='mb-6'>
                                    <button className='bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 font-medium text-sm'>
                                        Traducir con glosario
                                    </button>
                                </div>

                                {/* Tabla de Traducción */}
                                <div>
                                    <h4 className='font-semibold text-gray-900 mb-4'>Frases</h4>
                                    <Table
                                        columns={columnsTraduccion}
                                        dataSource={segmentosTraduccion}
                                        pagination={false}
                                        size="middle"
                                        className="translation-table"
                                        rowClassName="translation-row"
                                    />
                                </div>
                            </div>

                            {/* TTS Y MONTAJE - ANCHO COMPLETO */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8'>
                                {/* Título y descripción */}
                                <h2 className='text-xl font-semibold text-gray-900 mb-2'>TTS y Montaje</h2>
                                <p className='text-gray-600 mb-6'>Generación de voz y reproducción</p>

                                {/* Botón Generar Voz e Idioma en línea */}
                                <div className='flex items-center gap-6 mb-8'>
                                    <button className='bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 font-medium text-base'>
                                        Generar Voz
                                    </button>

                                    {/* Idioma con flecha hacia abajo a la derecha */}
                                    <div className='flex items-center gap-2 ml-auto bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors'>
                                        <span className='text-gray-900 font-medium'>Español (TTS)</span>

                                        <div className='w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-500'></div>
                                    </div>
                                </div>

                                {/* Reproductor */}
                                <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
                                    <h3 className='font-semibold text-gray-900 mb-4'>Reproductor</h3>

                                    {/* Barra de progreso */}
                                    <div className='w-full bg-gray-200 rounded-full h-2 mb-4'>
                                        <div className='bg-blue-600 h-2 rounded-full' style={{ width: '35%' }}></div>
                                    </div>

                                    {/* Tiempos y botón de play */}
                                    <div className='relative flex justify-between items-center mt-4'>
                                        <span className='text-lg font-mono font-bold text-gray-900'>00:05:30</span>

                                        {/* Botón de play gris en el centro */}
                                        <div className='absolute left-1/2 transform -translate-x-1/2'>
                                            <button className='w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors'>
                                                <FaPlay className='ml-1' />
                                            </button>
                                        </div>

                                        <span className='text-lg font-mono font-bold text-gray-900'>00:15:30</span>
                                    </div>
                                </div>
                            </div>

                            {/*ACCIONES Y PROGRESO DE DOBLAJE - REEMPLAZADO CON NUEVAS SECCIONES*/}
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                                {/* Audio Doblado */}
                                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Audio Doblado</h3>

                                    <div className='space-y-4'>
                                        <div className='text-gray-600'>
                                            Formato WAV/MP3
                                        </div>
                                        <button className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium'>
                                            Descargar Audio
                                        </button>
                                    </div>
                                </div>

                                {/* Subtítulos ES */}
                                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Subtítulos ES</h3>

                                    <div className='space-y-4'>
                                        <div className='text-gray-600'>
                                            Formato SRT/VTT
                                        </div>
                                        <button className='w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium'>
                                            Copiar Subtítulos
                                        </button>
                                    </div>
                                </div>

                                {/* Reporte de Calidad */}
                                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Reporte de Calidad</h3>

                                    <div className='space-y-4'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-600'>Dobloje</span>
                                            <span className='font-medium text-green-600'>2.3%</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-600'>Frases a Revisar</span>
                                            <span className='font-medium text-orange-600'>3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default DoblajePage;