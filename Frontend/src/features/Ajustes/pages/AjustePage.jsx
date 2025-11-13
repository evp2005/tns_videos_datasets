import { useState } from "react";
import Panel from '../../../Components/Panel';
import { BookOpen, Volume2, FileText, Tags, UsersRound } from "lucide-react";
import GlosariosTab from './views/GlosariosTab.jsx';
import VocesTab from './views/VocesTab.jsx';
import PlantillasTab from './views/PlantillasTab.jsx';
import EtiquetasTab from './views/EtiquetasTab.jsx';
import UsuariosTab from './views/UsuariosTab.jsx';

function AjustePage() {
    const [activeTab, setActiveTab] = useState('glosarios');

    const tabs = [
        { id: 'glosarios', label: 'Glosarios', icon: BookOpen },
        { id: 'voces', label: 'Voces', icon: Volume2 },
        { id: 'plantillas', label: 'Plantillas', icon: FileText },
        { id: 'etiquetas', label: 'Etiquetas', icon: Tags },
        { id: 'usuarios', label: 'Usuarios', icon: UsersRound }
    ];

    return (
        <section className='flex h-screen overflow-hidden'>
            <Panel />
            <main className='flex-1 ml-0 lg:ml-64 flex flex-col'>
                <div className='h-14 bg-white border-b border-gray-200'></div>

                <section className='flex-1 bg-[#FAFAF7] overflow-y-auto'>
                    <div className='flex justify-center p-8'>
                        <div className='w-full max-w-6xl'>
                            {/* Header */}
                            <div className='mb-6'>
                                <h1 className='font-bold text-3xl text-gray-900 mb-2'>
                                    Ajustes
                                </h1>
                                <p className='text-gray-600'>
                                    Configuración global del sistema
                                </p>
                            </div>

                            {/* Tabs Container */}
                            <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-1'>
                                <div className='grid grid-cols-5 gap-1'>
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium transition-all rounded-md ${
                                                    activeTab === tab.id
                                                        ? 'bg-gray-300 text-gray-900'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Icon size={14} />
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Contenedor principal con contenido */}
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-200'>
                                {activeTab === 'glosarios' && <GlosariosTab />}
                                {activeTab === 'voces' && <VocesTab />}
                                {activeTab === 'plantillas' && <PlantillasTab />}
                                {activeTab === 'etiquetas' && <EtiquetasTab />}
                                {activeTab === 'usuarios' && <UsuariosTab />}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default AjustePage;
