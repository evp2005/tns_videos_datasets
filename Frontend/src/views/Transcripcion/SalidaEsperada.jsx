import React, { useState } from 'react'
import { useTranscripciones } from '../Hooks/useTranscripciones'

function SalidaEsperada() {
    const [formato, setFormato] = useState('TXT')
    const { textos, loading } = useTranscripciones()

    if (loading) return <p className="p-4">Cargando...</p>

    return (
        <div className='p-5 bg-white w-[500px] 2xl:w-3/5 h-auto mb-10 border-2 border-[#EEEFEF] rounded-lg'>
            <div>
                <h4 className='font-semibold'>Salida Esperada</h4>
                <span className='text-sm text-[#AAC2CC]'>Vista previa de los formatos de transcripción</span>

                <div className='flex mt-5 mb-5'>
                    {['TXT', 'SRT/VTT', 'MARKDOWN'].map((tipo) => (
                        <button
                            key={tipo}
                            onClick={() => setFormato(tipo)}
                            className={`bg-[#FAFAF7] flex items-center justify-center font-medium h-7 w-52 rounded-md border-2 border-[#EEEFEF]
                ${formato === tipo ? 'bg-[#224DB3] text-white' : 'hover:bg-gray-100'}`}
                        >
                            {tipo}
                        </button>
                    ))}
                </div>

                <div className='p-2 rounded-lg border-2 border-[#EEEFEF] whitespace-pre-line'>
                    <span className='leading-[40px]'>{textos[formato] || "No hay texto disponible"}</span>
                </div>

                <div className='flex gap-5 mt-5'>
                    <button className='bg-[#FAFAF7] rounded-lg border-2 w-28 h-8 border-[#EEEFEF]'>
                        Copiar
                    </button>
                    <button className='bg-[#FAFAF7] rounded-lg border-2 w-28 h-8 border-[#EEEFEF]'>
                        Descargar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SalidaEsperada
