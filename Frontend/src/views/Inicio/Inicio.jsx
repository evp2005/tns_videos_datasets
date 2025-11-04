import Panel from '../../Components/Panel'
import { TbArrowDownFromArc } from "react-icons/tb";
import { HiDocumentText } from "react-icons/hi2";
import { RiScissorsCutFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";

function Inicio() {
    return (
        <section className='flex'>
            <Panel />
            <main className='flex-1 ml-0 lg:ml-64 min-h-screen'>
                <div className='h-14'>

                </div>
                <section className='h-full bg-[#FAFAF7] border-t-2 border-solid'>
                    <div className='mt-6 h-screen mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-28 2xl:mx-32'>
                        <div className='flex flex-col gap-5'>
                            <h2 className='font-bold text-2xl sm:text-3xl lg:text-4xl'>Dataset Transcripción</h2>
                            <span className='max-w-lg text-sm sm:text-base'>Sistema Completo para gestionar transcripción, segmentación y doblaje de contenido educativo.</span>
                            <a className='rounded-lg mt-3 flex items-center justify-center font-bold text-white bg-[#196DFF] gap-3 w-32 sm:w-40 h-10 text-sm sm:text-base' href=""> 
                                Comenzar <FaArrowRight className='text-sm sm:text-lg' />
                            </a>
                        </div>
                        <div className='my-8 lg:my-10'>
                            <h3 className='font-bold text-base sm:text-lg'>Accesos Rápidos</h3>
                        </div>
                        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                <TbArrowDownFromArc className='text-[#196DFF] text-2xl' />
                                <h3 className='font-bold text-xl sm:text-2xl text-[#196DFF]'>Ingesta</h3>
                                <span className='text-xs sm:text-sm text-[#989898] pr-4'>Agregar nuevos videos a procesar</span>
                            </article>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                <HiDocumentText className='text-[#02B272] text-2xl' />
                                <h3 className='font-bold text-xl sm:text-2xl text-[#02B272]'>Transcripción</h3>
                                <span className='text-xs sm:text-sm text-[#989898] pr-4'>Extraer y limpiar transcripciones</span>
                            </article>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                <RiScissorsCutFill className='text-[#C4B223] text-2xl' />
                                <h3 className='font-bold text-xl sm:text-2xl text-[#C4B223]'>Segmentación</h3>
                                <span className='text-xs sm:text-sm text-[#989898] pr-4'>Dividir videos en clips temáticos</span>
                            </article>
                            <article className='flex flex-col justify-center pl-4 gap-2 h-40 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                                <MdTranslate className='text-[#F07B78] text-2xl' />
                                <h3 className='font-bold text-xl sm:text-2xl text-[#F07B78]'>Doblaje</h3>
                                <span className='text-xs sm:text-sm text-[#989898] pr-4'>Traducir y generar doblaje</span>
                            </article>
                        </section>
                    </div>
                </section>
            </main>
        </section>
    )
}

export default Inicio