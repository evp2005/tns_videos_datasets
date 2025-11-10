import React, { useState } from 'react'
import Panel from '../../Components/Panel'
import Completado from '../../Components/Estados/Completado';
import { FaRegCheckCircle } from "react-icons/fa";
<FaRegCheckCircle className='text-5xl text-[#00CB07]' />
function Transcripcion() {
    const [texto, setTexto] = useState("Selecciona un formato para ver la transcripción.");

    const textos = {
        txt: `Bienvenidos a este curso de React Hooks.
El hook useState nos permite añadir estado a componentes funcionales.`,

        srt: `1
00:00:00,000 --> 00:00:04,000
Bienvenidos a este curso de React Hooks.

2
00:00:04,000 --> 00:00:07,000
Aprenderemos sobre useState y useEffect.`,

        markdown: `# Transcripción en Markdown

**Bienvenidos** a este curso de *React Hooks*.

- Aprenderás sobre \`useState\`
- Y también sobre \`useEffect\``
    };

    return (
        <section className='flex'>
            <Panel />
            <main className='flex-1 lg:ml-64'>
                <div className='h-14'></div>
                <section className='bg-[#FAFAF7]  border-t-2 border-solid'>
                    <div className='mt-6 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-28 2xl:mx-32'>
                        <div className='flex flex-col gap-5 mb-5'>
                            <h2 className='font-bold text-2xl sm:text-2xl lg:text-4xl'>Transcripción</h2>
                            <span className='max-w-lg text-sm sm:text-base'>
                                Extrae, limpia y alinea transcripciones de video
                            </span>
                        </div>


                        {/* VIDEO INFO */}
                        <section className='bg-white flex p-5 gap-24 border-2 border-[#EEEFEF] rounded-lg mb-6'>
                            <div>
                                <div className='mb-5'>
                                    <h4 className='font-medium'>Video a procesar</h4>
                                    <span className='text-[#535353] text-sm font-medium mb-5'>
                                        Material seleccionado desde ingesta
                                    </span>
                                </div>
                                <div className='w-56 h-36'>
                                    <img className='rounded-lg h-full bg-[#D9D9D9] w-full' src="" alt="" />
                                </div>
                            </div>

                            <div className='mt-16'>
                                <h4 className='font-bold mb-2'>Introducción a React Hook - Tutorial Completo</h4>
                                <div className='flex gap-10 mb-2'>
                                    <span>Youtube</span>
                                    <span>43.00</span>
                                    <span>ingresado: 2025-03-03 14.30</span>
                                </div>
                                <div className='flex gap-5'>
                                    <span>URL</span>
                                    <a className='text-[#196DFF]' href="">Youtube.com</a>
                                </div>
                                <div className='mt-5 flex gap-10'>
                                    <a className='bg-[#FAFAF7] flex items-center justify-center font-semibold h-8 w-36 rounded-md border-2 border-[#EEEFEF]' href="">
                                        Ver Original
                                    </a>
                                    <a className='bg-[#FAFAF7] flex items-center justify-center font-semibold h-8 w-44 rounded-md border-2 border-[#EEEFEF]' href="">
                                        Cambiar video
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* PIPELINE */}
                        <section className='bg-white border-2 border-[#EEEFEF] rounded-lg mb-5'>
                            <div className='p-5'>
                                <h4 className='font-semibold'>Pipeline de transcripción</h4>
                                <span className='text-[#AAC2CC] text-sm'>Proceso de extracción y limpieza</span>
                            </div>
                            <div className='px-8 2xl:px-28 flex gap-7 items-center'>
                                <div className='flex flex-col  items-center'>
                                    <FaRegCheckCircle className='text-5xl text-[#00CB07]' />
                                    <span className='font-bold'>Extracción</span>
                                </div>
                                <div className='border-b-4 border-[#3ECC72] w-64 2xl:w-96'>
                                </div>
                                <div className='flex flex-col  items-center'>
                                    <FaRegCheckCircle className='text-5xl text-[#00CB07]' />
                                    <span className='font-bold'>Limpieza</span>
                                </div>
                                <div className='border-b-4 border-[#3ECC72] w-64 2xl:w-96'>
                                </div>
                                <div className='flex flex-col  items-center'>
                                    <FaRegCheckCircle className='text-5xl text-[#00CB07]' />
                                    <span className='font-bold'>Alineacion</span>
                                </div>

                            </div>
                        </section>

                        {/* SALIDA ESPERADA */}
                        <section className='flex'>
                            <div className='p-5 bg-white w-[500px] 2xl:w-3/5 h-auto mb-10 border-2 border-[#EEEFEF] rounded-lg'>
                                <div>
                                    <h4 className='font-semibold'>Salida Esperada</h4>
                                    <span className='text-sm text-[#AAC2CC]'>
                                        Vista previa de los formatos de transcripción
                                    </span>
                                    <div className='flex mt-5 mb-5 bg-[#F5F5F2]  border border-[#E5E5E5] '>
                                        <button
                                            className={`flex-1 py-1  font-medium text-sm transition-colors duration-200
                                     ${texto === textos.txt
                                                    ? 'bg-white text-black border border-[#D1D1D1] rounded-md '
                                                    : 'text-[#3C3C3C] hover:bg-[#EDEDED]'}
    `}
                                            onClick={() => setTexto(textos.txt)}
                                        >
                                            TXT
                                        </button>

                                        <button
                                            className={`flex-1 py-1 font-medium text-sm transition-colors duration-200
                                        ${texto === textos.srt
                                                    ? 'bg-white text-black border border-[#D1D1D1] rounded-md shadow-sm'
                                                    : 'text-[#3C3C3C] hover:bg-[#EDEDED]'}
    `}
                                            onClick={() => setTexto(textos.srt)}
                                        >
                                            SRT/VTT
                                        </button>

                                        <button
                                            className={`flex-1 py-1 font-medium text-sm transition-colors duration-200
                                             ${texto === textos.markdown
                                                    ? 'bg-white text-black border border-[#D1D1D1] rounded-md shadow-sm'
                                                    : 'text-[#3C3C3C] hover:bg-[#EDEDED]'}
    `}
                                            onClick={() => setTexto(textos.markdown)}
                                        >
                                            Markdown
                                        </button>
                                    </div>


                                    <div className='p-3 rounded-lg border-2 border-[#EEEFEF] bg-[#FAFAF7] min-h-[200px]'>
                                        <pre className='whitespace-pre-wrap leading-relaxed text-sm font-medium text-[#333]'>
                                            {texto}
                                        </pre>
                                    </div>

                                    <div className='flex gap-5 mt-5'>
                                        <button
                                            className='bg-[#FAFAF7] rounded-lg border-2 w-28 h-8 border-[#EEEFEF] hover:bg-[#EDEDED] transition'
                                            onClick={() => {
                                                navigator.clipboard.writeText(texto);
                                                alert('Texto copiado al portapapeles ✅');

                                            }}
                                        >
                                            Copiar
                                        </button>

                                        <button className='bg-[#FAFAF7] rounded-lg border-2 w-28 h-8 border-[#EEEFEF]'>
                                            Descargar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-5'>
                                <div>
                                    <div className='bg-white border-2 ml-10 border-[#EEEFEF] w-[330px] 2xl:w-full gap-5 rounded-lg flex flex-col'>
                                        <div className='flex flex-col gap-3 p-5'>
                                            <h3 className='font-semibold text-lg'>Siguiente paso</h3>
                                            <span className='text-sm text-[#AAC2CC]'>
                                                Enviar material a otros módulos
                                            </span>
                                            <a href="" className='bg-[#224DB3] text-white flex justify-center items-center rounded-md h-8 text-sm py-1'>
                                                Enviar a traducción
                                            </a>
                                            <span className='text-sm text-[#AAC2CC]'>
                                                Enviar el video + transcripción para traducir y doblar
                                            </span>
                                        </div>
                                        <div className='flex flex-col gap-3 px-5 mb-5'>
                                            <a href="" className='border-[#EEEFEF] border-2 rounded-lg flex justify-center h-8 text-sm font-semibold py-1'>
                                                Enviar a segmentación
                                            </a>
                                            <span className='text-sm text-[#AAC2CC]'>
                                                Enviar el video + transcripción para dividir en clips temáticos
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* INFORMACIÓN */}
                                <div className="bg-white border-2 ml-10 border-[#EEEFEF] w-[330px] 2xl:w-full rounded-lg flex flex-col p-5 gap-3">
                                    <h4 className="font-bold">Información</h4>

                                    <div className="flex justify-between">
                                        <span className="text-[#AAC2CC]">Segmentos:</span>
                                        <span>5</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[#AAC2CC]">Duración:</span>
                                        <span>45.32</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[#AAC2CC]">Idioma:</span>
                                        <span>Inglés</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[#AAC2CC]">Estado:</span>
                                        <span>
                                            <Completado />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </section>
    )
}

export default Transcripcion
