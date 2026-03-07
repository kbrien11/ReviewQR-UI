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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-indigo-50">

      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-indigo-300/25 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-purple-300/25 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div
        className="
          sticky top-0 z-50
          bg-white/80 backdrop-blur-xl
          border-b border-white/40
          px-5 py-4
          flex items-center justify-between
          shadow-[0_1px_3px_rgba(0,0,0,0.04)]
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
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Register
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-12 pb-24 w-full max-w-sm mx-auto">

        {/* Title */}
        <h1 className="text-[32px] font-semibold text-gray-900 text-center tracking-tight mb-8">
          Welcome Back
        </h1>

        {/* Card */}
        <div
          className="
            bg-white/90 backdrop-blur-2xl
            rounded-3xl
            shadow-[0_8px_32px_rgba(0,0,0,0.06)]
            border border-white/60
            p-7
          "
        >
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="
                  w-full px-4 py-3.5 rounded-2xl
                  bg-white/70 backdrop-blur-sm
                  border border-gray-200
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
                  w-full px-4 py-3.5 rounded-2xl
                  bg-white/70 backdrop-blur-sm
                  border border-gray-200
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
                w-full py-3.5 rounded-2xl
                bg-indigo-600 text-white
                font-semibold text-base shadow-md
                hover:bg-indigo-700 active:scale-[.98]
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Logging in…" : "Log In"}
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

      {/* Loading Toast */}
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