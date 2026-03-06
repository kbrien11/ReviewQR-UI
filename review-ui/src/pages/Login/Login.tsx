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
    <div
      className="
        min-h-screen relative overflow-hidden
        bg-gradient-to-b from-gray-50 to-gray-100
        dark:from-gray-900 dark:to-black
        flex flex-col
      "
    >
      {/* Parallax Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/30 dark:bg-indigo-500/20 blur-[120px] rounded-full animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-300/30 dark:bg-purple-500/20 blur-[120px] rounded-full animate-float-slower" />
      </div>

      {/* Header */}
      <div
        className="
          sticky top-0 z-40
          bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl
          border-b border-gray-200 dark:border-gray-700
          px-5 py-4
          flex items-center justify-between
        "
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            R
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            ReviewQR
          </span>
        </Link>

        <Link
          to="/register"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          Register
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div
          className="
            w-full max-w-sm
            bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl
            border border-gray-200/70 dark:border-gray-700
            shadow-[0_8px_30px_rgba(0,0,0,0.06)]
            rounded-3xl
            p-8
            animate-fadeIn
          "
        >
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
            Welcome Back
          </h1>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Floating Label Input */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  peer w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-700
                  bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm
                  text-[15px] font-medium text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all shadow-sm
                "
              />
              <label
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-500 dark:text-gray-400
                  pointer-events-none
                  transition-all duration-200
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                  peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs
                "
              >
                Username
              </label>
            </div>

            {/* Floating Label Input */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  peer w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-700
                  bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm
                  text-[15px] font-medium text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all shadow-sm
                "
              />
              <label
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-500 dark:text-gray-400
                  pointer-events-none
                  transition-all duration-200
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                  peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs
                "
              >
                Password
              </label>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 rounded-xl
                bg-indigo-600 text-white
                font-semibold text-base
                shadow-md
                hover:bg-indigo-700 active:scale-[.98]
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* FaceID-style loading pulse */}
      {loading && (
        <div
          className="
            fixed inset-0 flex items-center justify-center
            pointer-events-none
            animate-faceid-pulse
          "
        >
          <div className="w-24 h-24 rounded-3xl border-4 border-indigo-500/40" />
        </div>
      )}
    </div>
  );
}