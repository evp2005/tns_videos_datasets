import React from 'react'
import logo from "../assets/logo_2.png";
import User from "../assets/anonimo.png"
import { FaHouseUser } from "react-icons/fa";
import { TbArrowDownFromArc } from "react-icons/tb";
import { HiDocumentText } from "react-icons/hi2";
import { RiScissorsCutFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { BsDatabase } from "react-icons/bs";
import { TbArrowDownToArc } from "react-icons/tb";

import { IoSettingsSharp } from "react-icons/io5";


function Panel() {
    return (
        <section className='flex font-bold font-bevietnam flex-col  h-max bg-white border-r-2  border-[#F2F3F2]'>
            <div className='flex justify-center items-center h-[7rem] w-[15rem] border-b-2 border-[#F2F3F2] mb-4 py-4'>
                <img className='h-[3rem] w-[10rem] object-contain' src={logo} alt="Logo" />
            </div>
            <div className='flex justify-center items-center w-[15rem] gap-4 border-b-2 border-[#F2F3F2]  mb-6 pb-4'>
                <img className='w-[2.5rem] h-[2.5rem] rounded-full object-cover' src={User} alt="Usuario" />
                <div className='flex flex-col items-center'>
                    <h4 className='font-bold text-gray-900'>Administración</h4>
                    <span className='text-sm text-[#6B7284]'>Admin</span>
                </div>
            </div>
            <nav className='flex flex-col w-full pl-5 gap-5'>

                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-sm'>PRINCIPAL</h3>
                    <ul className='list-none'>
                        <li>
                            <a href="#" className='flex items-center h-[3rem]  gap-5 px-4 bg-[#196DFF] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200'>
                                <FaHouseUser className='text-3xl h-full' /> Inicio
                            </a>
                        </li>
                    </ul>
                </div>

                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-sm '>PROCESOS</h3>
                    <ul className='list-none flex flex-col gap-1'>
                        <li>
                            <a href="#" className='flex items-center h-[3rem] gap-4  px-4 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <TbArrowDownFromArc className='text-2xl text-[#D3D0D6] ' /> Ingesta
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex  items-center h-[3rem] gap-4  px-4 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <HiDocumentText className='text-2xl text-[#D3D0D6]' /> Transcripción
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex items-center h-[3rem] px-4 gap-4 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <RiScissorsCutFill className='text-2xl text-[#D3D0D6]' />  Segmentación
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex items-center h-[3rem] gap-4 px-4 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <MdTranslate className='text-2xl text-[#D3D0D6]' />
                                Doblaje
                            </a>
                        </li>
                    </ul>
                </div>


                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-sm '>GESTIÓN</h3>
                    <ul className='list-none flex flex-col gap-1'>
                        <li>
                            <a href="#" className='flex items-center h-[3rem] gap-4 px-4 rounded-lg text-[#787373]  hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <TbArrowDownToArc
                                    className='text-2xl text-[#D3D0D6]' />
                                Exportes
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex items-center h-[3rem] px-4 gap-4 rounded-lg text-[#787373] hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <BsDatabase className='text-2xl text-[#D3D0D6]' />  Lotes
                            </a>
                        </li>
                    </ul>
                </div>

                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-sm '>CONFIGURACIÓN</h3>
                    <ul className='list-none'>
                        <li>
                            <a href="#" className='flex items-center h-[3rem] px-4 gap-4 text-[#787373] hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200'>
                                <IoSettingsSharp className='text-2xl text-[#D3D0D6]' />
                                Ajustes
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </section>
    )
}

export default Panel