import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function TopBar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>

      <div className="flex items-center gap-4">

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            px-4 py-2 rounded-lg font-semibold text-gray-700
            bg-gray-100 hover:bg-gray-200 hover:text-gray-900
            transition-all duration-200 shadow-sm hover:shadow-md
            flex items-center gap-2
          "
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
          {user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}