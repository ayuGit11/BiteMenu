import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [usernameError, setUsernameError] = useState(""); 
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState(""); 
  const [confirmPasswordError,setConfirmPasswordError]=useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages 
    setUsernameError(""); 
    setEmailError("");
    setPasswordError(""); 
    setSuccessMessage("");

    const trimmedUsername = username.trim();
    let hasError = false;

    // Username format validation
    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setUsernameError(
        "Username must be 3-20 characters and contain only letters, numbers, or underscore."
      );
      hasError = true;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(
        "Password must be 8-64 characters and include uppercase, lowercase, number, and special character."
      );
     hasError = true;
    }

    // Check password confirmation 
    if (password !== confirmPassword){ 
      setConfirmPasswordError("Passwords do not match"); 
      hasError = true;
    }
    if (hasError) {
      return;
    }
    try {
        const response = await fetch("http://localhost:8080/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username:trimmedUsername,
            email,
            password,
          }),
        });
        // Read response from backend
        const data = await response.json();

        if (!response.ok) {
        const message = data.message || "Registration failed";
          if (message.toLowerCase().includes("username")) {
            setUsernameError(message);
          } else if (message.toLowerCase().includes("email")) {
            setEmailError(message);
          } else {
            setUsernameError(message);
          }
          return;
        }
        setSuccessMessage("Registration successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } catch (error) {
        console.error(error);
        setUsernameError("Unable to connect to server");
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-200">
      <form onSubmit={handleSubmit} className="w-96 p-8 shadow-xl rounded-lg bg-white">
        <h2 className="text-3xl font-bold mb-2 text-center"> Create Account </h2>
        <p className="text-gray-500 text-center mb-6"> Join BiteMenu today </p>
        <input type="text" placeholder="Username" value={username} onChange={(e) => {setUsername(e.target.value);setUsernameError("");}} className={`w-full border p-3 rounded-md outline-none focus:ring-2 focus:ring-orange-400 ${ usernameError ? "border-red-500" : "border-gray-300" }`} required/>
        {/* Username error */} 
        {usernameError && ( <p className="text-red-500 text-sm mt-1 mb-4"> {usernameError} </p> )} {!usernameError && <div className="mb-4"></div>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full border p-3 rounded-md outline-none focus:ring-2 focus:ring-orange-400 ${ emailError ? "border-red-500" : "border-gray-300" }`} required/>
        {/* Emailname error */} 
        {emailError && ( <p className="text-red-500 text-sm mt-1 mb-4"> {emailError} </p> )} {!emailError && <div className="mb-4"></div>}
        <input type="password" placeholder="Password" value={password} onChange={(e) =>{ setPassword(e.target.value);setPasswordError("")}} className={`w-full mb-4 border p-3 rounded-md outline-none focus:ring-2 focus:ring-orange-400 ${ passwordError ? "border-red-500" : "border-gray-300" }`} required/>
         {/* Password error */} 
        {passwordError && ( <p className="text-red-500 text-sm mt-1 mb-4"> {passwordError} </p> )}       
        {!passwordError && <div className="mb-4"></div>}
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value),setConfirmPasswordError("")}} className={`w-full border p-3 rounded-md outline-none focus:ring-2 focus:ring-orange-400 ${ confirmPasswordError ? "border-red-500" : "border-gray-300" }`} required/>
        {/* Confirm Password error */} 
        {confirmPasswordError  && ( <p className="text-red-500 text-sm mt-1 mb-4"> {confirmPasswordError} </p> )}
        {!confirmPasswordError && <div className="mb-5"></div>}
        <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600"> Create Account </button>
        {successMessage && (
          <p className="text-center mt-4 text-sm text-green-500">
            {successMessage}
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

