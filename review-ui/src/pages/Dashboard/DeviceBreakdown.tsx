import { Link } from "react-router-dom";

export default function DeviceBreakdown({ data, slug }: { data: any; slug: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 animate-fadeInUp">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-lg font-bold">Device Breakdown</h2>

    <Link
      to={`/scans/${slug}`}
      className="
        px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md
        hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[.98]
        transition-all duration-200
      "
    >
      View More →
    </Link>
  </div>

  {/* Responsive grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

    {/* MOBILE */}
    <div
      className="
        p-5 rounded-xl bg-white border border-gray-100 shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300
        animate-slideIn flex items-center gap-4
      "
      style={{ animationDelay: "80ms" }}
    >
      <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl shadow-inner">
        📱
      </div>

      <div className="flex-1">
        <p className="text-gray-700 font-semibold">Mobile</p>
        <p className="text-2xl font-extrabold text-blue-600">{data.mobile || 0}</p>

        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                data.total_scans
                  ? ((data.mobile || 0) / data.total_scans) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>

    {/* DESKTOP */}
    <div
      className="
        p-5 rounded-xl bg-white border border-gray-100 shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300
        animate-slideIn flex items-center gap-4
      "
      style={{ animationDelay: "160ms" }}
    >
      <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl shadow-inner">
        💻
      </div>

      <div className="flex-1">
        <p className="text-gray-700 font-semibold">Desktop</p>
        <p className="text-2xl font-extrabold text-purple-600">{data.desktop || 0}</p>

        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                data.total_scans
                  ? ((data.desktop || 0) / data.total_scans) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>

  </div>
</div>
  );
}