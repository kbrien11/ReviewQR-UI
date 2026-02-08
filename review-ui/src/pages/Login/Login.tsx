import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/owner/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid credentials");
        return;
      }

      // Django returns: { access, refresh, user }
      login(data.access, data.user);

      navigate("/dashboard");
    } catch (err) {
      setError("Unable to connect to server");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 relative">

    {/* Logo top-right */}
    <Link
      to="/"
      className="absolute top-6 right-6 text-2xl font-extrabold text-blue-700 hover:text-blue-900 transition-all duration-300 hover:scale-105"
    >
      ReviewQR
    </Link>
  
    {/* Login Card */}
    <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-8 animate-fadeInUp">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Welcome Back
      </h1>
  
      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
      )}
  
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
  
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
  
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-[.98] transition-all duration-200"
        >
          Log In
        </button>
      </form>
    </div>
  </div>
  );
}