import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
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

  const fetchNewQrFromBackend = async () => {
    const res = await fetch(
      `https://reviewqrapi.onrender.com/api/business/${slug}/qr/`
    );

    const data = await res.json();

    return {
      qr_code_url: data.qr_code,
      fill: data.qr_fill_color,
      back: data.qr_back_color,
      box: data.qr_box_size,
      border: data.qr_border,
    };
  };

  console.log("QR URL:", qrCodeUrl);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOP HEADER — Vercel style */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">

          {/* Back + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <h1 className="text-2xl font-bold text-gray-900">
              {businessName} — QR Code
            </h1>
          </div>

          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 font-medium transition"
          >
            ReviewQR
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT — QR PREVIEW */}
        <div className="flex flex-col items-center">

          <div className="
            bg-white border border-gray-200 rounded-xl shadow-sm
            p-6 w-full flex flex-col items-center
          ">
            {editing ? (
              // LIVE REACTIVE QR PREVIEW
              <QRCodeCanvas
                value={`https://reviewqr.com/${slug}`}
                size={boxSize * 10}
                bgColor={backColor}
                fgColor={fillColor}
                level="H"
                includeMargin={true}
              />
            ) : (
              // STATIC BACKEND QR PNG
              qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64 rounded-lg border shadow-sm"
                />
              )
            )}

            <p className="mt-4 text-gray-600 text-sm text-center">
              {editing
                ? "Live preview — updates instantly"
                : "Scan this QR code to view your review page"}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">

            {/* Customize Button */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="
        px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold
        hover:bg-indigo-700 transition
      "
              >
                Customize QR Code
              </button>
            )}

            {/* Download Button */}
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = qrCodeUrl;
                link.download = `${slug}-qr.png`;
                link.click();
              }}
              className="
      inline-flex items-center gap-2
      px-4 py-3 rounded-lg
      border border-gray-300
      text-gray-700 font-medium
      bg-white
      hover:bg-gray-50 hover:border-gray-400
      active:scale-[.98]
      transition
    "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3"
                />
              </svg>
              Download QR
            </button>

          </div>
        </div>



        {/* RIGHT — EDITOR PANEL */}
        {editing && (
          <div className="
            bg-white border border-gray-200 rounded-xl shadow-sm p-6
            animate-fadeInUp
          ">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Customize QR</h2>

              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
              {[
                { id: "colors", label: "Colors" },
                { id: "sizes", label: "Sizes" },
                { id: "presets", label: "Presets" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition
                    ${activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-6">

              {/* COLORS */}
              {activeTab === "colors" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Brand Color</label>
                    <input
                      type="color"
                      value={brandColor}
                      onChange={e => setBrandColor(e.target.value)}
                      className="w-full h-12 rounded-md border cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Fill Color</label>
                    <input
                      type="color"
                      value={fillColor}
                      onChange={e => setFillColor(e.target.value)}
                      className="w-full h-12 rounded-md border cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Background Color</label>
                    <input
                      type="color"
                      value={backColor}
                      onChange={e => setBackColor(e.target.value)}
                      className="w-full h-12 rounded-md border cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* SIZES */}
              {activeTab === "sizes" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Box Size</label>
                    <input
                      type="number"
                      value={boxSize}
                      onChange={e => setBoxSize(Number(e.target.value))}
                      className="w-full h-12 rounded-md border px-3"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Border Size</label>
                    <input
                      type="number"
                      value={border}
                      onChange={e => setBorder(Number(e.target.value))}
                      className="w-full h-12 rounded-md border px-3"
                    />
                  </div>
                </div>
              )}

              {/* PRESETS */}
              {activeTab === "presets" && (
                <div className="grid grid-cols-2 gap-4">
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
                        p-4 rounded-md border bg-gray-50 hover:bg-gray-100
                        transition shadow-sm hover:shadow-md
                      "
                    >
                      <p className="font-medium text-gray-700">{preset.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={async () => {
                await saveChanges(); // your backend save
                const refreshed = await fetchNewQrFromBackend();
                setQrCodeUrl(refreshed.qr_code_url);
                setEditing(false);
              }}
              className="
                w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-semibold
                hover:bg-indigo-700 transition
              "
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}