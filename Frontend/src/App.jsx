// @ts-nocheck
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login/Login";
import LoginRegister from "./views/LoginRegister/LoginRegister";
import Inicio from "./views/Inicio/Inicio";
import Ingesta from "./views/ingesta/Ingesta";
import Segmentacion from "./views/segmentacion/segmentacion";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/ingesta" element={<Ingesta />} />
        <Route path="/segmentacion" element={<Segmentacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

