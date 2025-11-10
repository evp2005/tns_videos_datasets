import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../features/login/pages/LoginPage.jsx";
import LoginRegisterPage from "../features/loginRegister/pages/LoginRegisterPage.jsx";
import InicioPage from "../features/inicio/pages/InicioPage.jsx";
import TranscripcionPage from "../features/transcripcion/pages/TranscripcionPage.jsx";
import IngestaPage from "../features/ingesta/pages/IngestaPage.jsx";
import SegmentacionPage from "../features/segmentacion/pages/SegmentacionPage.jsx";
import ExportesPage from "../features/exportes/pages/ExportesPage.jsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<LoginRegisterPage />} />
                <Route path="/inicio" element={<InicioPage />} />
                <Route path="/transcripcion" element={<TranscripcionPage />} />
                <Route path="/ingesta" element={<IngestaPage />} />
                <Route path="/segmentacion" element={<SegmentacionPage />} />
                <Route path="/exportes" element={<ExportesPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
