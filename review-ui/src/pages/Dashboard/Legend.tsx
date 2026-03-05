export default function Legend({ label, value, color }) {
    return (
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${color}`} />
        <span className="text-gray-700 text-xs md:text-sm font-medium">{label}</span>
        <span className="text-gray-500 text-xs md:text-sm">{value}%</span>
      </div>
    );
  }