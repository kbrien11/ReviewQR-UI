import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any;
  token: string | null;
  role: string | null;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // Login
  const login = (token: string, user: any) => {
    const userRole = user?.role ?? null;

    setToken(token);
    setUser(user);
    setRole(userRole);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (userRole) localStorage.setItem("role", userRole);
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  // -----------------------------
  // ⭐ GLOBAL LOGGED-OUT MODAL
  // -----------------------------
  const LoggedOutModal = () => {
    const location = useLocation();

    const PUBLIC_ROUTES = [
      "/",
      "/login",
      "/register",
    ];

    // Routes that start with these prefixes are also public
    const PUBLIC_PREFIXES = [
      "/review/",      // leave review page
      "/business/",    // public QR page
    ];

    const isPublicRoute =
      PUBLIC_ROUTES.includes(location.pathname) ||
      PUBLIC_PREFIXES.some(prefix => location.pathname.startsWith(prefix));

    if (loading) return null;
    if (user) return null;
    if (isPublicRoute) return null;

    return (
      <div
        className="
          fixed inset-0 z-[9999]
          flex items-center justify-center
          px-6
          
        "
      >
        <div
          className="
            w-full max-w-sm
            bg-white/90 backdrop-blur-xl
            border border-gray-200/70
            shadow-xl
            rounded-2xl
            p-6
            text-center
            animate-fadeIn
          "
        >
          <h2 className="text-lg font-semibold text-gray-900">
            You’ve been logged out
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            Your session has ended. Please log in again to continue.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="
              mt-4 w-full
              bg-indigo-600 text-white
              py-2.5 rounded-xl
              font-medium text-sm
              shadow-sm
              active:scale-95 transition
            "
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        login,
        logout,
      }}
    >
      {/* GLOBAL LOGGED OUT MODAL */}
      <LoggedOutModal />

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}