import { useEffect, useState } from "react";

function DeviceRing({
    label,
    icon,
    value,
    total,
    from,
    to,
}: {
    label: string;
    icon: string;
    value: number;
    total: number;
    from: string;
    to: string;
}) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;

    const radius = 42;
    const circumference = 2 * Math.PI * radius;

    const [offset, setOffset] = useState(circumference);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const targetOffset = circumference - (percent / 100) * circumference;

        setTimeout(() => {
            setOffset(targetOffset);
        }, 150);

        let start = 0;
        const duration = 700;
        const step = 16;

        const interval = setInterval(() => {
            start += percent / (duration / step);
            if (start >= percent) {
                start = percent;
                clearInterval(interval);
            }
            setDisplayValue(Math.round(start));
        }, step);

        return () => clearInterval(interval);
    }, [percent]);

    return (
        <div
            className="
        flex flex-col items-center text-center
        bg-white/70 
        backdrop-blur-xl
        rounded-2xl p-5
        border border-gray-200/60 
        shadow-sm relative overflow-hidden
      "
        >
            <div
                className={`
          absolute inset-0 pointer-events-none opacity-0
          ${percent > 70 ? "animate-glowPulse" : ""}
          bg-gradient-to-br from-[${from}] to-[${to}]
          blur-3xl
        `}
            />

            <div className="text-3xl mb-3 animate-iconPop">{icon}</div>

            <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full rotate-[-90deg]">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="rgba(0,0,0,0.08)"
                        strokeWidth="10"
                        fill="none"
                    />

                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        stroke={`url(#grad-${label})`}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-[stroke-dashoffset] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                </svg>

                <svg width="0" height="0">
                    <defs>
                        <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={from} />
                            <stop offset="100%" stopColor={to} />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xl font-semibold text-gray-900 ">
                        {displayValue}%
                    </p>
                </div>
            </div>

            <p className="text-sm font-medium text-gray-700 ">
                {label}
            </p>
            <p className="text-lg font-bold text-gray-900 ">
                {value} scans
            </p>
        </div>
    );
}

export default DeviceRing;