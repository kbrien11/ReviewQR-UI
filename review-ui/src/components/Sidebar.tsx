import { useMemo, useState } from "react";
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
  CreditCardIcon,
  GiftIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  ChevronRightIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ slug, business, onNavigate }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const isOwner = role?.toLowerCase() === "owner";

  const businessLinks = [
    {
      label: "Overview",
      to: "/dashboard",
      icon: Squares2X2Icon,
    },
    {
      label: "Reviews",
      to: business ? `/reviews/${business}` : "/reviews",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: "QR Code",
      to: slug ? `/business/${slug}/qr` : "/qr",
      icon: QrCodeIcon,
    },
    {
      label: "Scans & Analytics",
      to: slug ? `/scans/${slug}` : "/scans",
      icon: ChartBarIcon,
    },
  ];

  const adminLinks = [
    ...(isOwner
      ? [
          {
            label: "Team Members",
            to: business ? `/admin/team/${business}` : "/admin/team",
            icon: UsersIcon,
          },
          {
            label: "Plan & Billing",
            to: business ? `/admin/plan/${business}` : "/admin/plan",
            icon: CreditCardIcon,
          },
          {
            label: "Rewards",
            to: "/admin/reward",
            icon: GiftIcon,
          },
        ]
      : []),
    {
      label: "Settings",
      to: "/settings",
      icon: Cog6ToothIcon,
    },
    {
      label: "About ReviewQR",
      to: "/about",
      icon: BuildingStorefrontIcon,
    },
  ];

  const filterLinks = (links) => {
    const query = search.trim().toLowerCase();
    if (!query) return links;

    return links.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  };

  const filteredBusinessLinks = useMemo(
    () => filterLinks(businessLinks),
    [search, slug, business]
  );

  const filteredAdminLinks = useMemo(
    () => filterLinks(adminLinks),
    [search, business, isOwner]
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const renderLink = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.label}
        to={item.to}
        end={item.to === "/dashboard"}
        onClick={onNavigate}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-indigo-600" />
            )}

            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                  : "bg-transparent text-gray-400 group-hover:bg-white group-hover:text-gray-700"
              }`}
            >
              <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>

            <span className="min-w-0 flex-1 truncate">{item.label}</span>

            {isActive && (
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-indigo-400" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-gray-200/80 bg-white">
      {/* Brand */}
      <div className="px-5 pb-6 pt-6">
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="group inline-flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-transform duration-200 group-hover:scale-105">
            <span className="text-lg font-bold tracking-tight">R</span>
          </div>

          <div>
            <h1 className="text-[17px] font-bold tracking-tight text-gray-950">
              Review<span className="text-indigo-600">QR</span>
            </h1>
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-gray-400">
              CUSTOMER INSIGHTS
            </p>
          </div>
        </NavLink>
      </div>

      {/* Business context */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/80 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200/70">
            <BuildingStorefrontIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
              {typeof business === "string" && business
                ? `Business ${business}`
                : "Your business"}
            </p>
          </div>

          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50">
          <MagnifyingGlassIcon className="h-[18px] w-[18px] shrink-0 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a page..."
            aria-label="Search navigation"
            className="w-full min-w-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-7 overflow-y-auto px-3 pb-6"
      >
        {filteredBusinessLinks.length > 0 && (
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
              Workspace
            </p>

            <div className="space-y-1">
              {filteredBusinessLinks.map(renderLink)}
            </div>
          </div>
        )}

        {filteredAdminLinks.length > 0 && (
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
              Manage
            </p>

            <div className="space-y-1">
              {filteredAdminLinks.map(renderLink)}
            </div>
          </div>
        )}

        {filteredBusinessLinks.length === 0 &&
          filteredAdminLinks.length === 0 && (
            <div className="px-3 py-8 text-center">
              <MagnifyingGlassIcon className="mx-auto h-7 w-7 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-700">
                No pages found
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Try a different search.
              </p>
            </div>
          )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 p-4">
        <div className="mb-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
              <ChartBarIcon className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-gray-800">
              Grow with customer feedback
            </p>
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            Turn customer reviews into actionable insights for your business.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition group-hover:bg-white group-hover:text-rose-600">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </span>
          <span>Sign out</span>
        </button>

        <p className="mt-3 text-center text-[10px] text-gray-400">
          ReviewQR · Customer insights
        </p>
      </div>
    </aside>
  );
}