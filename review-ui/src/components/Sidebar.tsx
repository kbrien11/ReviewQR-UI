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
    <aside className="w-64 bg-white shadow-xl border-r flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-extrabold tracking-tight text-gray-800">
          ReviewQR
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}