import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  ChartBarIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ slug, business }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const businessLinks = [
    { label: "Reviews", to: business ? `/reviews/${business}` : "#", icon: ChatBubbleLeftRightIcon },
    { label: "QR Code", to: slug ? `/business/${slug}/qr` : "#", icon: QrCodeIcon },
    { label: "Scans", to: slug ? `/scans/${slug}` : "#", icon: ChartBarIcon },
  ];

  const adminLinks = [
    ...(role?.toLowerCase() === "owner"
      ? [{ label: "Team Members", to: business ? `/admin/team/${business}` : "#", icon: UsersIcon }]
      : []),
    { label: "Settings", to: "/settings", icon: Cog6ToothIcon },
    { label: "Logout", to: "/login", icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <aside
      className="
        w-60 md:w-64 min-h-screen flex flex-col
        bg-[#F8F6FF]        /* <-- move purple background here */
                    border-r border-gray-200
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        px-4 py-5
        md:px-6 md:py-6
        space-y-6
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
          R
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900">
          ReviewQR
        </h1>
      </div>

      {/* Search */}
      <div className="px-1">
        <div
          className="
            flex items-center gap-2
            bg-gray-50
            rounded-lg px-3 py-2
            shadow-sm
            focus-within:ring-2 focus-within:ring-indigo-500
            transition-all
          "
        >
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-8 pb-6">

        {/* BUSINESS */}
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase mb-2 tracking-wide px-1">
            Business
          </p>

          <div className="space-y-1">
            {businessLinks.map((item) => (
              <NavLink key={item.label} to={item.to}>
                {({ isActive }) => (
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex items-center justify-center
                        w-8 h-8 rounded-lg
                        ${isActive
                          ? "bg-indigo-200 text-indigo-700"
                          : "bg-white text-gray-600 shadow-sm"
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                    </span>

                    <span className="truncate">{item.label}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ADMIN */}
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase mb-2 tracking-wide px-1">
            Admin
          </p>

          <div className="space-y-1">
            {adminLinks.map((item) => (
              <NavLink key={item.label} to={item.to}>
                {({ isActive }) => (
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex items-center justify-center
                        w-8 h-8 rounded-lg
                        ${isActive
                          ? "bg-indigo-200 text-indigo-700"
                          : "bg-white text-gray-600 shadow-sm"
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                    </span>

                    <span className="truncate">{item.label}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}