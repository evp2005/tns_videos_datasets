import { createContext, useState, useEffect } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // al montar, revisa si hay token en sessionStorage
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) setUser(token);
    }, []);

    const login = (token) => {
        sessionStorage.setItem("token", token); // guarda en sessionStorage
        setUser(token); // actualiza el estado React
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setUser(null);
    };

    return (
        <LoginContext.Provider value={{ user, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};
