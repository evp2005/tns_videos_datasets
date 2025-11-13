// @ts-nocheck

import { useState } from "react";
import { registerApi } from "../services/RegisterApi";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const register = async (formData) => {
        setLoading(true);
        setMessage("");

        try {
            const response = await registerApi(formData);
            console.log("✅ Usuario creado:", response);
            setMessage("Usuario registrado correctamente");
            return true;
        } catch (error) {
            if (error.response?.status === 400) {
                setMessage("El usuario o correo ya está registrado");
            } else {
                setMessage("Error al registrar usuario");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, message };
};
