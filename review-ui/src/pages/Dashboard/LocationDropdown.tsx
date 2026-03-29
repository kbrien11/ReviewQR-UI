import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LocationDropdown({ onSelect }) {
  const { token, setApiOffline,setApiBackendError } = useAuth();
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/locations/", {
          method: "GET",
          credentials: "include", // sends JWT cookie automatically
          headers:{
            Authorization: `Bearer ${token}` ,
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
      <select
        value={selected}
        onChange={handleChange}
        className="
          px-4 py-2
          rounded-xl
          bg-white/80 backdrop-blur-md
          border border-gray-300
          shadow-sm
          text-sm md:text-base
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition-all
        "
      >
        <option value="">All Locations</option>

        {locations.map((loc, index) => (
          <option key={index} value={loc?.address}>
            {loc?.address}
          </option>
        ))}
      </select>
    </div>
  );
}