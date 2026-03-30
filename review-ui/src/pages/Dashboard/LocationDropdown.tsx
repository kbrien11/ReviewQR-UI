import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LocationDropdown({ onSelect }) {
    const { token, setApiOffline, setApiBackendError } = useAuth();
    const [locations, setLocations] = useState([]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        async function fetchLocations() {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/locations/", {
                    method: "GET",
                    credentials: "include", // sends JWT cookie automatically
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
        <div className="mt-2">
            <div
                className="
          relative
          rounded-2xl
          bg-white/60
          backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_20px_rgba(0,0,0,0.06)]
          transition-all
          hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]
          active:scale-[0.99]
        "
            >
                <select
                    value={selected}
                    onChange={handleChange}
                    className="
            w-full
            appearance-none
            px-4 py-3
            bg-transparent
            text-gray-800
            text-sm md:text-base
            font-medium
            rounded-2xl
            focus:outline-none
            cursor-pointer
          "
                >
                    <option value="">All Locations</option>

                    {locations.map((loc, index) => (
                        <option key={index} value={loc?.address}>
                            {loc?.address}
                        </option>
                    ))}
                </select>

                {/* iOS-style dropdown arrow */}
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                        className="w-4 h-4 text-gray-500"
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