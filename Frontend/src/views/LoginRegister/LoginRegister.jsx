import imagen from "../../assets/Imagen Windows11.jpg";
import logo from "../../assets/logo_2.png";

function Login() {
    return (
        <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] p-[1.25rem] gap-[1.25rem]">
            <article className="flex justify-center items-center lg:items-start">
                <div className="w-full max-w-[28rem]">
                    <div className="flex mb-[2rem] py-[1.25rem] 2xl:mb-20">
                        <img className="h-[2rem] w-auto 2xl:h-[2.7rem]" src={logo} alt="Logo" />
                    </div>
                    <form className="w-full ">
                        <div className="space-y-[1.2rem]  lg:px-16 lg:w-full">
                            <h1 className="text-[1rem] 2xl:text-[1.7rem] font-bold text-gray-900  leading-tight">Registrate</h1>
                            <p className="text-[0.8rem] 2xl:text-[1rem] text-gray-600  leading-relaxed">Completa el formulario para crear su cuenta</p>
                            <div className="space-y-[1rem] ">
                                <div className="space-y-[1rem]    ">
                                    <div className="relative mb-[0.625rem] ">
                                        <input
                                            type="text"
                                            id="Usuario"
                                            className="peer w-80  2xl:w-96 h-[3rem] rounded-lg border border-gray-300 text-[0.875rem] px-[1rem] outline-none transition-all duration-300 bg-gray-50 hover:border-gray-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_0.1875rem_rgba(59,130,246,0.1)] placeholder-transparent"
                                            placeholder=" "
                                        />
                                        <label htmlFor="Usuario" className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-[0.875rem] text-gray-500 pointer-events-none transition-all duration-300 bg-transparent px-[0.25rem] peer-focus:top-0 peer-focus:text-[0.75rem] peer-focus:text-blue-500 peer-focus:bg-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.75rem] peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white ">Nombre</label>
                                    </div>


                                    <div className="relative mb-[0.625rem]">
                                        <input
                                            type="email"
                                            id="date"
                                            className="peer w-80 2xl:w-96 h-[3rem] rounded-lg border border-gray-300 text-[0.875rem] px-[1rem] outline-none transition-all duration-300 bg-gray-50 hover:border-gray-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_0.1875rem_rgba(59,130,246,0.1)] placeholder-transparent"
                                            placeholder=""
                                        />
                                        <label htmlFor="email" className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-[0.875rem] text-gray-500 pointer-events-none transition-all duration-300 bg-transparent px-[0.25rem] peer-focus:top-0 peer-focus:text-[0.75rem] peer-focus:text-blue-500 peer-focus:bg-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.75rem] peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white">Email</label>
                                    </div>
                                    <div className="relative mb-[0.625rem]">
                                        <input
                                            type="password"
                                            id="date"
                                            className="peer w-80 2xl:w-96 h-[3rem] rounded-lg border border-gray-300 text-[0.875rem] px-[1rem] outline-none transition-all duration-300 bg-gray-50 hover:border-gray-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_0.1875rem_rgba(59,130,246,0.1)] placeholder-transparent"
                                            placeholder=""
                                        />
                                        <label htmlFor="password" className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-[0.875rem] text-gray-500 pointer-events-none transition-all duration-300 bg-transparent px-[0.25rem] peer-focus:top-0 peer-focus:text-[0.75rem] peer-focus:text-blue-500 peer-focus:bg-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.75rem] peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white">Contraseña</label>
                                    </div>
                                    <div className="relative mb-[0.625rem]">
                                        <input
                                            type="password"
                                            id="date"
                                            className="peer w-80 2xl:w-96 h-[3rem] rounded-lg border border-gray-300 text-[0.875rem] px-[1rem] outline-none transition-all duration-300 bg-gray-50 hover:border-gray-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_0.1875rem_rgba(59,130,246,0.1)] placeholder-transparent"
                                            placeholder=""
                                        />
                                        <label htmlFor="password" className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-[0.875rem] text-gray-500 pointer-events-none transition-all duration-300 bg-transparent px-[0.25rem] peer-focus:top-0 peer-focus:text-[0.75rem] peer-focus:text-blue-500 peer-focus:bg-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.75rem] peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white">Confirmar Contraseña</label>
                                    </div>
                                </div>
                                <div className="flex items-center gap-[0.5rem]">
                                    <input className="w-[1rem] h-[1rem] rounded cursor-pointer" type="checkbox" name="" id="" />
                                    <span className="text-[0.875rem] text-gray-700 leading-relaxed"> Mantener sesion iniciada</span>
                                </div>
                                <div className="mt-[0.5rem]">
                                    <button className="w-80 2xl:w-96 h-[3rem] rounded-lg border-none text-white bg-[#367AFF] text-[1rem] font-medium cursor-pointer transition-all duration-300 shadow-[0_0.125rem_0.5rem_rgba(54,122,255,0.3)] hover:bg-[#2563EB] hover:shadow-[0_0.25rem_0.75rem_rgba(54,122,255,0.4)] hover:-translate-y-[0.0625rem] active:translate-y-0 mt-[1.25rem]" type="submit">Ingresar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </article>
            <article className="hidden lg:block">
                <img className="w-full h-full object-cover rounded-2xl" src={imagen} alt="" />
            </article>
        </section>
    );
}

export default Login;