
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";
import StyledQRPreview from "../../components/StyledQRPreview";

const API_BASE = "https://reviewqrapi.onrender.com/api";

type QRSettings = {
  brand_color: string;
  qr_fill_color: string;
  qr_back_color: string;
  qr_box_size: number;
  qr_border: number;
  qr_shape: string;
};

type QRData = Partial<QRSettings> & {
  name?: string;
  qr_code?: string;
};

const DEFAULT_SETTINGS: QRSettings = {
  brand_color: "#000000",
  qr_fill_color: "#000000",
  qr_back_color: "#FFFFFF",
  qr_box_size: 10,
  qr_border: 4,
  qr_shape: "rectangle",
};

const TABS = [
  { id: "colors", label: "Colors" },
  { id: "sizes", label: "Size" },
  { id: "shapes", label: "Shape" },
  { id: "presets", label: "Presets" },
] as const;

const PRESETS = [
  { name: "Classic", brand: "#111827", fill: "#111827", back: "#FFFFFF" },
  { name: "Ocean", brand: "#2563EB", fill: "#1D4ED8", back: "#EFF6FF" },
  { name: "Sunset", brand: "#EA580C", fill: "#C2410C", back: "#FFF7ED" },
  { name: "Forest", brand: "#15803D", fill: "#166534", back: "#F0FDF4" },
];

