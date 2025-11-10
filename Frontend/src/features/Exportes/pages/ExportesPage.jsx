import React from 'react'
import Panel from '../../../Components/Panel'
import { LuFileVideo } from "react-icons/lu";
import { IoCubeOutline } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoDownloadOutline } from "react-icons/io5";

function ExportesPage() {
    return (
        <section className='flex'>
            <Panel />
            <main className='flex-1 lg:ml-64'>
                <div className='h-14'></div>
                <section className='bg-[#FAFAF7] border-t-2 border-solid min-h-screen'>
                    <div className='mt-6 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-28 2xl:mx-32'>

                        {/* Título */}
                        <div className='flex flex-col gap-2 mb-6'>
                            <h2 className='font-bold text-2xl lg:text-4xl'>Exportes</h2>
                            <span className='text-[#535353] text-sm sm:text-base'>
                                Empaqueta y descarga tus videos procesados.
                            </span>
                        </div>

                        {/* Sección de exportadores */}
                        <section className='flex gap-9  2xl:gap-16 mb-6'>
                            {[
                                { icon: <LuFileVideo className='text-[#196DFF] text-4xl' />, title: "Youtube", desc: "MP4 optimizado con subtítulos embebidos" },
                                { icon: <IoCubeOutline className='text-[#196DFF] text-4xl' />, title: "Plataforma interna", desc: "Pistas separadas para máxima flexibilidad" },
                                { icon: <FaExternalLinkAlt className='text-[#196DFF] text-4xl' />, title: "Vimeo", desc: "Alta calidad de metadatos completos" },
                            ].map((item, i) => (
                                <div key={i} className='flex flex-col justify-center bg-white  2xl:w-96 h-56 rounded-xl border-2 gap-2 px-5 border-[#EEEFEF] shadow-sm'>
                                    {item.icon}
                                    <h3 className='font-semibold text-xl'>{item.title}</h3>
                                    <span className='text-[#535353] text-sm font-medium'>{item.desc}</span>
                                    <button className='bg-[#196DFF] rounded-md text-white py-1 mt-2 hover:bg-[#155BE3] transition'>
                                        Exportar
                                    </button>
                                </div>
                            ))}
                        </section>

                        {/* Exportación personalizada */}
                        <section className='bg-white p-6 rounded-xl border-2 border-[#EEEFEF] mb-8'>
                            <h3 className='font-semibold text-lg mb-1'>Exportación Personalizada</h3>
                            <span className='text-[#535353] text-sm'>Configura tus formatos y componentes a exportar</span>

                            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5'>
                                <div className='flex flex-col'>
                                    <label className='font-medium text-sm mb-1'>Formato de video</label>
                                    <select className=' bg-[#FAFAF7] border w-max border-[#EEEFEF] rounded-md p-2 focus:outline-[#196DFF]'>
                                        <option>MP4 (H.264)</option>
                                        <option>MKV (H.265)</option>
                                        <option>AVI</option>
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-medium text-sm mb-1'>Formato de audio</label>
                                    <select className='bg-[#FAFAF7] border w-max border-[#EEEFEF] rounded-md p-2 focus:outline-[#196DFF]'>
                                        <option>AAC</option>
                                        <option>MP3</option>
                                        <option>WAV</option>
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-medium text-sm mb-1'>Formato de subtítulos</label>
                                    <select className='bg-[#FAFAF7] border w-max border-[#EEEFEF] rounded-md p-2 focus:outline-[#196DFF]'>
                                        <option>SRT</option>
                                        <option>VTT</option>
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-medium text-sm mb-1'>Calidad</label>
                                    <select className='bg-[#FAFAF7] border w-max border-[#EEEFEF] rounded-md p-2 focus:outline-[#196DFF]'>
                                        <option>Alto (1440p)</option>
                                        <option>Medio (1080p)</option>
                                        <option>Bajo (720p)</option>
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-medium text-sm mb-1'>Tipo de paquete</label>
                                    <select className='bg-[#FAFAF7] border w-max border-[#EEEFEF] rounded-md p-2 focus:outline-[#196DFF]'>
                                        <option>Paquete Completo (ZIP)</option>
                                        <option>Medio (1080p)</option>
                                        <option>Bajo (720p)</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex flex-wrap gap-4 mt-6'>
                                <button className='bg-[#196DFF] text-white rounded-md px-4 py-2 hover:bg-[#155BE3] transition'>
                                    Generar paquete
                                </button>
                                <button className='border border-[#196DFF] text-[#196DFF] rounded-md px-4 py-2 hover:bg-[#E7F0FF] transition'>
                                    Descargar ZIP
                                </button>
                            </div>
                        </section>

                        {/* Historial de exportes */}
                        <section className='bg-white p-6 rounded-xl border-2 border-[#EEEFEF]'>
                            <h3 className='font-semibold text-lg mb-4'>Historial de Exportes</h3>
                            <table className='w-full text-sm border-collapse'>
                                <thead>
                                    <tr className='text-left border-b border-[#EEEFEF]'>
                                        <th className='py-2 px-2'>ID</th>
                                        <th className='py-2 px-2'>Nombre</th>
                                        <th className='py-2 px-2'>Formato</th>
                                        <th className='py-2 px-2'>Tamaño</th>
                                        <th className='py-2 px-2'>Fecha</th>
                                        <th className='py-2 px-2 text-center'>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'EXP-881', name: 'react-hooks-es.mp4', formato: 'MP4 + Audio ES', tam: '450 MB', fecha: '2025-03-01' },
                                        { id: 'EXP-882', name: 'typescript-paquete.zip', formato: 'ZIP Completo', tam: '680 MB', fecha: '2025-03-02' },
                                        { id: 'EXP-883', name: 'nextjs-subtitulos.srt', formato: 'SRT ES', tam: '45 MB', fecha: '2025-03-02' },
                                    ].map((item, i) => (
                                        <tr key={i} className='border-b border-[#EEEFEF] hover:bg-[#FAFAF7]'>
                                            <td className='py-2 px-2 font-medium'>{item.id}</td>
                                            <td className='py-2 px-2'>{item.name}</td>
                                            <td className='py-2 px-2'>{item.formato}</td>
                                            <td className='py-2 px-2'>{item.tam}</td>
                                            <td className='py-2 px-2'>{item.fecha}</td>
                                            <td className='py-2 px-2 text-center'>
                                                <button className='flex items-center gap-1 text-[#196DFF] font-medium hover:underline mx-auto'>
                                                    <IoDownloadOutline /> Descargar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </section>
            </main>
        </section>
    )
}

export default ExportesPage
