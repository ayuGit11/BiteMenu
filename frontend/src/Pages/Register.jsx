import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        setMessage("Registration successful!");
        setUsername("");
        setPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        const data = await response.text();
        setMessage(data || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-5 text-center"> Create Account </h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border p-2 mb-4 rounded" required/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 mb-4 rounded" required/>
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded"> Register </button>
        {message && (
          <p className="text-center mt-4">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

