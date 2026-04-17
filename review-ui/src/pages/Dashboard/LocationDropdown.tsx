import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LocationDropdown({ onSelect,selected }) {
    const { token, setApiOffline, setApiBackendError } = useAuth();
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelected] = useState("");

    // Sync parent-selected value into internal state
useEffect(() => {
    if (selected) {
      setSelected(selected);
    }
  }, [selected]);

    useEffect(() => {
        async function fetchLocations() {
            try {
                const res = await fetch("https://reviewqrapi.onrender.com/api/locations/", {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Failed to fetch locations");
                    return;
                }

                const data = await res.json();
                setLocations(data.locations || []);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        }

        fetchLocations();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setSelected(value);

        if (onSelect) {
            onSelect(value); // send selected address or slug to parent
        }
    };

    return (
        <div className="mt-2 font-[Inter]">
            <div
                className="
                        relative
                        rounded-2xl
                        bg-white/60
                        backdrop-blur-2xl
                        border border-white/40
                        shadow-[0_8px_28px_rgba(0,0,0,0.08)]
                        hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]
                        transition-all
                        active:scale-[0.98]
                        "
            >
                <select
                    value={selectedLocation}
                    onChange={handleChange}
                    className="
        w-full
        appearance-none
        px-4 py-3
        bg-transparent
        text-slate-900
        text-sm md:text-base
        font-semibold
        tracking-tight
        rounded-2xl
        focus:outline-none
        cursor-pointer
      "
                >
                    <option
                        value=""
                        className="text-[#6A0DAD] font-semibold bg-[#6A0DAD]/10"
                    >
                        All Locations
                    </option>

                    {locations.map((loc, index) => (
                        <option
                            key={index}
                            value={loc?.address}
                            className="text-slate-700"
                        >
                            {loc?.address}
                        </option>
                    ))}
                </select>

                {/* Chevron */}
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                        className="w-4 h-4 text-slate-700 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </div>
        </div>
    );
}