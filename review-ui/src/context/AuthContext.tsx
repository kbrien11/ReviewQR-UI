import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any;
  token: string | null;
  role: string | null;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  apiOffline: boolean;
  setApiOffline: React.Dispatch<React.SetStateAction<boolean>>;
  apiBackendError: boolean;
  setApiBackendError: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiOffline, setApiOffline] = useState(false);
  const [apiBackendError, setApiBackendError] = useState(false);

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

  // ⭐ FIX: Memoize the entire context value
  const value = useMemo(
    () => ({
      user,
      token,
      role,
      loading,
      login,
      logout,
      apiOffline,
      setApiOffline,
      apiBackendError,
      setApiBackendError,
    }),
    [
      user,
      token,
      role,
      loading,
      apiOffline,
      apiBackendError,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}