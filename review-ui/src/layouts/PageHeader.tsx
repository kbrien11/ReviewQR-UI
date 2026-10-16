
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function PageHeader({ businessName, title }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Mobile header */}
        <div className="flex w-full items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={19} strokeWidth={2} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold tracking-tight text-gray-900">
              {businessName || "ReviewQR"}
            </p>

            {title && (
              <p className="mt-0.5 truncate text-xs font-medium text-gray-500">
                {title}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Go to ReviewQR home"
            className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <span>ReviewQR</span>
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden min-w-0 flex-1 items-center justify-between gap-6 md:flex">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <ArrowLeft
                size={19}
                strokeWidth={1.9}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight text-gray-900 lg:text-2xl">
                {businessName || "ReviewQR"}
              </h1>

              {title && (
                <p className="mt-1 truncate text-sm text-gray-500">
                  {title}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-label="Go to ReviewQR home"
          >
            <span>ReviewQR</span>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
