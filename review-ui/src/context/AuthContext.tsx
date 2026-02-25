import { createContext, useContext, useState, useEffect } from "react";

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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem('role')

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);

    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  const login = (token: string, user: any , role:string) => {

    const userData = user;
    const userRole = userData.role
    setToken(token);
    setUser(user);
    setRole(userRole)
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}