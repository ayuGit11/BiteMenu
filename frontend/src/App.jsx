import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ManageFoodMenu from "./Pages/ManageFoodMenu";
import GoogleCallback from "./Pages/GoogleCallback";
import ChooseUsername from "./Pages/ChooseUsername";

import { useAuth } from "./context/AuthContext";

function AdminRoute({ children }) {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (user.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default function App() {
  return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/google-callback" element={<GoogleCallback />}/>
            <Route path="/choose-username"element={<ChooseUsername />}/>
            <Route path="/menu"
                element={
                    <AdminRoute>
                        <ManageFoodMenu />
                    </AdminRoute>
                }
            />
        </Routes>
    );
}