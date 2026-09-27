import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ChooseUsername() {
    const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const { setAuthenticatedUser } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        if (!USERNAME_REGEX.test(username)) {
            setError(
                "Username must be 3-20 characters and contain only letters, numbers, or underscore."
            );
            return;
        }
        try {

            const response = await fetch(
                "http://localhost:8080/auth/google/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: username
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to register username");
                return;
            }

            // Save BiteMenu JWT
            setAuthenticatedUser(data);
            navigate("/");

        } catch (error) {
            console.error(error);
            setError("Unable to connect to server");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-200">

            <form
                onSubmit={handleSubmit}
                className="w-96 p-8 shadow-xl rounded-lg bg-white"
            >

                <h2 className="text-3xl font-bold mb-2 text-center">
                    Choose Username
                </h2>

                <p className="text-gray-500 text-center mb-6">
                    Choose a username for your BiteMenu account
                </p>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={20}
                    pattern="[A-Za-z0-9_]+"
                    autoComplete="username"
                    className={`w-full border p-3 rounded-md outline-none
                        focus:ring-2 focus:ring-orange-400
                        ${error ? "border-red-500" : "border-gray-300"}`}
                    required
                />

                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full mt-5 bg-orange-500 text-white
                        py-3 rounded-md font-semibold
                        hover:bg-orange-600"
                >
                    Continue
                </button>

            </form>

        </div>
    );
}