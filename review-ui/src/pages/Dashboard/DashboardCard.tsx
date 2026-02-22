
  
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
          p-5 rounded-xl bg-white border border-gray-200
          shadow-sm hover:shadow-md hover:-translate-y-[2px]
          transition-all duration-300 animate-fadeInUp
          flex flex-col gap-2
        `}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Optional Icon */}
        {icon && (
          <div
            className="
              w-10 h-10 rounded-lg bg-gray-100 text-gray-700
              flex items-center justify-center text-xl
            "
          >
            {icon}
          </div>
        )}
    
        {/* Label */}
        <p className="text-gray-600 text-sm font-medium">{label}</p>
    
        {/* Value */}
        <p className="text-3xl font-bold text-gray-900 leading-none tracking-tight">
          {value}
        </p>
    
        {/* Trend */}
        {trend !== undefined && (
          <p className={`text-sm font-semibold ${trendColor}`}>
            {trendSymbol} {Math.abs(trend * 100).toFixed(1)}%
          </p>
        )}
      </div>
    )
  }