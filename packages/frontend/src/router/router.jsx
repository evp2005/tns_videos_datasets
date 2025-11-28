// @ts-nocheck
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/login/pages/LoginPage.jsx";
import LoginRegisterPage from "../features/loginRegister/pages/LoginRegisterPage.jsx";
import InicioPage from "../features/inicio/pages/InicioPage.jsx";
import TranscripcionPage from "../features/transcripcion/pages/TranscripcionPage.jsx";
import IngestaPage from "../features/ingesta/pages/IngestaPage.jsx";
import SegmentacionPage from "../features/segmentacion/pages/SegmentacionPage.jsx";
import ExportesPage from "../features/exportes/pages/ExportesPage.jsx";
import DoblajePage from "../features/Doblaje/pages/DoblajePage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx"; // 🔒 importa el protector
import AjustePage from "../features/Ajustes/pages/AjustePage.jsx";
import LotesPage from "../features/Lotes/Page/LotesPage.jsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 🔓 Rutas públicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<LoginRegisterPage />} />


                {/* 🔒 Rutas protegidas */}
                <Route
                    path="/inicio"
                    element={
                        <ProtectedRoute>
                            <InicioPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transcripcion"
                    element={
                        <ProtectedRoute>
                            <TranscripcionPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ingesta"
                    element={
                        <ProtectedRoute>
                            <IngestaPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/segmentacion"
                    element={
                        <ProtectedRoute>
                            <SegmentacionPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/exportes"
                    element={
                        <ProtectedRoute>
                            <ExportesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doblaje"
                    element={
                        <ProtectedRoute>
                            <DoblajePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lotes"
                    element={
                        <ProtectedRoute>
                            <LotesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ajustes"
                    element={
                        <ProtectedRoute>
                            <AjustePage />
                        </ProtectedRoute>
                    }
                />



                {/* 🧭 Redirección por defecto */}
                <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
