import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";

function UsuariosTab() {
    const [usuarios, setUsuarios] = useState([
        { id: 1, usuario: 'Admin', email: 'admin@dataset.com', rol: 'Administrador', estado: 'Activo' },
        { id: 2, usuario: 'Editor', email: 'editor@dataset.com', rol: 'Editor', estado: 'Activo' }
    ]);

    const handleDeleteUsuario = (id) => {
        setUsuarios(usuarios.filter(user => user.id !== id));
    };

    return (
        <div className='p-8'>
            <div className='mb-8'>
                <h2 className='text-lg font-bold text-gray-900 mb-1'>
                    Usuarios y Permisos
                </h2>
                <p className='text-sm text-gray-500'>
                    Gestiona el acceso al Sistema
                </p>
            </div>

            {/* Headers */}
            <div className='grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 mb-4'>
                <div className='col-span-2'>
                    <h3 className='text-sm font-semibold text-gray-900'>Usuario</h3>
                </div>
                <div className='col-span-3'>
                    <h3 className='text-sm font-semibold text-gray-900'>Email</h3>
                </div>
                <div className='col-span-3'>
                    <h3 className='text-sm font-semibold text-gray-900'>Rol</h3>
                </div>
                <div className='col-span-2'>
                    <h3 className='text-sm font-semibold text-gray-900'>Estado</h3>
                </div>
                <div className='col-span-2 text-center'>
                    <h3 className='text-sm font-semibold text-gray-900'>Acciones</h3>
                </div>
            </div>

            {/* Items */}
            <div className='mb-6'>
                {usuarios.map((usuario, index) => (
                    <div 
                        key={usuario.id} 
                        className={`grid grid-cols-12 gap-4 items-center py-4 ${
                            index !== usuarios.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                    >
                        <div className='col-span-2'>
                            <span className='text-sm text-gray-700'>{usuario.usuario}</span>
                        </div>
                        <div className='col-span-3'>
                            <span className='text-sm text-gray-700'>{usuario.email}</span>
                        </div>
                        <div className='col-span-3'>
                            <select className='px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                                <option value='Administrador'>Administrador</option>
                                <option value='Editor'>Editor</option>
                                <option value='Viewer'>Viewer</option>
                            </select>
                        </div>
                        <div className='col-span-2'>
                            <span className='inline-flex px-6 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium'>
                                {usuario.estado}
                            </span>
                        </div>
                        <div className='col-span-2 flex justify-center'>
                            <button
                                onClick={() => handleDeleteUsuario(usuario.id)}
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
                <button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium text-sm'>
                    <FaPlus className='text-xs' />
                    Invitar Usuario
                </button>
            </div>
        </div>
    );
}

export default UsuariosTab;
