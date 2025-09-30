// src/views/Menu.jsx
import "./Menu.css";

import { Perfil } from "../../Components/Perfil/Perfil";
import { Hero } from "../../Components/Hero/Hero";


function Menu() {
    return (
        <main className="menu-page">
            <Perfil />
            <Hero />
        </main>
    );
}

export default Menu;
