import { NavLink } from "react-router-dom";
import { useDashboardSummary } from "../pages/Dashboard/useDashboardSummary";

export default function Sidebar({slug}) {
  const { data } = useDashboardSummary();
 

  const links = [
    { label: "Reviews", to: `/reviews`, icon: "⭐" },
    { label: "QR Code", to: slug ? `/business/${slug}/qr` : "#", icon: "🔗" },
    { label: "Scans", to: slug ? `/scans/${slug}` : "#", icon: "📱" },

  ];

  return (
    <aside
      className="
        w-64 bg-white border-r border-gray-200
        flex flex-col h-screen
      "
    >
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          ReviewQR
        </h1>
      </div>
  
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                transition-all
  
                ${
                  isActive
                    ? "bg-gray-100 text-gray-900 border border-gray-300"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `
            }
          >
            {/* Icon */}
            <span className="text-lg text-gray-500">
              {item.icon}
            </span>
  
            {/* Label */}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}