import { Link } from "react-router-dom";

export default function PageHeader({ businessName, title }) {
  return (
    <header
      className="
        sticky top-0 z-50
        bg-white/70 backdrop-blur-xl
        border-b border-gray-200/70
        shadow-sm
      "
    >
      <div
        className="
          w-full
          px-4 sm:px-6 lg:px-12
          py-3 md:py-5
          max-w-full md:max-w-6xl lg:max-w-7xl xl:max-w-[1400px]
          mx-auto
          flex items-center justify-between
        "
      >

        {/* MOBILE HEADER — iOS Floating Glass */}
        <div className="md:hidden w-full px-4 pt-3 pb-2">
          <div
            className="
      relative mx-auto w-full
      rounded-[28px]
      bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(255,255,255,0.55))]
      backdrop-blur-2xl
      border border-white/40
      shadow-[0_4px_18px_rgba(0,0,0,0.06)]
      flex items-center justify-between
      px-3 py-2
    "
          >
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="
        h-10 w-10 flex items-center justify-center
        rounded-2xl
        bg-white/60 backdrop-blur-xl
        shadow-[0_2px_6px_rgba(0,0,0,0.08)]
        active:scale-95 transition
      "
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.8}
                stroke='currentColor'
                className='w-5 h-5 text-gray-700'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </button>

            {/* Centered Title */}
            <div className="flex flex-col items-center -ml-6">
              <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">
                {businessName}
              </h1>
              <span className="text-[11px] text-gray-500 font-medium">
                {title}
              </span>
            </div>

            {/* Placeholder for symmetry */}
            <div className="h-10 w-10"></div>
          </div>

          {/* Soft bottom divider glow */}
          <div className="h-[10px] w-full bg-gradient-to-b from-white/40 to-transparent -mt-1" />
        </div>

        {/* DESKTOP — left-aligned title */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="
              p-2 rounded-lg 
              hover:bg-gray-100 
              active:scale-95
              transition-all
              text-gray-600
              shadow-sm
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

        {/* Right Section */}
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