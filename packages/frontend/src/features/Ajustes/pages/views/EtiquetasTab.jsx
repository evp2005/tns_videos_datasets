import { useState } from "react";
import { FaPlus } from "react-icons/fa";

function EtiquetasTab() {
    const [temas, setTemas] = useState(['React', 'TyScript', 'Next.js', 'CSS', 'Node.js']);
    const [niveles, setNiveles] = useState(['Principiante', 'Intermedio', 'Avanzado']);
    const [nuevoTema, setNuevoTema] = useState('');
    const [nuevoNivel, setNuevoNivel] = useState('');

    return (
        <div className='p-8'>
            <div className='mb-8'>
                <h2 className='text-lg font-bold text-gray-900 mb-1'>
                    Etiquetas y Taxonomía
                </h2>
                <p className='text-sm text-gray-500'>
                    Organiza el contenido por temas y niveles
                </p>
            </div>

            <div className='grid grid-cols-2 gap-8'>
                {/* Temas */}
                <div>
                    <h3 className='text-sm font-semibold text-gray-900 mb-4'>Temas</h3>
                    <div className='flex flex-wrap gap-2 mb-4'>
                        {temas.map((tema, index) => (
                            <span
                                key={index}
                                className='inline-flex items-center gap-1.5 px-2.5 py-1 text-gray-900 rounded-lg text-xs font-medium'
                                style={{ backgroundColor: '#D3DBF0' }}
                            >
                                {tema}
                                <button
                                    onClick={() => setTemas(temas.filter((_, i) => i !== index))}
                                    className='text-gray-700 hover:text-gray-900 text-base'
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='text'
                            value={nuevoTema}
                            onChange={(e) => setNuevoTema(e.target.value)}
                            className='flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Nueva etiqueta'
                        />
                        <button
                            onClick={() => {
                                if (nuevoTema.trim()) {
                                    setTemas([...temas, nuevoTema]);
                                    setNuevoTema('');
                                }
                            }}
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm'
                        >
                            <FaPlus className='text-xs' />
                        </button>
                    </div>
                </div>

                {/* Niveles */}
                <div>
                    <h3 className='text-sm font-semibold text-gray-900 mb-4'>Niveles</h3>
                    <div className='flex flex-wrap gap-2 mb-4'>
                        {niveles.map((nivel, index) => (
                            <span
                                key={index}
                                className='inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-sm'
                            >
                                {nivel}
                                <button
                                    onClick={() => setNiveles(niveles.filter((_, i) => i !== index))}
                                    className='text-gray-600 hover:text-gray-800'
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='text'
                            value={nuevoNivel}
                            onChange={(e) => setNuevoNivel(e.target.value)}
                            className='flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Nuevo nivel'
                        />
                        <button
                            onClick={() => {
                                if (nuevoNivel.trim()) {
                                    setNiveles([...niveles, nuevoNivel]);
                                    setNuevoNivel('');
                                }
                            }}
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm'
                        >
                            <FaPlus className='text-xs' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EtiquetasTab;
