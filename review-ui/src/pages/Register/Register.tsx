import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";
import StyledQRPreview from "../../components/StyledQRPreview";


export default function Register() {
  const navigate = useNavigate();

  const steps = [
    "Business Info",
    "Brand Color",
    "QR Fill",
    "QR Background",
    "QR Settings",
    "Review",
  ];

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [infoTab, setInfoTab] = useState("business"); // "business" | "owner"
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    google_review_link: "",
    brand_color: "#BA8E23",
    qr_fill_color: "#BA8E23",
    qr_back_color: "#FFFFFF",
    qr_box_size: 14,
    qr_border: 2,
  });

  const params = new URLSearchParams(window.location.search);
  const googleConnected = params.get("google") === "connected";

  useEffect(() => {
    const saved = localStorage.getItem("reviewqr_onboarding");
    if (saved) {
      const parsed = JSON.parse(saved);

      setForm((prev) => ({
        ...prev,      // keep defaults
        ...parsed,    // overwrite only what exists
      }));
    }
  }, []);

  const saveProgress = () => {
    localStorage.setItem("reviewqr_onboarding", JSON.stringify(form));
    setAlert("Progress saved!");
    setTimeout(() => setAlert(null), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const next = () => {
    setDirection("forward");
    setStep((s) => s + 1);
  };

  const back = () => {
    setDirection("back");
    setStep((s) => s - 1);
  };

  const handleFinalSubmit = async () => {
    try {
      const res = await fetch("https://reviewqrapi.onrender.com/api/business/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          qr_fill_color: form.qr_fill_color || form.brand_color,   // fallback applied here
        }),
      });

      await res.json();

      setShowReviewModal(false);
      setAlert("Business created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setAlert("Error creating business");
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^\+?[0-9\s\-()]{7,15}$/.test(phone);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0: {
        const businessValid =
          form.name.trim() !== "" &&
          isValidPhone(form.phone) &&
          isValidUrl(form.google_review_link);

        const ownerValid =
          form.username.trim() !== "" &&
          isValidEmail(form.email) &&
          form.password.trim().length >= 6;

        return businessValid && ownerValid;
      }
      case 1:
        return form.brand_color.trim() !== "";
      case 2:
        return true; // fill color is optional

      case 3:
        return form.qr_back_color.trim() !== "";
      case 4:
        return form.qr_box_size > 0 && form.qr_border > 0;
      default:
        return true;
    }
  };

  const businessComplete =
    form.name.trim() !== "" &&
    isValidPhone(form.phone) &&
    isValidUrl(form.google_review_link);

  const ownerComplete =
    form.username.trim() !== "" &&
    isValidEmail(form.email) &&
    form.password.trim().length >= 6;



  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* LEFT PROGRESS RAIL */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold mb-8">ReviewQR Setup</h1>

        <div className="space-y-4">
          {steps.map((label, i) => {
            const isCompleted = i < step;
            const isActive = i === step;

            return (
              <div
                key={i}
                className={`
                      flex items-center gap-3 text-sm font-medium
                      ${isActive ? "text-indigo-600" : isCompleted ? "text-gray-700" : "text-gray-400"}
                    `}
              >
                {/* Icon */}
                <div
                  className={`
                        flex items-center justify-center
                        w-5 h-5 rounded-full border transition-all
                        ${isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? "border-indigo-600 text-indigo-600"
                        : "border-gray-300 text-gray-300"
                    }
                      `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                    />
                  )}
                </div>

                {label}
              </div>
            );
          })}
        </div>
      </div>



      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col px-4 py-6">

        {/* MODAL CARD */}
        <div
          className="
                  w-full max-w-sm sm:max-w-md mx-auto
                  bg-white/80 backdrop-blur-xl
                  p-5 sm:p-8
                  rounded-2xl
                  border border-gray-200
                  shadow-xl
                  animate-fadeUp
                "
        >

          {/* ALERTS */}
          {alert && (
            <div
              className={`
        mb-5 px-4 py-3 rounded-xl text-sm font-medium shadow-sm
        ${alert.includes("successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                }
      `}
            >
              {alert}
            </div>
          )}

          <div className="flex justify-center sm:justify-start">
            <div className="
                  inline-flex p-1 rounded-2xl
                  bg-gradient-to-b from-gray-100 to-gray-200
                  shadow-inner border border-gray-200
                ">

              {/* BUSINESS TAB */}
              <button
                onClick={() => setInfoTab("business")}
                className={`
                        relative px-6 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-300
        ${infoTab === "business"
                    ? "bg-white shadow-md text-gray-900 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-700"}
      `}
              >
                Business
                {businessComplete && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full shadow-sm"></span>
                )}
              </button>

              {/* OWNER TAB */}
              <button
                onClick={() => setInfoTab("owner")}
                className={`
                    relative px-6 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-300
                    ${infoTab === "owner"
                    ? "bg-white shadow-md text-gray-900 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-700"}
      `}
              >
                Owner
                {ownerComplete && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full shadow-sm"></span>
                )}
              </button>

            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
            Complete both sections before continuing
          </p>

          {/* STEP CONTENT */}
          <div className="animate-step">

            {/* STEP 0 — BUSINESS + OWNER INFO */}
            {/* STEP 0 — BUSINESS + OWNER INFO */}
            {step === 0 && (
              <div className="space-y-10 px-2 sm:px-0">

                {/* HEADER */}
                <div className="text-center sm:text-left space-y-1 pt-4 pb-2 sm:pt-6 sm:pb-4">
                  <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                    {infoTab === "business" ? "Business Account" : "Owner Account"}
                  </h2>

                  <p className="text-gray-500 text-sm sm:text-base">
                    {infoTab === "business"
                      ? "Tell us about your business to get started"
                      : "Create your secure owner account"}
                  </p>
                </div>



                {/* BUSINESS INFO */}
                {infoTab === "business" && (
                  <div className="space-y-5 bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-sm animate-fadeIn">
                    <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Business Name"
                      className="input-ios"
                    />

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Business Phone"
                      className="input-ios"
                    />

                    <input
                      name="google_review_link"
                      value={form.google_review_link}
                      onChange={handleChange}
                      placeholder="Google Review Link"
                      className="input-ios"
                    />
                  </div>
                )}

                {/* OWNER INFO */}
                {infoTab === "owner" && (
                  <div className="space-y-5 bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-sm animate-fadeIn">
                    <h3 className="text-lg font-semibold text-gray-900">Owner Details</h3>

                    <input
                      name="owner_name"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="input-ios"
                    />

                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Business Email"
                      className="input-ios"
                    />

                    <input
                      name="owner_password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create Password"
                      className="input-ios"
                    />
                  </div>
                )}

                {/* GOOGLE CONNECT CARD */}
                <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800">Connect Google Reviews</h3>
                  <p className="text-xs text-gray-600">
                    Sync your Google Business Profile to pull reviews automatically.
                  </p>

                  {googleConnected ? (
                    <div className="px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                      ✓ Google Reviews Connected
                    </div>
                  ) : (
                    <button
                      onClick={() => window.location.href = "http://127.0.0.1:8000/googleAuth/google/oauth/start/"}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Connect Google Business Profile
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* STEP 1 — BRAND COLOR */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Brand Color
                </h2>

                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Choose your brand color
                  </span>

                  <input
                    type="color"
                    name="brand_color"
                    value={form.brand_color}
                    onChange={handleChange}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
                  />
                </div>

                {/* QR PREVIEW USING BRAND COLOR */}
                <div className="flex justify-center">
                  <div className="p-4 rounded-xl bg-white shadow-sm border">
                    <StyledQRPreview
                      fill={form.brand_color}          // brand color becomes QR fill
                      back="#FFFFFF"                   // default background
                      brand={form.brand_color}         // brand color for gradient + capsule
                      text={form.name || "Your Business"}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — QR FILL COLOR */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  QR Fill Color <span className="text-gray-500 text-sm">(optional)</span>
                </h2>

                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Fill Color</span>

                  <input
                    type="color"
                    name="qr_fill_color"
                    value={form.qr_fill_color || form.brand_color}   // visually shows brand color
                    onChange={handleChange}                           // only sets if user picks
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
                  />
                </div>

                <div className="flex justify-center">
                  <div className="p-4 rounded-xl bg-white shadow-sm border">
                    <StyledQRPreview
                      fill={form.qr_fill_color || form.brand_color}   // optional override
                      back={form.qr_back_color}
                      brand={form.brand_color}
                      text={form.name || "Your Business"}
                    />
                  </div>
                </div>

                {/* Optional reset */}
                {form.qr_fill_color && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, qr_fill_color: "" }))}
                    className="text-xs text-gray-500 underline"
                  >
                    Reset to brand color
                  </button>
                )}
              </div>
            )}
            {/* STEP 3 — QR BACKGROUND COLOR */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  QR Background Color
                </h2>

                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Background Color</span>

                  <input
                    type="color"
                    name="qr_back_color"
                    value={form.qr_back_color || "#FFFFFF"}   // fallback so input never breaks
                    onChange={handleChange}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
                  />
                </div>

                <div className="flex justify-center">
                  <div className="p-4 rounded-xl bg-white shadow-sm border">
                    <StyledQRPreview
                      fill={form.qr_fill_color || form.brand_color}   // optional override
                      back={form.qr_back_color || "#FFFFFF"}          // SAFE fallback
                      brand={form.brand_color}
                      text={form.name || "Your Business"}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — QR SETTINGS */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">QR Settings</h2>

                <input type="number" name="qr_box_size" value={form.qr_box_size} onChange={handleChange}
                  placeholder="QR Box Size"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                />

                <input type="number" name="qr_border" value={form.qr_border} onChange={handleChange}
                  placeholder="QR Border Size"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                />
              </div>
            )}

            {/* STEP 5 — REVIEW */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Review Your Info</h2>

                <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Business Info</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 space-y-1">
                      <p><span className="font-medium text-gray-700">Name:</span> {form.name}</p>
                      <p><span className="font-medium text-gray-700">Email:</span> {form.email}</p>
                      <p><span className="font-medium text-gray-700">Phone:</span> {form.phone}</p>
                      <p><span className="font-medium text-gray-700">Google Link:</span> {form.google_review_link}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Branding</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 space-y-1">
                      <p><span className="font-medium text-gray-700">Brand Color:</span> {form.brand_color}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">QR Settings</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 space-y-1">
                      <p><span className="font-medium text-gray-700">Fill Color:</span> {form.qr_fill_color}</p>
                      <p><span className="font-medium text-gray-700">Background:</span> {form.qr_back_color}</p>
                      <p><span className="font-medium text-gray-700">Box Size:</span> {form.qr_box_size}</p>
                      <p><span className="font-medium text-gray-700">Border:</span> {form.qr_border}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  className="w-full py-3.5 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 active:scale-[.98] transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            )}

          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between mt-10">
            {step > 0 ? (
              <button
                onClick={back}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 && (
              <button
                onClick={next}
                disabled={!validateStep()}
                className="
                      px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold
                      hover:bg-indigo-700 disabled:opacity-40 transition
                    "
              >
                Continue
              </button>
            )}
          </div>
        </div>

        {/* LOGIN LINK UNDER MODAL */}
        <div className="w-full text-center mt-6 mb-10">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

      </div >
    </div >
  );
}