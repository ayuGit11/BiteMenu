import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {

    const navigate = useNavigate();
    const { setAuthenticatedUser } = useAuth();

    useEffect(() => {

        const checkGoogleUser = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/auth/google/status",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    console.error(data);

                    navigate("/login");
                    return;
                }

                if (data.registered) {

                    // Existing Google user
                    setAuthenticatedUser(data);

                    navigate("/");

                } else {

                    // New Google user
                    navigate("/choose-username");
                }

            } catch (error) {

                console.error(
                    "Google callback error:",
                    error
                );

                navigate("/login");
            }
        };

        checkGoogleUser();

    }, [navigate, setAuthenticatedUser]);


    return (
        <div className="min-h-screen flex items-center justify-center">

            <p>
                Completing Google login...
            </p>

        </div>
    );
}