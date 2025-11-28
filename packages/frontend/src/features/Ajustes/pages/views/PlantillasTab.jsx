import { useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";

function PlantillasTab() {
    const [plantilla, setPlantilla] = useState({
        nombre: '',
        estructura: ''
    });

    return (
        <div className='p-8'>
            <div className='mb-8'>
                <h2 className='text-lg font-bold text-gray-900 mb-1'>
                    Plantillas de Índice MD
                </h2>
                <p className='text-sm text-gray-500'>
                    Define la estructura de los índices temáticos en Markdown
                </p>
            </div>

            {/* Nombre de Plantilla */}
            <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                    Nombre de Plantilla
                </label>
                <input
                    type='text'
                    value={plantilla.nombre}
                    onChange={(e) => setPlantilla({ ...plantilla, nombre: e.target.value })}
                    className='w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Ej: Plantilla Curso Técnico'
                />
            </div>

            {/* Estructura */}
            <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-900 mb-3'>
                    Estructura
                </label>
                <textarea
                    value={plantilla.estructura}
                    onChange={(e) => setPlantilla({ ...plantilla, estructura: e.target.value })}
                    className='w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='# { titulo } ##Índice { timestamps } ## Descripción { descripcion }'
                    rows={6}
                />
            </div>

            {/* Botones */}
            <div className='flex gap-3'>
                <button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium text-sm'>
                    <FaPlus className='text-xs' />
                    Agregar término
                </button>
                <button className='flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm'>
                    <FaSave className='text-sm' />
                    Guardar Glosario
                </button>
            </div>
        </div>
    );
}

export default PlantillasTab;
