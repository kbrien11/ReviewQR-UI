
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";

interface PageHeaderProps {
  businessName?: string;
  title?: string;
}

export default function PageHeader({
  businessName,
  title,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Left: Back button + page identity */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft
              size={18}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
          </button>

          <div className="h-9 w-px shrink-0 bg-slate-200" />

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-[15px] font-bold tracking-tight text-slate-900 sm:text-[17px]">
                {businessName || "ReviewQR"}
              </h1>
            </div>

            {title && (
              <p className="mt-1 truncate text-xs font-medium tracking-wide text-slate-500 sm:text-[13px]">
                {title}
              </p>
            )}
          </div>
        </div>

        {/* Right: Brand link */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to ReviewQR home"
          className="group ml-3 inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white py-2 pl-2 pr-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:pl-2.5 sm:pr-4"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/20">
            <Sparkles size={14} strokeWidth={2.2} />
          </span>

          <span>ReviewQR</span>

          <ArrowUpRight
            size={15}
            className="text-slate-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600"
          />
        </button>
      </div>
    </header>
  );
}
