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

  useEffect(() => {
    fetch(`https://reviewqrapi.onrender.com/api/business/${slug}/qr/`)
      .then(res => res.json())
      .then(data => {
        setBusinessName(data.name);
        setQrCodeUrl(`https://reviewqrapi.onrender.com${data.qr_code}`);

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
      setQrCodeUrl(`https://reviewqrapi.onrender.com${updated.qr_code}`);
      setEditing(false);
    }
  };

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
        {!editing && (
          <div className="relative bg-white shadow-xl rounded-2xl p-8 border">

            {/* Edit Button */}
            <button
              onClick={() => setEditing(true)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow"
            >
              <PencilSquareIcon className="h-6 w-6 text-gray-700" />
            </button>

            <div className="flex flex-col items-center">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64 rounded-xl shadow-md border"
              />

              <p className="mt-4 text-gray-600 text-sm">
                Scan this QR code to view your review page
              </p>
            </div>
          </div>
        )}

        {/* EDIT PANEL */}
        {editing && (
          <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 border space-y-6 animate-slideDown">
            <h2 className="text-xl font-bold text-gray-800">
              Customize QR Styling
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Brand Color
                </label>
                <input
                  type="color"
                  value={brandColor}
                  onChange={e => setBrandColor(e.target.value)}
                  className="w-full h-12 rounded-lg border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Fill Color
                </label>
                <input
                  type="color"
                  value={fillColor}
                  onChange={e => setFillColor(e.target.value)}
                  className="w-full h-12 rounded-lg border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Background Color
                </label>
                <input
                  type="color"
                  value={backColor}
                  onChange={e => setBackColor(e.target.value)}
                  className="w-full h-12 rounded-lg border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Box Size
                </label>
                <input
                  type="number"
                  value={boxSize}
                  onChange={e => setBoxSize(Number(e.target.value))}
                  className="w-full h-12 rounded-lg border px-3"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Border Size
                </label>
                <input
                  type="number"
                  value={border}
                  onChange={e => setBorder(Number(e.target.value))}
                  className="w-full h-12 rounded-lg border px-3"
                />
              </div>
            </div>

            <button
              onClick={saveChanges}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}