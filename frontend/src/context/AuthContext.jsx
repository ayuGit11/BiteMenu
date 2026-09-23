import React, { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart, ClearCart } from "../redux/cartSlice";
import { getCart } from "../services/cartService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const username = sessionStorage.getItem("username");
        const displayname = sessionStorage.getItem("displayname");
        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role");

        if (username && token) {
            return {
                username,
                token,
                role
            };
        }

        return null;
    });
    useEffect(() => {
        const restoreGoogleLogin = async () => {
            // Normal login already restored from sessionStorage
            const storedToken = sessionStorage.getItem("token");
            if (storedToken) {
                return;
            }
            try {
                const response = await fetch(
                    "http://localhost:8080/auth/me",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );
                if (!response.ok) {
                    return;
                }
                const data = await response.json();
                setUser({
                    username: data.username,
                    displayName:data.displayName,
                    role: data.role,
                    token: null
                });
            } catch (error) {
                console.error(
                    "Failed to restore authentication:",
                    error
                );
            }
        };
        restoreGoogleLogin();
    }, []);
    // Load cart whenever an already logged-in user is available
     useEffect(() => {
        if(user){
            const loadCart = async () => {
                try {
                    const cart = await getCart();
                    dispatch(setCart(cart));
                } catch (error) {
                    console.error("Failed to load cart:", error);
                   // dispatch(setCart([]));
                   if (error.status === 401) {
                        // Backend session is no longer valid
                        sessionStorage.removeItem("username");
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("role");

                        setUser(null);
                        dispatch(ClearCart());
                   }
                }
            };
            loadCart();
        }}, [user, dispatch]);
    const login = async (username, password) => {       
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();

        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);

        setUser({
            username: data.username,
            displayName:data.displayName,
            token: data.token,
            role: data.role
        });
            
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:8080/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }

        dispatch(ClearCart());

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("token");
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