
  
  export default function DashboardCard({ label, value, icon, color, trend }: Props) {
    const trendColor = trend === undefined ? "text-gray-400" : trend >= 0 ? "text-green-600" : "text-red-600";
    const trendSymbol = trend === undefined ? "" : trend >= 0 ? "▲" : "▼";
  
    return (
      <div className={`p-5 rounded-xl shadow-lg text-white ${color} animate-fadeInUp`}>
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm opacity-80">{label}</p>
          {icon}
        </div>
        <p className="text-3xl font-extrabold">{value}</p>
        {trend !== undefined && (
          <p className={`text-sm mt-1 ${trendColor}`}>
            {trendSymbol} {Math.abs(trend * 100).toFixed(1)}%
          </p>
        )}
      </div>
    );
  }