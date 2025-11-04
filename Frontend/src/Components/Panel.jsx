import logo from "../assets/logo_2.png";
import User from "../assets/anonimoprueba.png";
import { FaHouseUser } from "react-icons/fa";
import { TbArrowDownFromArc, TbArrowDownToArc } from "react-icons/tb";
import { HiDocumentText } from "react-icons/hi2";
import { RiScissorsCutFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { BsDatabase } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";


function Panel() {
    return (
        <aside className='hidden lg:flex font-bevietnam flex-col h-screen w-64 bg-white border-r-2 border-[#F2F3F2] fixed left-0 top-0 z-10'>
            {/* Header con logo */}
            <div className='flex justify-center items-center h-28 border-b-2 border-[#F2F3F2] mb-4 py-4'>
                <img className='h-12 w-40 object-contain' src={logo} alt="Logo" />
            </div>

            {/* Información del usuario */}
            <div className='flex justify-center items-center w-full gap-4 border-b-2 border-[#F2F3F2] mb-6 pb-4'>
                <img className='w-10 h-10 rounded-full object-cover' src={User} alt="Usuario" />
                <div className='flex flex-col items-center'>
                    <h4 className='font-bold text-gray-900'>Administración</h4>
                    <span className='text-sm text-[#6B7284]'>Admin</span>
                </div>
            </div>
            {/* Navegación principal */}
            <nav className='flex flex-col flex-1 px-4 gap-6 overflow-y-auto'>
                {/* Sección Principal */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-xs uppercase tracking-wide px-2'>Principal</h3>
                    <ul className='space-y-1'>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 bg-[#196DFF] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200'>
                                <FaHouseUser className='text-lg' />
                                <span className='font-medium'>Inicio</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Sección Procesos */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-xs uppercase tracking-wide px-2'>Procesos</h3>
                    <ul className='space-y-1'>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <TbArrowDownFromArc className='text-lg text-[#D3D0D6]' />
                                <span className='font-medium'>Ingesta</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <HiDocumentText className='text-lg text-[#D3D0D6]' />
                                <span className='font-medium'>Transcripción</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <RiScissorsCutFill className='text-lg text-[#D3D0D6]' />
                                <span className='font-medium'>Segmentación</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <MdTranslate className='text-lg text-[#D3D0D6]' />
                                <span className='font-medium'>Doblaje</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Sección Gestión */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-xs uppercase tracking-wide px-2'>Gestión</h3>
                    <ul className='space-y-1'>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <TbArrowDownToArc className='text-lg text-[#D3D0D6]' />
                                <span className='font-medium'>Exportes</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <BsDatabase className='text-lg text-[#D3D0D6]' />
                                <span className='font-medium'>Lotes</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Sección Configuración */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#B2AFB5] font-bold text-xs uppercase tracking-wide px-2'>Configuración</h3>
                    <ul className='space-y-1'>
                        <li>
                            <a href="#" className='flex items-center h-11 gap-3 px-3 text-[#787373] rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors duration-200'>
                                <IoSettingsSharp className='text-lg text-[#D3D0D6]' />
                                <span className='font-medium'>Ajustes</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    )
}

export default Panel