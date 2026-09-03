import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage("Login successful!");

        // Go to home page after successful login
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setMessage(data || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 shadow-lg rounded-lg bg-white"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          Login
        </button>

        {message && (
          <p className="text-center mt-4">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;

