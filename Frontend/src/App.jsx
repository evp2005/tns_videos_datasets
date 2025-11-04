// @ts-nocheck
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login/Login";
import LoginRegister from "./views/LoginRegister/LoginRegister";
import Inicio from "./views/Inicio/Inicio";
import Transcripcion from "./views/Transcripcion/Transcripcion";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Transcripcion" element={<Transcripcion />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

