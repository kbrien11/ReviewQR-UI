import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  // Still loading session → show nothing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  // Not logged in → DO NOT redirect
  // The global LoggedOutModal will appear instead
  if (!token) {
    return null;
  }

  return children;
}