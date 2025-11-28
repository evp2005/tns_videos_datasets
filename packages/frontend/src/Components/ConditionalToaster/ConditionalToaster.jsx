// src/components/ConditionalToaster.jsx
import { Toaster } from 'react-hot-toast';

const ConditionalToaster = () => {
  // ✅ Eliminar useLocation y mostrar siempre el Toaster
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 5000,
        style: {
          borderRadius: '12px',
          fontWeight: '600',
        },
        success: {
          style: {
            background: '#10B981',
            color: '#ffffff',
            fontSize: '16px',
            padding: '16px 24px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
            color: '#ffffff',
            fontSize: '14px',
            padding: '12px 16px',
          },
        },
      }}
    />
  );
};

export default ConditionalToaster;