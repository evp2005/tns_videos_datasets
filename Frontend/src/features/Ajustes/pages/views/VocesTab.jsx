import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";

function VocesTab() {
    const [voces, setVoces] = useState([
        { id: 1, nombre: 'Carlos', tipo: 'Masculina', idioma: 'ES', porDefecto: true },
        { id: 2, nombre: 'Maria', tipo: 'Femenina', idioma: 'ES', porDefecto: false },
        { id: 3, nombre: 'Alex', tipo: 'Neutra', idioma: 'ES', porDefecto: false }
    ]);

    const handleDeleteVoz = (id) => {
        setVoces(voces.filter(voz => voz.id !== id));
    };

    const handleAddVoz = () => {
        const newId = Math.max(...voces.map(voz => voz.id), 0) + 1;
        setVoces([...voces, { id: newId, nombre: '', tipo: 'Masculina', idioma: 'ES', porDefecto: false }]);
    };

    return (
        <div className='p-8'>
            <div className='mb-8'>
                <h2 className='text-lg font-bold text-gray-900 mb-1'>
                    Perfiles de Voz
                </h2>
                <p className='text-sm text-gray-500'>
                    Gestiona las voces disponibles para TTS
                </p>
            </div>

            {/* Headers */}
            <div className='grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 mb-4'>
                <div className='col-span-3'>
                    <h3 className='text-sm font-semibold text-gray-900'>Nombre</h3>
                </div>
                <div className='col-span-3'>
                    <h3 className='text-sm font-semibold text-gray-900'>Tipo</h3>
                </div>
                <div className='col-span-2'>
                    <h3 className='text-sm font-semibold text-gray-900'>Idioma</h3>
                </div>
                <div className='col-span-2'>
                    <h3 className='text-sm font-semibold text-gray-900'>Por Defecto</h3>
                </div>
                <div className='col-span-2 text-center'>
                    <h3 className='text-sm font-semibold text-gray-900'>Acciones</h3>
                </div>
            </div>

            {/* Items */}
            <div className='mb-6'>
                {voces.map((voz, index) => (
                    <div 
                        key={voz.id} 
                        className={`grid grid-cols-12 gap-4 items-center py-4 ${
                            index !== voces.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                    >
                        <div className='col-span-3'>
                            <span className='text-sm text-gray-700'>{voz.nombre}</span>
                        </div>
                        <div className='col-span-3'>
                            <span className='text-sm text-gray-700'>{voz.tipo}</span>
                        </div>
                        <div className='col-span-2'>
                            <span className='text-sm text-gray-700'>{voz.idioma}</span>
                        </div>
                        <div className='col-span-2'>
                            {voz.porDefecto && (
                                <span className='text-green-600 text-lg'>✓</span>
                            )}
                        </div>
                        <div className='col-span-2 flex justify-center'>
                            <button
                                onClick={() => handleDeleteVoz(voz.id)}
                                className='p-2 text-gray-700 hover:text-red-600 transition-colors'
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botón */}
            <div>
                <button
                    onClick={handleAddVoz}
                    className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium text-sm'
                >
                    <FaPlus className='text-xs' />
                    Agregar Voz
                </button>
            </div>
        </div>
    );
}

export default VocesTab;