function withCacheBuster(url: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("_t", Date.now().toString());
    return parsed.toString();
  } catch {
    return url;
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export default function BusinessQRPage() {
  const { slug } = useParams<{ slug: string }>();

  const [businessName, setBusinessName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [settings, setSettings] = useState<QRSettings>(DEFAULT_SETTINGS);

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("colors");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const updateSetting = <K extends keyof QRSettings>(
    key: K,
    value: QRSettings[K]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const loadQR = useCallback(async (showLoader = true) => {
    if (!slug) {
      setError("A business identifier is missing from the URL.");
      setLoading(false);
      return;
    }

    if (showLoader) setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/business/${encodeURIComponent(slug)}/qr/`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load your QR code (HTTP ${response.status}).`
        );
      }

      const data: QRData = await response.json();

      setBusinessName(data.name ?? "");
      setQrCodeUrl(data.qr_code ?? "");
      setImageError(false);

      setSettings({
        brand_color:
          data.brand_color ?? DEFAULT_SETTINGS.brand_color,
        qr_fill_color:
          data.qr_fill_color ?? DEFAULT_SETTINGS.qr_fill_color,
        qr_back_color:
          data.qr_back_color ?? DEFAULT_SETTINGS.qr_back_color,
        qr_box_size: Number(
          data.qr_box_size ?? DEFAULT_SETTINGS.qr_box_size
        ),
        qr_border: Number(
          data.qr_border ?? DEFAULT_SETTINGS.qr_border
        ),
        qr_shape: data.qr_shape ?? DEFAULT_SETTINGS.qr_shape,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadQR();

  }, [loadQR]);

 
  const saveChanges = async () => {
    setSaving(true);
    setError("");
  
    try {
      const response = await fetch(
        `${API_BASE}/business/${slug}/qr/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || "Failed to save QR settings.");
      }
  
      // Use the settings actually returned by the backend.
      setSettings((current) => ({
        ...current,
        ...data,
      }));
  
      if (data.qr_code) {
        setQrCodeUrl(data.qr_code);
        setImageError(false);
      }
  
      setEditing(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save QR settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const downloadQR = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);

      if (!response.ok) {
        throw new Error("The QR image could not be downloaded.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = `${slug || "business"}-qr.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch {
      // Cross-origin download restrictions may prevent fetching the image.
      // Opening the public image is a useful fallback.
      window.open(qrCodeUrl, "_blank", "noopener,noreferrer");
    }
  };

  const applyPreset = (
    preset: (typeof PRESETS)[number]
  ) => {
    setSettings((current) => ({
      ...current,
      brand_color: preset.brand,
      qr_fill_color: preset.fill,
      qr_back_color: preset.back,
    }));
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const colorInputClass =
    "h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1.5 transition hover:border-gray-300";

  return (
    <div className="min-h-screen bg-slate-50/80 pb-12">
      <PageHeader businessName={businessName} title="QR Code" />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Page introduction */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zm4 4h3v3h-3zm0-4h3" />
                </svg>
              </span>
              QR code studio
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Your QR code
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Customize your design, match your brand, and make it
              easy for customers to leave a review.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Review QR code
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span className="font-bold">!</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Something needs your attention</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
            <button
              onClick={() => void loadQR()}
              className="shrink-0 rounded-lg px-3 py-1.5 font-semibold hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
          {/* LEFT: QR preview */}
          <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Live preview
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {editing
                    ? "Your design updates as you customize it."
                    : "Your current published QR code."}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {editing ? "Editing" : "Current"}
              </span>
            </div>

            <div className="p-5 sm:p-8">
              <div
                className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-5 sm:min-h-[390px] sm:p-8"
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <p className="text-sm">Loading your QR code…</p>
                  </div>
                ) : editing ? (
                  <div className="flex w-full justify-center">
                    <div className="max-w-full overflow-hidden rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5">
                      <StyledQRPreview
                        fill={settings.qr_fill_color}
                        back={settings.qr_back_color}
                        brand={settings.brand_color}
                        text={businessName}
                        size={settings.qr_box_size}
                        border={settings.qr_border}
                        slug={slug}
                        shape={settings.qr_shape}
                      />
                    </div>
                  </div>
                ) : qrCodeUrl && !imageError ? (
                  <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:p-5">
                    <img
                      src={withCacheBuster(qrCodeUrl)}
                      alt={`${businessName || "Business"} review QR code`}
                      onLoad={() => setImageError(false)}
                      onError={() => setImageError(true)}
                      className="mx-auto block h-auto w-full max-w-[280px] object-contain sm:max-w-[320px]"
                    />
                  </div>
                ) : (
                  <div className="flex max-w-xs flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-8 w-8"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <path d="M14 14h3v3h-3zm4 4h3v3h-3zm0-4h3" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      QR code unavailable
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Check your image URL and Supabase Storage access,
                      then try loading the QR code again.
                    </p>
                    <button
                      onClick={() => void loadQR()}
                      className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-4 text-center text-sm text-gray-500">
                {businessName
                  ? `Made for ${businessName}`
                  : "Your branded review experience"}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    setEditing((current) => !current);
                    setActiveTab("colors");
                  }}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editing ? "View current QR" : "Customize design"}
                </button>

                <button
                  onClick={() => void downloadQR()}
                  disabled={!qrCodeUrl || loading || imageError}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 3v12m-5-5 5 5 5-5" />
                    <path d="M5 16v4h14v-4" />
                  </svg>
                  Download PNG
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-indigo-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Ready for print
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Test your QR code with a phone camera before
                    printing it on menus, signs, or receipts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: Customization */}
          <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Customize your QR
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Make the design feel like your brand.
                </p>
              </div>

              {editing && (
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  Close
                </button>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {!editing ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-6 py-10 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-7 w-7"
                      aria-hidden="true"
                    >
                      <path d="m14 4 6 6M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Make it yours
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                    Adjust colors, choose a shape, and preview your
                    design before saving it.
                  </p>
                  <button
                    onClick={() => {
                      setEditing(true);
                      setActiveTab("colors");
                    }}
                    disabled={loading}
                    className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Start customizing
                  </button>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="grid grid-cols-4 gap-1 rounded-xl bg-gray-100 p-1">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-lg px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                          activeTab === tab.id
                            ? "bg-white text-indigo-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-7 min-h-[255px]">
                    {activeTab === "colors" && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-sm font-semibold text-gray-800">
                            Brand color
                          </label>
                          <p className="mt-1 text-xs text-gray-500">
                            Used to represent your business identity.
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.brand_color}
                              onChange={(e) =>
                                updateSetting("brand_color", e.target.value)
                              }
                              className={colorInputClass}
                              aria-label="Brand color"
                            />
                            <span className="w-20 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2.5 text-center font-mono text-xs uppercase text-gray-600">
                              {settings.brand_color}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-800">
                            QR pattern color
                          </label>
                          <div className="mt-3 flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.qr_fill_color}
                              onChange={(e) =>
                                updateSetting("qr_fill_color", e.target.value)
                              }
                              className={colorInputClass}
                              aria-label="QR pattern color"
                            />
                            <span className="w-20 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2.5 text-center font-mono text-xs uppercase text-gray-600">
                              {settings.qr_fill_color}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-800">
                            Background color
                          </label>
                          <div className="mt-3 flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.qr_back_color}
                              onChange={(e) =>
                                updateSetting("qr_back_color", e.target.value)
                              }
                              className={colorInputClass}
                              aria-label="QR background color"
                            />
                            <span className="w-20 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2.5 text-center font-mono text-xs uppercase text-gray-600">
                              {settings.qr_back_color}
                            </span>
                          </div>
                        </div>

                        <p className="rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-800">
                          Keep strong contrast between the QR pattern and
                          background so phones can scan it reliably.
                        </p>
                      </div>
                    )}

                    {activeTab === "sizes" && (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="qr-box-size"
                              className="text-sm font-semibold text-gray-800"
                            >
                              Box size
                            </label>
                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                              {settings.qr_box_size}
                            </span>
                          </div>
                          <input
                            id="qr-box-size"
                            type="range"
                            min="4"
                            max="20"
                            value={settings.qr_box_size}
                            onChange={(e) =>
                              updateSetting(
                                "qr_box_size",
                                Number(e.target.value)
                              )
                            }
                            className="mt-4 w-full accent-indigo-600"
                          />
                          <div className="mt-1 flex justify-between text-xs text-gray-400">
                            <span>Compact</span>
                            <span>Large</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="qr-border-size"
                              className="text-sm font-semibold text-gray-800"
                            >
                              Border / quiet zone
                            </label>
                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                              {settings.qr_border}
                            </span>
                          </div>
                          <input
                            id="qr-border-size"
                            type="range"
                            min="0"
                            max="10"
                            value={settings.qr_border}
                            onChange={(e) =>
                              updateSetting(
                                "qr_border",
                                Number(e.target.value)
                              )
                            }
                            className="mt-4 w-full accent-indigo-600"
                          />
                          <div className="mt-1 flex justify-between text-xs text-gray-400">
                            <span>Minimal</span>
                            <span>Wide</span>
                          </div>
                          <p className="mt-3 text-xs leading-5 text-gray-500">
                            A clear margin around the QR code helps
                            scanners recognize it.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "shapes" && (
                      <div>
                        <label
                          htmlFor="qr-shape"
                          className="text-sm font-semibold text-gray-800"
                        >
                          QR code shape
                        </label>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Choose a supported style for your QR design.
                        </p>
                        <select
                          id="qr-shape"
                          value={settings.qr_shape}
                          onChange={(e) =>
                            updateSetting("qr_shape", e.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="rectangle">Rectangle</option>
                          <option value="circle">Circle</option>
                          <option value="heart">Heart</option>
                          <option value="diamond">Diamond</option>
                          <option value="squircle">Squircle</option>
                          <option value="hexagon">Hexagon</option>
                          <option value="star">Star</option>
                        </select>
                        <p className="mt-4 rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-500">
                          Make sure your StyledQRPreview supports the
                          selected shape and that the finished code
                          remains scannable.
                        </p>
                      </div>
                    )}

                    {activeTab === "presets" && (
                      <div>
                        <p className="mb-4 text-sm text-gray-600">
                          Start with a palette and fine-tune it in Colors.
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => applyPreset(preset)}
                              className="group rounded-2xl border border-gray-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40"
                            >
                              <div className="mb-3 flex h-12 overflow-hidden rounded-lg border border-black/5">
                                <span
                                  className="flex-1"
                                  style={{ backgroundColor: preset.fill }}
                                />
                                <span
                                  className="flex-1"
                                  style={{ backgroundColor: preset.back }}
                                />
                                <span
                                  className="flex-1"
                                  style={{ backgroundColor: preset.brand }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                                {preset.name}
                              </span>
                              <span className="mt-1 block text-xs text-gray-500">
                                {preset.fill.toUpperCase()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-5">
                    <button
                      onClick={() => void saveChanges()}
                      disabled={saving}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Saving your design…
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </button>

                    <button
                      onClick={() => void loadQR()}
                      disabled={saving || loading}
                      className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50"
                    >
                      Discard changes and reload
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
