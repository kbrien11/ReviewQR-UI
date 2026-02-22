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
      const response = await fetch("https://reviewqrapi.onrender.com/auth/owner/login/", {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">

      {/* Logo top-right */}
      <Link
        to="/"
        className="
          absolute top-6 right-6 text-xl font-bold text-gray-900
          hover:text-indigo-600 transition
        "
      >
        ReviewQR
      </Link>

      {/* Login Panel */}
      <div className="
        w-full max-w-md bg-white p-10 rounded-xl
        border border-gray-200 shadow-sm
        animate-fadeInUp
      ">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Welcome Back
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="
                w-full px-4 py-3 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition
              "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="
                w-full px-4 py-3 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full py-3 bg-indigo-600 text-white rounded-lg
              font-semibold text-base
              hover:bg-indigo-700 transition
            "
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}