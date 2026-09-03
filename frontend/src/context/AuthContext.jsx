import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const username = sessionStorage.getItem("username");
        const auth = sessionStorage.getItem("auth");

        if (username && auth) {
            return {
                username,
                auth,
            };
        }

        return null;
    });

    const login = (username, password) => {
        const credentials = btoa(`${username}:${password}`);

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("auth", credentials);

        setUser({
            username,
            auth: credentials,
        });
    };

    const logout = () => {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("auth");

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
