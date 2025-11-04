// @ts-nocheck
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login/Login";
import LoginRegister from "./views/LoginRegister/LoginRegister";
import Inicio from "./views/Inicio/Inicio";
<<<<<<< HEAD
import Transcripcion from "./views/Transcripcion/Transcripcion";
=======
import Ingesta from "./views/ingesta/Ingesta";
>>>>>>> origin/REACT



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route path="/Inicio" element={<Inicio />} />
<<<<<<< HEAD
        <Route path="/Transcripcion" element={<Transcripcion />} />

=======
        <Route path="/ingesta" element={<Ingesta />} />
>>>>>>> origin/REACT
      </Routes>
    </BrowserRouter>
  );
}

export default App;

