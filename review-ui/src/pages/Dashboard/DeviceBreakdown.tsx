import { Link } from "react-router-dom";

export default function DeviceBreakdown({ data, slug }: { data: any; slug: string }) {
  return (
    <div className="
      bg-white p-4 md:p-6 rounded-xl
      border border-gray-200 shadow-sm
      animate-fadeInUp
    ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Device Breakdown</h2>
  
        <Link
          to={`/scans/${slug}`}
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          View More →
        </Link>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  
        {/* MOBILE */}
        <div className="
          p-4 rounded-lg bg-white border border-gray-200 shadow-sm
          hover:shadow-md transition-all
          flex flex-col sm:flex-row sm:items-center gap-3
        ">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl text-gray-700">
            📱
          </div>
  
          <div className="flex-1">
            <p className="text-gray-700 font-medium">Mobile</p>
            <p className="text-xl font-bold text-gray-900">{data.mobile || 0}</p>
  
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
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
        <div className="
          p-4 rounded-lg bg-white border border-gray-200 shadow-sm
          hover:shadow-md transition-all
          flex flex-col sm:flex-row sm:items-center gap-3
        ">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl text-gray-700">
            💻
          </div>
  
          <div className="flex-1">
            <p className="text-gray-700 font-medium">Desktop</p>
            <p className="text-xl font-bold text-gray-900">{data.desktop || 0}</p>
  
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
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
  )
}