import { Link } from "react-router-dom";

export default function DeviceBreakdown({ data, slug }: { data: any; slug: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-fadeInUp">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Device Breakdown</h2>
        <Link
          to={`/scans/${slug}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[.98] transition-all duration-200"
        >
          View More →
        </Link>
      </div>

      <div className="flex justify-around text-center">
        <div>
          <p className="text-3xl font-bold text-blue-600">{data.mobile || 0}</p>
          <p className="text-gray-600">📱 Mobile</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-purple-600">{data.desktop || 0}</p>
          <p className="text-gray-600">💻 Desktop</p>
        </div>
      </div>
    </div>
  );
}