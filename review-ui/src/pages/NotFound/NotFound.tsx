
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  ShieldAlert,
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gray-50 px-6 py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-xl text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-100 bg-white shadow-lg shadow-indigo-100/50">
          <ShieldAlert className="h-9 w-9 text-indigo-600" />
        </div>

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
          Error 404
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Lost your way?
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-500 sm:text-lg">
          We couldn't find the page you're looking for. It may have
          been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Decorative 404 */}
        <div className="my-10 select-none text-8xl font-black tracking-tighter text-indigo-100 sm:text-9xl">
          404
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            <Home className="h-4 w-4" />
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Search className="h-4 w-4" />
          <span>Double-check the URL and try again.</span>
        </div>
      </div>
    </div>
  );
}
