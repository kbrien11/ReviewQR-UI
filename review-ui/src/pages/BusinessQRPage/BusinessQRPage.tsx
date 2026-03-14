import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";
import StyledQRPreview from "../../components/StyledQRPreview";


export default function BusinessQRPage() {
  const { slug } = useParams();

  const [businessName, setBusinessName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [brandColor, setBrandColor] = useState("#000000");
const [fillColor, setFillColor] = useState("#000000");
const [backColor, setBackColor] = useState("#FFFFFF");
const [boxSize, setBoxSize] = useState(10);
const [border, setBorder] = useState(4);
const [qrShape, setQrShape] = useState("rectangle");
const [activeTab, setActiveTab] = useState("colors");


  useEffect(() => {
    fetch(`https://reviewqrapi.onrender.com/api/business/${slug}/qr/`)
      .then(res => res.json())
      .then(data => {
        setBusinessName(data.name);
        setQrCodeUrl(`${data.qr_code}?t=${Date.now()}`);
        setQrShape(data.qr_shape)
        setBrandColor(data.brand_color);
        setFillColor(data.qr_fill_color);
        setBackColor(data.qr_back_color);
        setBoxSize(data.qr_box_size);
        setBorder(data.qr_border);
      });
  }, []);



  const saveChanges = async (payload) => {
    setSaving(true);

    try {
      const response = await fetch(
        `https://reviewqrapi.onrender.com/api/business/${slug}/qr/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setQrCodeUrl(updated.qr_code);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const fetchNewQrFromBackend = async () => {
    const res = await fetch(
      `https://reviewqrapi.onrender.com/api/business/${slug}/qr/`
    );

    const data = await res.json();

    return {
      qr_code_url: `${data.qr_code}?t=${Date.now()}`,
      fill: data.qr_fill_color,
      back: data.qr_back_color,
      box: data.qr_box_size,
      border: data.qr_border,
      shape: data.qr_shape
    };
  };

  // 1. State that holds the live props for the preview
  const [previewProps, setPreviewProps] = useState({
    fill: fillColor || brandColor,
    back: backColor || "#FFFFFF",
    brand: brandColor,
    text: businessName,
    size: boxSize || 20,
    border: border || 4,
    slug,
    shape: qrShape
  });

  // 2. Update previewProps whenever UI changes
  useEffect(() => {
    setPreviewProps({
      fill: fillColor || brandColor,
      back: backColor || "#FFFFFF",
      brand: brandColor,
      text: businessName,
      size: boxSize || 20,
      border: border || 4,
      slug,
      shape: qrShape
    });
  }, [
    fillColor,
    backColor,
    brandColor,
    businessName,
    boxSize,
    border,
    slug,
    qrShape
  ]);

  const QRPreviewStable = useMemo(() => {
    return function QRPreviewWrapper(props) {
      return <StyledQRPreview {...props} />;
    };
  }, []); // ← stays stable forever




  return (
    <div className="min-h-screen bg-gray-50">

      <PageHeader businessName={businessName} title="QR Code" />

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT — QR PREVIEW */}
        <div className="flex flex-col items-center w-full">

          <div
            className="
              bg-white border border-gray-200 rounded-2xl shadow-md
              p-6 w-full max-w-[420px]
              mx-auto
              pt-safe pb-safe
            "
          >

            <div className={editing ? "block" : "hidden"}>
            <QRPreviewStable {...previewProps} />
            </div>

            {/* STATIC BACKEND QR */}
            <div className={!editing ? "block" : "hidden"}>
              {qrCodeUrl && (
                <div className="w-full flex justify-center">
                  <img
                    src={qrCodeUrl}
                    className="
                      w-full max-w-[360px] h-auto
                      rounded-xl shadow-lg
                      image-rendering-auto
                    "
                    alt="QR Code"
                  />
                </div>
              )}
            </div>

            <p className="mt-4 text-gray-600 text-sm text-center">
              {editing
                ? "Live preview — updates instantly"
                : "Scan this QR code to view your review page"}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
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
              Download QR
            </button>
          </div>
        </div>

        {/* RIGHT — EDITOR PANEL */}
        <div
          className={`
            bg-white border border-gray-200 rounded-xl shadow-sm p-6
            animate-fadeInUp
            ${editing ? "block" : "hidden"}
          `}
        >
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
              { id: "shapes", label: "Shapes" },
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
                    onChange={e => {
                      const val = e.target.value;
                      setBrandColor(val);
                      if (!fillColor) setFillColor(val);
                    }}
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

            {/* SHAPES */}
            {activeTab === "shapes" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">QR Shape</label>
                  <select
                    value={qrShape}
                    onChange={e => setQrShape(e.target.value)}
                    className="w-full h-12 rounded-md border px-3 bg-white"
                  >
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                    <option value="heart">Heart</option>
                    <option value="diamond">Diamond</option>
                    <option value="squircle">Squircle</option>
                    <option value="hexagon">Hexagon</option>
                    <option value="star">Star</option>
                  </select>
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
              await saveChanges({
                brand_color: brandColor,
                qr_fill_color: fillColor || brandColor,
                qr_back_color: backColor || "#FFFFFF",
                qr_box_size: boxSize,
                qr_border: border,
                qr_shape: qrShape
              });

              const refreshed = await fetchNewQrFromBackend();
              setQrCodeUrl(`${refreshed.qr_code_url}?t=${Date.now()}`);
              setEditing(false);
            }}
            disabled={saving}
            className={`
              w-full mt-8 py-3 rounded-lg font-semibold transition
              ${saving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
            `}
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving…
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}