
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import qrCartoon from "../../assets/qrCartoon.png";

export default function LandingHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), 100);
    return () => window.clearTimeout(timeout);
  }, []);

  const activity = [35, 52, 42, 68, 48, 82, 62];

  return (
    <section className="relative isolate overflow-hidden bg-[#F8F9FF] pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background effects */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div
        className={`mx-auto grid max-w-7xl items-center gap-14 px-6 transition-all duration-700 md:grid-cols-2 lg:gap-20 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-5 opacity-0"
        }`}
      >
        {/* Left: Hero copy */}
        <div className="text-center md:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Smarter review management
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Make every customer
            <span className="mt-2 block text-violet-600">
              interaction count.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 md:mx-0">
            Create branded QR codes, understand customer feedback,
            and track review activity across your locations — all
            in one simple dashboard.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl active:scale-[0.98]"
            >
              Get started free
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
            >
              See how it works
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Simple setup · Easy to use · Built for local businesses
          </p>

          {/* Small benefit list */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-slate-600 md:justify-start">
            <span className="flex items-center gap-2">
              <span className="font-bold text-violet-600">✓</span>
              Branded QR codes
            </span>
            <span className="flex items-center gap-2">
              <span className="font-bold text-violet-600">✓</span>
              Review analytics
            </span>
            <span className="flex items-center gap-2">
              <span className="font-bold text-violet-600">✓</span>
              Multiple locations
            </span>
          </div>
        </div>

        {/* Right: Dashboard preview */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-8 rounded-[2rem] bg-violet-300/40 blur-3xl" />

          <div className="relative rounded-3xl border border-white bg-white p-3 shadow-2xl shadow-slate-900/10 sm:p-5">
            {/* Dashboard header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
                  R
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    ReviewQR Dashboard
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Business overview
                  </p>
                </div>
              </div>

              <span className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
                Demo
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 py-5">
              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-sm text-slate-600">QR scans</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  1,284
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative data
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm text-slate-600">
                  Feedback received
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  186
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Illustrative data
                </p>
              </div>
            </div>

            {/* Activity chart */}
            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Review activity
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Last 7 days · Sample data
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3v18h18M7 14l4-4 4 3 5-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex h-32 items-end gap-3">
                {activity.map((height, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-t-lg transition-colors duration-300 hover:bg-violet-700 ${
                      index === 5
                        ? "bg-violet-600"
                        : "bg-violet-300"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  )
                )}
              </div>
            </div>

            {/* Bottom status */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-violet-600"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v1" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  Your QR codes, all in one place
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Make it easier for customers to share feedback.
                </p>
              </div>

              <span className="text-violet-600" aria-hidden="true">
                →
              </span>
            </div>
          </div>

          {/* Decorative QR illustration */}
          <img
            src={qrCartoon}
            alt=""
            aria-hidden="true"
            className="absolute -bottom-10 -right-5 hidden w-28 drop-shadow-xl lg:block"
          />
        </div>
      </div>
    </section>
  );
}
