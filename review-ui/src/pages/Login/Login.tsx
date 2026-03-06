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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl opacity-40 pointer-events-none" />

      {/* MOBILE / DESKTOP HEADER */}
      <div
        className="
          sticky top-0 z-50
          bg-white/70 backdrop-blur-xl
          border-b border-gray-200
          px-4 py-4
          flex items-center justify-between
          shadow-sm
        "
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            R
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            ReviewQR
          </span>
        </Link>

        <Link
          to="/register"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Register
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-5 pt-10 pb-24 w-full max-w-sm mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center tracking-tight mb-8">
          Welcome Back
        </h1>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6">

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="
                  w-full px-4 py-3.5 rounded-xl border border-gray-300
                  text-[15px] font-medium text-gray-900 placeholder-gray-400
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all shadow-sm
                "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="
                  w-full px-4 py-3.5 rounded-xl border border-gray-300
                  text-[15px] font-medium text-gray-900 placeholder-gray-400
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all shadow-sm
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 rounded-xl bg-indigo-600 text-white
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

      {/* LOADING TOAST */}
      {loading && (
        <div
          className="
            fixed left-1/2 -translate-x-1/2
            top-[70px]
            z-50
            bg-indigo-600 text-white
            px-4 py-2 rounded-xl shadow-lg
            text-sm font-medium
            animate-fadeIn
          "
        >
          Logging in…
        </div>
      )}
    </div>
  );
}