import { Link } from "react-router-dom";

export default function PageHeader({ businessName, title }) {
  return (
    <header
      className="
        bg-white 
        border-b border-gray-200 
        px-6 py-5
        backdrop-blur-xl
      "
    >
      <div className="max-w-5xl mx-auto flex justify-between items-center">

        {/* Left Section: Back + Title */}
        <div className="flex items-center gap-4">

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="
              p-2 rounded-md 
              hover:bg-gray-100 
              transition-all 
              active:scale-95
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

          {/* Title */}
          <div className="flex flex-col">
            <h1
              className="
                text-xl md:text-2xl 
                font-semibold 
                text-gray-900 
                tracking-tight
              "
            >
              {businessName}
            </h1>

            <span
              className="
                text-sm 
                text-gray-500 
                font-medium 
                mt-0.5
              "
            >
              {title}
            </span>
          </div>
        </div>

        {/* Right Section: Brand */}
        <Link
          to="/"
          className="
            text-gray-600 
            hover:text-gray-900 
            font-medium 
            tracking-tight
            transition
          "
        >
          ReviewQR
        </Link>
      </div>
    </header>
  );
}