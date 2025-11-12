// src/App.jsx
import { LoginProvider } from "./features/Login/Context/LoginContext.jsx";
import AppRouter from "./router/router.jsx";

function App() {
  return (
    <LoginProvider>
      <AppRouter />
    </LoginProvider>
  );
}

export default App;