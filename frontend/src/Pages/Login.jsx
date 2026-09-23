import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoginSuccess(false);

    try {
      await login(username, password);
        setMessage("Login successful!");
        setLoginSuccess(true);
        setTimeout(() => {
          // If user came from checkout/place order,
          // send them back there.
          const from = location.state?.from || "/";
          navigate(from);
        }, 500);
    }catch(error){
        console.error("Login error:", error);
        setMessage(error.message || "Invalid username or password");
        setLoginSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center  bg-pink-200 justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-8 shadow-xl rounded-lg bg-white"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">
          Sign In
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Sign in to continue to BiteMenu
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {setUsername(e.target.value);setMessage("");}}
          className={`w-full border p-3 mb-4 rounded-md outline-none focus:ring-2 focus:ring-orange-400 ${
            message && !loginSuccess
              ? "border-red-500"
              : "border-gray-300"
          }`}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {  setPassword(e.target.value);setMessage("");}}
          className={`w-full border p-3 mb-4 rounded-md outline-none focus:ring-2 focus:ring-orange-400 ${
            message && !loginSuccess
              ? "border-red-500"
              : "border-gray-300"
          }`}
          required
        />

        <button type="submit" className="w-full mb-4  bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 cursor-pointer">
          Sign In
        </button>
        {/* Google Sign In */} 
        <button type="button" onClick={() => {
            window.location.href =
              "http://localhost:8080/oauth2/authorization/google";
          }}
          className="w-full border border-gray-300 p-3 mb-4 rounded-md font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 cursor-pointer"
         >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
          Continue with Google
        </button>
        {message && (
          <p className={`text-center mt-4 text-sm ${loginSuccess ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        
        <div className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;

