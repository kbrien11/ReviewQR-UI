import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";


export default function BusinessQRPage() {
  const { slug } = useParams();

  const [businessName, setBusinessName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [editing, setEditing] = useState(false);

  const [brandColor, setBrandColor] = useState("");
  const [fillColor, setFillColor] = useState("");
  const [backColor, setBackColor] = useState("");
  const [boxSize, setBoxSize] = useState(10);
  const [border, setBorder] = useState(4);
  const [activeTab, setActiveTab] = useState("colors");

  useEffect(() => {
    fetch(`https://reviewqrapi.onrender.com/api/business/${slug}/qr/`)
      .then(res => res.json())
      .then(data => {
        setBusinessName(data.name);
        setQrCodeUrl(data.qr_code);

        setBrandColor(data.brand_color);
        setFillColor(data.qr_fill_color);
        setBackColor(data.qr_back_color);
        setBoxSize(data.qr_box_size);
        setBorder(data.qr_border);
      });
  }, [slug]);

  const saveChanges = async () => {
    const response = await fetch(
      `https://reviewqrapi.onrender.com/api/business/${slug}/qr/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_color: brandColor,
          qr_fill_color: fillColor,
          qr_back_color: backColor,
          qr_box_size: boxSize,
          qr_border: border,
        }),
      }
    );

    if (response.ok) {
      const updated = await response.json();
      setQrCodeUrl(updated.qr_code);
      setEditing(false);
    }
  };

  console.log("QR URL:", qrCodeUrl);

  return (
    <div className="pb-20">

      {/* MATCHING ANALYTICS HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 shadow-xl rounded-b-3xl">

        <div className="flex justify-between items-center">

          {/* LEFT SIDE: Back Button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <h1 className="text-3xl font-extrabold tracking-tight">
              {businessName} QR Code
            </h1>
          </div>

          {/* RIGHT SIDE: ReviewQR Link */}
          <Link
            to="/"
            className="text-white/80 hover:text-white hover:scale-105 transition-all font-semibold"
          >
            ReviewQR
          </Link>
        </div>

        <p className="mt-2 text-slate-300">
          Customize your QR code to match your brand
        </p>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-2xl mx-auto mt-10 px-4">

        {/* QR PREVIEW (HIDDEN WHEN EDITING) */}
        {!editing && qrCodeUrl && (
          <div
            className="
      relative bg-white rounded-3xl p-8 border shadow-xl
      animate-fadeInUp transition-all duration-500
    "
          >
            {/* Glow Accent */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none"></div>

            {/* Edit Button */}
            <button
              onClick={() => setEditing(true)}
              className="
        absolute top-4 right-4 p-3 rounded-full bg-white/70 backdrop-blur-md
        hover:bg-white hover:shadow-lg hover:scale-105
        transition-all duration-300
      "
            >
              <PencilSquareIcon className="h-6 w-6 text-gray-700" />
            </button>

            <div className="flex flex-col items-center">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="
          w-64 h-64 rounded-2xl shadow-lg border
          transition-all duration-500 hover:scale-[1.02]
        "
              />

              <p className="mt-5 text-gray-600 text-sm text-center">
                Scan this QR code to view your review page
              </p>
            </div>
          </div>
        )}

        {/* EDIT PANEL */}
        {editing && (
          <div
            className="
      mt-8 bg-white rounded-3xl p-6 border shadow-xl
      animate-slideDown transition-all duration-500
    "
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Customize QR Styling</h2>

              {/* Close Button */}
              <button
                onClick={() => setEditing(false)}
                className="
          px-3 py-1 rounded-lg bg-gray-100 text-gray-700
          hover:bg-gray-200 hover:shadow-sm transition-all
        "
              >
                Close
              </button>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: "colors", label: "Colors" },
                { id: "sizes", label: "Sizes" },
                { id: "presets", label: "Presets" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
            px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all
            ${activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md scale-[1.03]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
          `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}

            {/* COLORS TAB */}
            {activeTab === "colors" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand Color</label>
                  <input
                    type="color"
                    value={brandColor}
                    onChange={e => setBrandColor(e.target.value)}
                    className="w-full h-12 rounded-lg border cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Fill Color</label>
                  <input
                    type="color"
                    value={fillColor}
                    onChange={e => setFillColor(e.target.value)}
                    className="w-full h-12 rounded-lg border cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Background Color</label>
                  <input
                    type="color"
                    value={backColor}
                    onChange={e => setBackColor(e.target.value)}
                    className="w-full h-12 rounded-lg border cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* SIZES TAB */}
            {activeTab === "sizes" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
                <div>
                  <label className="text-sm font-medium text-gray-700">Box Size</label>
                  <input
                    type="number"
                    value={boxSize}
                    onChange={e => setBoxSize(Number(e.target.value))}
                    className="w-full h-12 rounded-lg border px-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Border Size</label>
                  <input
                    type="number"
                    value={border}
                    onChange={e => setBorder(Number(e.target.value))}
                    className="w-full h-12 rounded-lg border px-3"
                  />
                </div>
              </div>
            )}

            {/* PRESETS TAB */}
            {activeTab === "presets" && (
              <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                {[
                  { name: "Minimal", brand: "#000000", fill: "#000000", back: "#FFFFFF" },
                  { name: "Ocean", brand: "#2563eb", fill: "#1e40af", back: "#eff6ff" },
                  { name: "Sunset", brand: "#f97316", fill: "#ea580c", back: "#fff7ed" },
                  { name: "Forest", brand: "#16a34a", fill: "#15803d", back: "#f0fdf4" },
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setBrandColor(preset.brand);
                      setFillColor(preset.fill);
                      setBackColor(preset.back);
                    }}
                    className="
              p-4 rounded-xl border bg-gray-50 hover:bg-gray-100
              transition-all shadow-sm hover:shadow-md
            "
                  >
                    <p className="font-semibold text-gray-700">{preset.name}</p>
                  </button>
                ))}
              </div>
            )}

            {/* SAVE BUTTON */}
            <button
              onClick={saveChanges}
              className="
        w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold
        hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.01]
        active:scale-[.99] transition-all duration-300
      "
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}