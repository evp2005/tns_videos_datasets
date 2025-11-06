import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const Dropdown = ({ importancia, record, dropdownAbierto, setDropdownAbierto, handleImportanciaChange }) => {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const handleClick = (e) => {
        e.stopPropagation();
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                left: rect.left
            });
        }
        setDropdownAbierto(dropdownAbierto === record.key ? null : record.key);
    };

    return (
        <div className='flex justify-center'>
            <div 
                ref={buttonRef}
                className='flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-1 py-2 w-[100px] cursor-pointer hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md'
                onClick={handleClick}
            >
                <div className={`w-2.5 h-2.5 rounded-full ${
                    importancia === 'Alta' ? 'bg-green-500' : 
                    importancia === 'Media' ? 'bg-orange-400' : 'bg-gray-400'
                }`}></div>
                <span className='text-sm font-medium text-gray-800'>{importancia}</span>
                <svg className="w-3 h-3 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            
            {dropdownAbierto === record.key && createPortal(
                <div 
                    className='fixed w-[100px] bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]'
                    style={{ top: `${position.top}px`, left: `${position.left}px` }}
                >
                    {['Alta', 'Media', 'Baja'].map((opcion) => (
                        <div
                            key={opcion}
                            className='flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleImportanciaChange(record.key, opcion);
                                setDropdownAbierto(null);
                            }}
                        >
                            <div className={`w-2 h-2 rounded-full ${
                                opcion === 'Alta' ? 'bg-green-500' : 
                                opcion === 'Media' ? 'bg-orange-400' : 'bg-gray-400'
                            }`}></div>
                            <span className='text-sm font-medium text-gray-800'>{opcion}</span>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
};

export default Dropdown;
