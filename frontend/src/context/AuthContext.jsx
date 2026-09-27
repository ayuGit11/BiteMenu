import React, { createContext, useContext, useState, useEffect, useCallback} from "react";
import { useDispatch } from "react-redux";
import { setCart, ClearCart } from "../redux/cartSlice";
import { getCart } from "../services/cartService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const dispatch = useDispatch();

    const [user, setUser] = useState(() => {

        const username = sessionStorage.getItem("username");
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


    // Common function for LOCAL + GOOGLE login
    const setAuthenticatedUser = useCallback((data) => {

        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);

        setUser({
            username: data.username,
            token: data.token,
            role: data.role
        });
    },[]);


    // Load cart whenever user is logged in
    useEffect(() => {

        if (user) {

            const loadCart = async () => {

                try {

                    const cart = await getCart();

                    dispatch(setCart(cart));

                } catch (error) {

                    console.error(
                        "Failed to load cart:",
                        error
                    );

                    if (error.status === 401) {

                        sessionStorage.removeItem("username");
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("role");

                        setUser(null);

                        dispatch(ClearCart());
                    }
                }
            };

            loadCart();
        }

    }, [user, dispatch]);


    const login = async (identifier, password) => {

        const response = await fetch(
            "http://localhost:8080/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    identifier,
                    password
                })
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(
                data.message || "Invalid username/email or password"
            );
        }

        setAuthenticatedUser(data);
    };


    const logout = async () => {

        try {

            await fetch(
                "http://localhost:8080/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );
        }

        dispatch(ClearCart());

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                setAuthenticatedUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);