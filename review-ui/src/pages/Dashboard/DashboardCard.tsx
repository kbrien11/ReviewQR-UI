
  
 export default function DashboardCard({
    label,
    value,
    color,      // expects gradient classes like "from-blue-500 to-blue-600"
    icon,
    trend,
    trendColor,
    trendSymbol,
    delay = 0,
  }) {
    return (
      <div
        className={`
          p-5 rounded-2xl bg-white border border-gray-100 shadow-sm
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300
          animate-fadeInUp flex flex-col gap-3
        `}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Icon */}
        <div
          className={`
            w-12 h-12 rounded-xl bg-gradient-to-br ${color}
            text-white flex items-center justify-center text-2xl shadow-inner
          `}
        >
          {icon}
        </div>
  
        {/* Label */}
        <p className="text-gray-600 text-sm font-medium">{label}</p>
  
        {/* Value */}
        <p className="text-3xl font-extrabold text-gray-900 leading-none">
          {value}
        </p>
  
        {/* Trend */}
        {trend !== undefined && (
          <p className={`text-sm font-semibold ${trendColor}`}>
            {trendSymbol} {Math.abs(trend * 100).toFixed(1)}%
          </p>
        )}
      </div>
    );
  }