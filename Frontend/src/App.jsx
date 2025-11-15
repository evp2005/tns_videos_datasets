// src/App.jsx
import { LoginProvider } from "./features/Login/Context/LoginContext.jsx";
import AppRouter from "./router/router.jsx";
import ConditionalToaster from "./components/ConditionalToaster/ConditionalToaster.jsx"; // ✅ Importar el component

function App() {
  return (
    <LoginProvider>
      <ConditionalToaster /> {/* ✅ Agregar aquí */}
      <AppRouter />
    </LoginProvider>
  );
}

export default App;