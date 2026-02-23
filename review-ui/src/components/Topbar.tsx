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
    <header
      className="
        h-16 px-6 flex items-center justify-between
        bg-white border-b border-gray-200
      "
    >
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-gray-900">
        Dashboard
      </h2>
  
      {/* Right: Actions */}
      <div className="flex items-center gap-6">
  
        {/* Logout Button — cleaner, calmer, more premium */}
        <button
          onClick={handleLogout}
          className="
            px-4 py-2 rounded-md text-sm font-medium
            bg-gray-100 text-gray-700
            hover:bg-gray-200 hover:text-gray-900
            transition-all shadow-sm
          "
        >
          Logout
        </button>
  
        {/* Avatar */}
        <div
          className="
            w-10 h-10 rounded-full bg-gray-100 border border-gray-300
            flex items-center justify-center text-gray-700 font-semibold
            shadow-sm
          "
        >
          {user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}