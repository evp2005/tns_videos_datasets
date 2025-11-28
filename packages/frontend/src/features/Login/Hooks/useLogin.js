// @ts-nocheck
import { useState } from "react";
import { loginUser } from "../services/authService";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * loginUser(email, password) es tu función del backend que devuelve { token, user } o similar
     * rememberMe -> true = guardar en localStorage (persistente)
     *               false = guardar en sessionStorage (solo pestaña)
     */
    const login = async (email, password, rememberMe = false) => {
        setLoading(true);
        setError(null);

        try {
            const data = await loginUser(email, password);

            // Guardar token según la opción
            if (data?.token) {
                if (rememberMe) {
                    localStorage.setItem("token", data.token);
                } else {
                    sessionStorage.setItem("token", data.token);
                }
            } else {
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem("token", JSON.stringify(data));
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
