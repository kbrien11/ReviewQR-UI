import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://reviewqrapi.onrender.com/auth/owner/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid credentials");
        setLoading(false);
        return;
      }

      login(data.access, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Unable to connect to server");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl opacity-40 pointer-events-none"></div>

      {/* Logo */}
      <Link
        to="/"
        className="absolute top-6 right-6 text-[17px] font-semibold tracking-tight text-gray-800 hover:text-indigo-600 transition"
      >
        ReviewQR
      </Link>

      {/* Logging In Toast */}
      {loading && (
        <div className="
          absolute top-6 left-1/2 -translate-x-1/2
          bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg
          px-4 py-2 rounded-lg flex items-center gap-3 animate-fadeIn
        ">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-700">Logging in…</span>
        </div>
      )}

      {/* Login Card */}
      <div className="
        w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-2xl
        border border-gray-200 shadow-xl animate-fadeUp
      ">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 tracking-tight">
          Welcome Back
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="
                w-full px-4 py-3.5 rounded-lg border border-gray-300
                text-[15px] font-medium text-gray-900 placeholder-gray-400
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-all shadow-sm
              "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="
                w-full px-4 py-3.5 rounded-lg border border-gray-300
                text-[15px] font-medium text-gray-900 placeholder-gray-400
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-all shadow-sm
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 bg-indigo-600 text-white rounded-lg
              font-semibold text-base shadow-md
              hover:bg-indigo-700 active:scale-[.98]
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}