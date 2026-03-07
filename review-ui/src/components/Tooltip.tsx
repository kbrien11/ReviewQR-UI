export function Tooltip({ label, children }) {
    return (
      <div className="relative group">
        {children}
  
        <div
          className="
            pointer-events-none
            absolute -bottom-10 left-1/2 -translate-x-1/2
            px-2.5 py-1.5
            rounded-xl
            bg-white/90 backdrop-blur-xl
            border border-white/60
            shadow-[0_2px_6px_rgba(0,0,0,0.08)]
            text-[11px] font-medium text-gray-700
            opacity-0 group-hover:opacity-100
            translate-y-1 group-hover:translate-y-0
            transition-all duration-200
            whitespace-nowrap
            z-50
          "
        >
          {label}
        </div>
      </div>
    );
  }