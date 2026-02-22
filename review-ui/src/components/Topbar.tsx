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
      <div className="flex items-center gap-4">
  
        {/* Logout Button — subtle, Vercel style */}
        <button
          onClick={handleLogout}
          className="
            px-3 py-1.5 rounded-md text-sm font-medium
            bg-gray-100 text-gray-700
            hover:bg-gray-200 hover:text-gray-900
            transition-all
          "
        >
          Logout
        </button>
  
        {/* Avatar */}
        <div
          className="
            w-9 h-9 rounded-full bg-gray-100 border border-gray-300
            flex items-center justify-center text-gray-700 font-semibold
          "
        >
          {user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  )
}