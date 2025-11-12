// @ts-nocheck
import { useState } from "react";
import { loginUser } from "../services/authService";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser(email, password);

            // ✅ Guardar en sessionStorage (se borra al cerrar la pestaña)
            if (data?.token) {
                sessionStorage.setItem("token", data.token);
            } else {
                sessionStorage.setItem("token", JSON.stringify(data));
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
