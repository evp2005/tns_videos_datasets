import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // verificar si hay usuario guardado
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    // función de login global
    const login = async (email, password) => {
        const data = await loginUser(email, password);
        setUser(data.user || data); // depende de cómo devuelva el backend
        localStorage.setItem("user", JSON.stringify(data.user || data));
        return data;
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <LoginContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};
