import { useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import { Trash2 } from "lucide-react";

function GlosariosTab() {
    const [glosarioItems, setGlosarioItems] = useState([
        { id: 1, original: 'queue', traduccion: 'cola' },
        { id: 2, original: 'commit', traduccion: 'entrega' },
        { id: 3, original: 'hook', traduccion: 'gancho' }
    ]);

    const handleDeleteItem = (id) => {
        setGlosarioItems(glosarioItems.filter(item => item.id !== id));
    };

    const handleAddItem = () => {
        const newId = Math.max(...glosarioItems.map(item => item.id), 0) + 1;
        setGlosarioItems([...glosarioItems, { id: newId, original: '', traduccion: '' }]);
    };

    return (
        <div className='p-8'>
            <div className='mb-8'>
                <h2 className='text-lg font-bold text-gray-900 mb-1'>
                    Glosario por Curso
                </h2>
                <p className='text-sm text-gray-500'>
                    Define traducciones personalizadas para términos técnicos
                </p>
            </div>

            {/* Headers */}
            <div className='grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 mb-4'>
                <div className='col-span-5'>
                    <h3 className='text-sm font-semibold text-gray-900'>Término Original</h3>
                </div>
                <div className='col-span-5'>
                    <h3 className='text-sm font-semibold text-gray-900'>Traducción</h3>
                </div>
                <div className='col-span-2 text-center'>
                    <h3 className='text-sm font-semibold text-gray-900'>Acciones</h3>
                </div>
            </div>

            {/* Items */}
            <div className='mb-6'>
                {glosarioItems.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`grid grid-cols-12 gap-4 items-center py-4 ${
                            index !== glosarioItems.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                    >
                        <div className='col-span-5'>
                            <input
                                type='text'
                                value={item.original}
                                onChange={(e) => {
                                    const newItems = [...glosarioItems];
                                    const index = glosarioItems.findIndex(i => i.id === item.id);
                                    newItems[index].original = e.target.value;
                                    setGlosarioItems(newItems);
                                }}
                                className='w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                placeholder='queue'
                            />
                        </div>
                        <div className='col-span-5'>
                            <input
                                type='text'
                                value={item.traduccion}
                                onChange={(e) => {
                                    const newItems = [...glosarioItems];
                                    const index = glosarioItems.findIndex(i => i.id === item.id);
                                    newItems[index].traduccion = e.target.value;
                                    setGlosarioItems(newItems);
                                }}
                                className='w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                placeholder='cola'
                            />
                        </div>
                        <div className='col-span-2 flex justify-center'>
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className='p-2 text-gray-700 hover:text-red-600 transition-colors'
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botones */}
            <div className='flex gap-3'>
                <button
                    onClick={handleAddItem}
                    className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium text-sm'
                >
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

export default GlosariosTab;
