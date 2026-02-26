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
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const businessLinks = [
    {
      label: "Reviews",
      to: business ? `/reviews/${business}` : "#",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: "QR Code",
      to: slug ? `/business/${slug}/qr` : "#",
      icon: QrCodeIcon,
    },
    {
      label: "Scans",
      to: slug ? `/scans/${slug}` : "#",
      icon: ChartBarIcon,
    },
  ];

  const adminLinks = [];

  if (role?.toLowerCase() === "owner") {
    adminLinks.push({
      label: "Team Members",
      to: business ? `/admin/team/${business}` : "#",
      icon: UsersIcon,
    });
  }

  adminLinks.push(
    {
      label: "Settings",
      to: "/settings",
      icon: Cog6ToothIcon,
    },
    {
      label: "Logout",
      to: "/login",
      icon: ArrowRightOnRectangleIcon,
    }
  );

  return (
    <aside
      className="
        w-64 min-h-screen flex flex-col
        bg-[#F8F6FF]
        border-r border-gray-200
      "
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <div
          className="
            w-9 h-9 rounded-xl
            bg-indigo-600 text-white
            flex items-center justify-center
            text-lg font-bold
            shadow-sm
          "
        >
          R
        </div>

        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          ReviewQR
        </h1>
      </div>

      {/* Search + Avatar Wrapper */}
      <div className="px-4 pt-4 space-y-3">

        {/* Search Bar */}
        <div
          className="
    flex items-center gap-2
    bg-white border border-gray-200
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
            className="
      w-full bg-transparent outline-none text-sm
      placeholder-gray-400
    "
          />
        </div>

        
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-6">

        {/* BUSINESS SECTION */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">
            Business
          </p>

          <div className="space-y-1">
            {businessLinks.map((item) => (
              <NavLink key={item.label} to={item.to}>
                {({ isActive }) => (
                  <div
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
                      cursor-pointer transition-all duration-200
                      ${isActive
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex items-center justify-center
                        w-8 h-8 rounded-lg
                        ${isActive
                          ? "bg-indigo-200 text-indigo-700"
                          : "bg-white text-gray-600 border border-gray-200"
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                    </span>

                    <span>{item.label}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ADMIN SECTION */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">
            Admin
          </p>

          <div className="space-y-1">
            {adminLinks.map((item) => (
              <div
                key={item.label}
                onClick={item.onClick}
              >
                <NavLink to={item.to}>
                  {({ isActive }) => (
                    <div
                      className={`
                        flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
                        cursor-pointer transition-all duration-200
                        ${isActive
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm"
                          : "text-gray-700 hover:bg-white hover:shadow-sm"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex items-center justify-center
                          w-8 h-8 rounded-lg
                          ${isActive
                            ? "bg-indigo-200 text-indigo-700"
                            : "bg-white text-gray-600 border border-gray-200"
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                      </span>

                      <span>{item.label}</span>
                    </div>
                  )}
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}