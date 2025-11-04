import React from 'react'
import Panel from '../../Components/Panel'

function Transcripcion() {
    return (
        <section className='flex'>
            <Panel />
            <main className='flex-1  lg:ml-64 '>
                <div className='h-14'>
                </div>
                <section className='h-screen bg-[#FAFAF7] border-t-2 border-solid'>
                    <div className='mt-6  mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-28 2xl:mx-32'>
                        <div className='flex flex-col gap-5'>
                            <h2 className='font-bold text-2xl sm:text-2xl lg:text-4xl'>Transcripción</h2>
                            <span className='max-w-lg text-sm sm:text-base'>Extrae , limpia  y alinea trascripciones de video</span>

                        </div>
                    </div>

                </section>
            </main>
        </section>
    )
}

export default Transcripcion