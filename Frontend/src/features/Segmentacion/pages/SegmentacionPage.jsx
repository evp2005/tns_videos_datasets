import { useState, useEffect } from 'react';
import Panel from '../../../Components/Panel';
import Dropdown from '../../../Components/Dropdown/Dropdown';
import { FaArrowLeft, FaYoutube } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { Select, Table } from 'antd';



function SegmentacionPage() {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [numeroSegmentos, setNumeroSegmentos] = useState('8');
    const [dropdownAbierto, setDropdownAbierto] = useState(null);

    // Datos base de segmentos
    const todosLosSegmentos = [
        { key: 1, tema: "Introducción a React Hooks", inicio: "00:00", fin: "05:30", importancia: "Alta" },
        { key: 2, tema: "¿Qué es useState?", inicio: "05:30", fin: "12:15", importancia: "Alta" },
        { key: 3, tema: "Ejemplos prácticos de useState", inicio: "12:15", fin: "18:45", importancia: "Alta" },
        { key: 4, tema: "Introducción a useEffect", inicio: "18:45", fin: "25:00", importancia: "Alta" },
        { key: 5, tema: "Ciclo de vida con useEffect", inicio: "25:00", fin: "32:00", importancia: "Alta" },
        { key: 6, tema: "Hooks personalizados", inicio: "32:00", fin: "38:00", importancia: "Media" },
        { key: 7, tema: "Mejores prácticas", inicio: "38:00", fin: "42:00", importancia: "Media" },
        { key: 8, tema: "Conclusión y recursos", inicio: "42:00", fin: "45:00", importancia: "Baja" },
    ];

    // Estado para manejar cambios en importancia
    const [segmentos, setSegmentos] = useState(todosLosSegmentos);

    // Segmentos filtrados según número seleccionado
    const segmentosMostrados = segmentos.slice(0, parseInt(numeroSegmentos));

    // Función para cambiar número de segmentos
    const handleNumeroSegmentosChange = (value) => {
        setNumeroSegmentos(value);
        const maxKey = parseInt(value);
        setSelectedRowKeys(prev => prev.filter(key => key <= maxKey));
    };

    // Función para cambiar importancia
    const handleImportanciaChange = (key, nuevaImportancia) => {
        setSegmentos(prevSegmentos =>
            prevSegmentos.map(segmento =>
                segmento.key === key
                    ? { ...segmento, importancia: nuevaImportancia }
                    : segmento
            )
        );
    };

    // Cerrar dropdown al hacer clic fuera o al hacer scroll
    useEffect(() => {
        const handleClickOutside = () => {
            setDropdownAbierto(null);
        };

        const handleScroll = () => {
            setDropdownAbierto(null);
        };

        if (dropdownAbierto) {
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [dropdownAbierto]);

    // Configuración de las columnas de la tabla
    const columns = [
        {
            title: 'Tema',
            dataIndex: 'tema',
            key: 'tema',
            width: '45%',
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
            title: 'Importancia',
            dataIndex: 'importancia',
            key: 'importancia',
            width: '20%',
            align: 'center',
            render: (importancia, record) => (
                <Dropdown
                    importancia={importancia}
                    record={record}
                    dropdownAbierto={dropdownAbierto}
                    setDropdownAbierto={setDropdownAbierto}
                    handleImportanciaChange={handleImportanciaChange}
                />
            ),
        },
    ];

    // Configuración de selección de filas
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            name: record.tema,
        }),
    };

    const estadisticas = {
        segmentosTotales: segmentosMostrados.length,
        seleccionados: selectedRowKeys.length,
        altaImportancia: selectedRowKeys.filter(key => {
            const segmento = segmentosMostrados.find(s => s.key === key);
            return segmento?.importancia === 'Alta';
        }).length,
        mediaImportancia: selectedRowKeys.filter(key => {
            const segmento = segmentosMostrados.find(s => s.key === key);
            return segmento?.importancia === 'Media';
        }).length,
        duracionEstimada: "~52 min"
    };

    return (
        <section className='flex h-screen overflow-hidden'>
            <Panel />
            <main className='flex-1 ml-0 lg:ml-64 flex flex-col'>
                <div className='h-14 bg-white border-b-2 border-gray-200'></div>

                <section className='flex-1 bg-[#FAFAF7] overflow-y-auto'>
                    <div className='flex justify-center p-8'>
                        <div className='w-full max-w-7xl'>
                            {/* Header */}
                            <div className='mb-8'>
                                <h1 className='font-bold text-3xl text-gray-900 mb-2'>
                                    Dataset Transcripción
                                </h1>
                                <p className='text-gray-600'>
                                    Divide videos largos en clips temáticos basados en el índice del contenido
                                </p>
                            </div>

                            {/* Material a Segmentar */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <h2 className='text-xl font-semibold text-gray-900 mb-2'>Material a Segmentar</h2>
                                        <p className='text-gray-600'>Video y transcripción recibidos desde Transcripción</p>
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
                                        <div className='bg-[#D9D9D9] rounded-lg h-44 mb-6'></div>
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
                                                    <span className='text-gray-900 font-semibold'>Español</span>
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
                                        <button className='w-full py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium'>
                                            Ver Transcripción completa
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                                {/* Índice Temático */}
                                <div className='lg:col-span-2'>
                                    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
                                        <div className='flex items-center gap-2 mb-6'>
                                            <LuSparkles className='text-blue-600 text-xl' />
                                            <h3 className='text-xl font-semibold text-gray-900'>Índice Temático (IA)</h3>
                                        </div>
                                        <p className='text-gray-600 mb-6'>Segmentos sugeridos basados en el análisis del contenido transcrito</p>

                                        <div className='flex items-center gap-4 mb-6'>
                                            <span className='text-sm font-medium text-gray-900'>Número de segmentos:</span>
                                            <Select
                                                value={numeroSegmentos}
                                                onChange={handleNumeroSegmentosChange}
                                                style={{ width: 140 }}
                                                options={[
                                                    { value: '4', label: '4 Segmentos' },
                                                    { value: '6', label: '6 Segmentos' },
                                                    { value: '8', label: '8 Segmentos' }
                                                ]}
                                            />
                                            <span className='text-sm text-gray-500'>({selectedRowKeys.length} Seleccionados)</span>
                                        </div>

                                        {/* Tabla de Segmentos */}
                                        <Table
                                            rowSelection={{
                                                type: 'checkbox',
                                                ...rowSelection,
                                            }}
                                            columns={columns}
                                            dataSource={segmentosMostrados}
                                            pagination={false}
                                            size="middle"
                                            className="segments-table"
                                            rowClassName="segment-row"
                                        />

                                        {/* Sugerencia */}
                                        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                                            <p className='text-sm text-blue-800'>
                                                <span className='font-semibold'>Sugerencia:</span> Los segmentos marcados como "Alta importancia" son esenciales para entender el contenido. Los de "Baja importancia" pueden omitirse para crear versiones más cortas.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Panel de Acciones y Estadísticas */}
                                <div className='space-y-6'>
                                    {/* Acciones */}
                                    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Acciones</h3>
                                        <p className='text-sm text-gray-600 mb-6'>Generar segmentos</p>

                                        <div className='space-y-3'>
                                            <button className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium'>
                                                Generar Clips
                                            </button>
                                            <button className='w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50'>
                                                Restablecer Seleccionados
                                            </button>
                                            <button className='w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50'>
                                                Regenerar Índice con IA
                                            </button>
                                        </div>
                                    </div>

                                    {/* Estadísticas */}
                                    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Estadísticas</h3>

                                        <div className='space-y-4 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Segmentos totales:</span>
                                                <span className='font-medium'>{estadisticas.segmentosTotales}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Seleccionados:</span>
                                                <span className='font-medium'>{estadisticas.seleccionados}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Alta importancia:</span>
                                                <span className='font-medium text-green-600'>{estadisticas.altaImportancia}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Media importancia:</span>
                                                <span className='font-medium text-orange-600'>{estadisticas.mediaImportancia}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Duración estimada:</span>
                                                <span className='font-medium'>{estadisticas.duracionEstimada}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Visual - Mismo ancho que Índice Temático */}
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8'>
                                <div className='lg:col-span-2'>
                                    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
                                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>Timeline Visual</h3>
                                        <p className='text-gray-600 mb-6'>Visualización de los segmentos seleccionados</p>

                                        <div className='mb-6'>
                                            <div className='flex justify-between text-sm text-gray-600 mb-4'>
                                                <span>00:00</span>
                                                <span>22:46</span>
                                                <span>45:32</span>
                                            </div>

                                            <div className='flex gap-1 mb-6'>
                                                {segmentosMostrados.map((segmento, index) => {
                                                    const isSelected = selectedRowKeys.includes(segmento.key);
                                                    const colorClass = isSelected
                                                        ? segmento.importancia === 'Alta' ? 'bg-green-500'
                                                            : segmento.importancia === 'Media' ? 'bg-orange-400'
                                                                : 'bg-gray-400'
                                                        : 'bg-gray-200';

                                                    return (
                                                        <div
                                                            key={segmento.key}
                                                            className={`flex-1 h-12 ${colorClass} flex items-center justify-center text-white font-medium text-sm first:rounded-l-lg last:rounded-r-lg`}
                                                        >
                                                            {isSelected ? index + 1 : ''}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className='flex gap-6 text-sm'>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-3 h-3 bg-green-500 rounded-sm'></div>
                                                <span>Alta importancia</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-3 h-3 bg-orange-400 rounded-sm'></div>
                                                <span>Media importancia</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-3 h-3 bg-gray-400 rounded-sm'></div>
                                                <span>Baja importancia</span>
                                            </div>
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

export default SegmentacionPage;