import React from 'react'
import Panel from '../../Components/Panel'
import { TbArrowDownFromArc } from "react-icons/tb";
import { HiDocumentText } from "react-icons/hi2";
import { RiScissorsCutFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";

function Inicio() {
    return (
        <section className='grid grid-cols-[1fr_5fr]'>
            <article>
                <Panel />
            </article>
            <article className='w-full min-h-screen '>
                <div className='h-14'>

                </div>
                <section className='h-full bg-[#FAFAF7] border-t-2 border-solid '>
                    <div className='mt-6 h-screen mx-28'>
                        <div className='flex flex-col gap-5'>
                            <h2 className='font-bold text-3xl' >Dataset Transcripción</h2>
                            <span className='max-w-lg'>Sistema Completo para gestionar transcripción, segmentación y doblaje de contenido educativo.</span>
                            <a className=' rounded-lg mt-3 flex items-center justify-center font-bold text-white bg-[#196DFF] gap-3 w-40 h-10 ' href=""> Comenzar <FaArrowRight className='text-lg' />
                            </a>
                        </div>
                        <div className='my-10'>
                            <h3 className='font-bold text-lg'>Accesos Rapidos</h3>
                        </div>
                        <section className='flex gap-4'>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white w-60 rounded-xl'>
                                <TbArrowDownFromArc className='text-[#196DFF] text-2xl ' />
                                <h3 className='font-bold text-2xl text-[#196DFF]' >Ingesta</h3>
                                <span className='text-sm text-[#989898]'>Agregar nuevos videos a procesar</span>

                            </article>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white w-60 rounded-xl'>
                                <HiDocumentText className='text-[#02B272] text-2xl ' />
                                <h3 className='font-bold text-2xl text-[#02B272]' >Trascripcion</h3>
                                <span className='text-sm text-[#989898]'>Extraer y limpiar transcripciones </span>

                            </article>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white w-60 rounded-xl'>
                                <RiScissorsCutFill className='text-[#C4B223] text-2xl ' />
                                <h3 className='font-bold text-2xl text-[#C4B223]' >Segmentacion</h3>
                                <span className='text-sm text-[#989898]'>Dividir videos en clips
                                    temáticos</span>

                            </article>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white w-60 rounded-xl'>
                                <MdTranslate className='text-[#F07B78] text-2xl ' />
                                <h3 className='font-bold text-2xl text-[#F07B78]' >Doblaje</h3>
                                <span className='text-sm text-[#989898]'>Traducir y generar doblaje</span>

                            </article>
                        </section>
                    </div>
                </section>
            </article >
        </section >
    )
}

export default Inicio