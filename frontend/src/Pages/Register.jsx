import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // Check password confirmation 
    if (password !== confirmPassword){ 
      setMessage("Passwords do not match"); 
      return;
    }
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
        setConfirmPassword("");
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
    <div className="min-h-screen flex items-center justify-center bg-pink-200">
      <form onSubmit={handleSubmit} className="w-96 p-8 shadow-xl rounded-lg bg-white">
        <h2 className="text-3xl font-bold mb-2 text-center"> Create Account </h2>
        <p className="text-gray-500 text-center mb-6"> Join BiteMenu today </p>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border p-3 mb-4 rounded-md outline-none focus:ring-2 focus:ring-orange-400" required/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 mb-4 rounded-md outline-none focus:ring-2 focus:ring-orange-400" required/>
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border p-3 mb-5 rounded-md outline-none focus:ring-2 focus:ring-orange-400" required/>
        <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600"> Create Account </button>
        {message && (
          <p className="text-center mt-4 text-sm">
            {message}
          </p>
        )}
        <div className="text-center mt-6 text-gray-600">
           Already have an account?{" "} 
           <Link to="/login" className="text-orange-500 font-semibold hover:underline" > Sign In </Link>
        </div>
      </form>
    </div>
  );
}

