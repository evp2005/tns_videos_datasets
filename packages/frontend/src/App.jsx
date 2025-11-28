import { LoginProvider } from "./features/Login/Context/LoginContext.jsx";
import { VideoProvider } from "./context/videoContext.jsx";
import AppRouter from "./router/router.jsx";
import ConditionalToaster from "./components/ConditionalToaster/ConditionalToaster.jsx";

function App() {
  return (
    <LoginProvider>
      <VideoProvider>
        <ConditionalToaster />
        <AppRouter />
      </VideoProvider>
    </LoginProvider>
  );
}

export default App;
