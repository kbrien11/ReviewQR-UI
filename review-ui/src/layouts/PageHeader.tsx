import { Link } from "react-router-dom";

export default function PageHeader({ businessName, title }) {
  return (
    <header
      className="
        sticky top-0 z-50
        bg-white/80 backdrop-blur-xl
        border-b border-gray-200
        px-4 py-3 md:px-6 md:py-5
        shadow-sm
      "
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* MOBILE LAYOUT — centered title, app-like */}
        <div className="flex md:hidden items-center justify-between w-full">

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="
              h-10 w-10 flex items-center justify-center
              rounded-xl bg-gray-100 text-gray-700
              active:scale-95 transition
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Centered Title */}
          <div className="flex flex-col items-center -ml-10">
            <h1 className="text-base font-semibold text-gray-900 leading-tight">
              {businessName}
            </h1>
            <span className="text-[11px] text-gray-500 font-medium">
              {title}
            </span>
          </div>

          {/* Placeholder for symmetry */}
          <div className="h-10 w-10"></div>
        </div>

        {/* DESKTOP LAYOUT — original design */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="
              p-2 rounded-lg 
              hover:bg-gray-100 
              active:scale-95
              transition-all
              text-gray-600
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <div className="flex flex-col leading-tight">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {businessName}
            </h1>
            <span className="text-sm text-gray-500 font-medium mt-0.5">
              {title}
            </span>
          </div>
        </div>

        {/* Right Section (desktop only) */}
        <Link
          to="/"
          className="
            hidden md:block
            text-base text-gray-600 
            hover:text-gray-900 
            font-medium tracking-tight
            transition
          "
        >
          ReviewQR
        </Link>
      </div>
    </header>
  );
}