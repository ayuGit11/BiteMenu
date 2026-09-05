import React, { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { ClearCart } from "../redux/cartSlice";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const username = sessionStorage.getItem("username");
        const auth = sessionStorage.getItem("auth");
        const role = sessionStorage.getItem("role");

        if (username && auth) {
            return {
                username,
                auth,
                role
            };
        }

        return null;
    });

    const login = async (username, password) => {
        const credentials = btoa(`${username}:${password}`);
        
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password
            })
        });
        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("auth", credentials);
        sessionStorage.setItem("role", data.role);

        setUser({
            username,
            auth: credentials,
            role: data.role
        });
    };

    const logout = () => {
        // Clear cart when user logs out
        dispatch(ClearCart());
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("role");

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
