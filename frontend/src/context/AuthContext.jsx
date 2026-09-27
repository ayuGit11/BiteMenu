import React, { createContext, useContext, useState, useEffect, useCallback} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart, ClearCart } from "../redux/cartSlice";
import { getCart } from "../services/cartService";

export const AuthContext = createContext();
const getTokenExpiry = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000;
    } catch {
        return null;
    }
};
export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const username = sessionStorage.getItem("username");
        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role");
        if (username && token) {
            return {username,token,role};
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

    const clearAuthentication = useCallback(() => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setUser(null);
    }, []);

    // Load cart whenever user is logged in
    useEffect(() => {
        if (!user?.token) {
           return;
        }
        const expiryTime = getTokenExpiry(user.token);
        if (!expiryTime) {
          return;
        }
        const remainingTime = expiryTime - Date.now();
        if (remainingTime <= 0) {
            clearAuthentication();
            return;
        }
        const timer = setTimeout(() => {
            clearAuthentication();
            dispatch(ClearCart());
            navigate("/login");
            toast.info("Your session has expired. Please log in again.",{autoClose: false,closeOnClick: true,});
        }, remainingTime);
        return () => clearTimeout(timer);
    }, [user]);

    useEffect(() => {
        if (user) {
            const loadCart = async () => {
                try {
                    const cart = await getCart();
                    dispatch(setCart(cart));
                }catch (error) {
                    console.error("Failed to load cart:",error);
                    // JWT invalid/expired
                    if (error.status === 401) {
                        clearAuthentication();
                        // IMPORTANT:
                        // Do NOT clear the cart here.
                        // Cart must persist in the database.
                        dispatch(ClearCart());
                        navigate("/login");
                        toast.info("Your session has expired. Please log in again.",{autoClose: false,closeOnClick:true});
                    }
                }
            };
            loadCart();
        }
    }, [user, dispatch]);
    const login = async (identifier, password) => {
        const response = await fetch("http://localhost:8080/login",
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
            console.error("Logout failed:",error);
        }
        clearAuthentication();
        dispatch(ClearCart());
        
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