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
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://reviewqrapi.onrender.com/auth/owner/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.message ||
            "Invalid username or password."
        );
        return;
      }

      if (!data.access || !data.user) {
        setError("Login response was incomplete. Please try again.");
        return;
      }

      login(data.access, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(
        "Unable to connect to the server. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f9ff] text-gray-900">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-indigo-300/25 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-300/20 blur-[120px]" />
        <div className="absolute -bottom-48 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-200/30 blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 flex items-center justify-between border-b border-gray-200/70 bg-white/75 px-5 py-4 backdrop-blur-xl sm:px-10">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-600/20 transition-transform group-hover:scale-105">
            R
          </div>

          <span className="text-xl font-bold tracking-tight">
            Review<span className="text-indigo-600">QR</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-gray-500 sm:inline">
            New to ReviewQR?
          </span>
          <Link
            to="/register"
            className="rounded-xl px-4 py-2.5 font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Login area */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center justify-center px-5 py-12 lg:px-10">
        <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Brand messaging */}
          <section className="hidden lg:block">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Your reputation, simplified
            </div>

            <h1 className="max-w-lg text-5xl font-bold leading-[1.12] tracking-tight">
              Turn every customer experience into an opportunity to{" "}
              <span className="text-indigo-600">grow.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-gray-600">
              Manage your review QR codes, understand customer feedback,
              and track your reputation from one simple dashboard.
            </p>

            {/* Feature highlights */}
            <div className="mt-9 space-y-4">
              {[
                {
                  icon: "✓",
                  title: "Branded QR codes",
                  description: "Make it easy for customers to find your review page.",
                },
                {
                  icon: "↗",
                  title: "Performance analytics",
                  description: "Understand scans and track your review activity.",
                },
                {
                  icon: "✦",
                  title: "AI-powered insights",
                  description: "Turn customer feedback into actionable insights.",
                },
              ].map((feature) => (
                <div key={feature.title} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-lg font-bold text-indigo-600 shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard preview */}
            <div className="mt-10 max-w-md rounded-2xl border border-white bg-white/80 p-5 shadow-xl shadow-indigo-900/5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Your reputation dashboard</p>
                  <p className="mt-1 text-lg font-bold">Everything in one place</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                  📊
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "QR Scans", value: "Track" },
                  { label: "Reviews", value: "Monitor" },
                  { label: "Insights", value: "Discover" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-gray-50 p-3"
                  >
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-1 text-sm font-bold text-indigo-600">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right: Login card */}
          <section className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-xl shadow-indigo-600/25 lg:mx-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    strokeLinecap="round"
                  />
                  <path d="M12 14v3" strokeLinecap="round" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back
              </h2>
              <p className="mt-3 text-gray-500">
                Sign in to manage your business reputation.
              </p>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-indigo-950/[0.07] backdrop-blur-2xl sm:p-9">
              {error && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 pr-20 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to your account
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 12h14m-6-6 6 6-6 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-gray-400">SECURE SIGN IN</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                  Create one for free
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
              By signing in, you can access your ReviewQR business dashboard.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}