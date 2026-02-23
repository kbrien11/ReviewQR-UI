import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";


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

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    google_review_link: "",
    brand_color: "#BA8E23",
    qr_fill_color: "#BA8E23",
    qr_back_color: "#FFFFFF",
    qr_box_size: 14,
    qr_border: 2,
  });

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem("reviewqr_onboarding");
    if (saved) {
      setForm(JSON.parse(saved));
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
        body: JSON.stringify(form),
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
      case 0:
        return (
          form.name.trim() !== "" &&
          isValidEmail(form.email) &&
          isValidPhone(form.phone) &&
          isValidUrl(form.google_review_link)
        );
      case 1:
        return form.brand_color.trim() !== "";
      case 2:
        return form.qr_fill_color.trim() !== "";
      case 3:
        return form.qr_back_color.trim() !== "";
      case 4:
        return form.qr_box_size > 0 && form.qr_border > 0;
      default:
        return true;
    }
  };

  // Animation classes
  const slideClass =
    direction === "forward"
      ? "animate-slide-left-fade"
      : "animate-slide-right-fade";

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
      <div className="flex-1 flex flex-col items-center p-6">

        {/* MODAL CARD */}
        <div className="w-full max-w-xl bg-white p-10 rounded-xl border border-gray-200 shadow-sm relative">

          {/* ALERTS */}
          {alert && (
            <div
              className={`
                    mb-6 p-4 rounded-lg text-sm font-medium
                    ${alert.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }
                  `}
            >
              {alert}
            </div>
          )}

          {/* STEP CONTENT */}
          <div className="animate-step">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Info</h2>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Business Name"
                  className="
  w-full px-4 py-3.5
  rounded-lg border border-gray-300
  text-[15px] font-medium text-gray-900
  placeholder:text-gray-400
  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  transition
  font-[var(--vercel-font)]
"                   />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="
  w-full px-4 py-3.5
  rounded-lg border border-gray-300
  text-[15px] font-medium text-gray-900
  placeholder:text-gray-400
  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  transition
  font-[var(--vercel-font)]
"                   />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="
  w-full px-4 py-3.5
  rounded-lg border border-gray-300
  text-[15px] font-medium text-gray-900
  placeholder:text-gray-400
  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  transition
  font-[var(--vercel-font)]
"                   />

                <input
                  name="google_review_link"
                  value={form.google_review_link}
                  onChange={handleChange}
                  placeholder="Google Review Link"
                  className="
  w-full px-4 py-3.5
  rounded-lg border border-gray-300
  text-[15px] font-medium text-gray-900
  placeholder:text-gray-400
  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  transition
  font-[var(--vercel-font)]
"                    />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Brand Color</h2>

                <input
                  type="color"
                  name="brand_color"
                  value={form.brand_color}
                  onChange={handleChange}
                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Fill Color</h2>

                <input
                  type="color"
                  name="qr_fill_color"
                  value={form.qr_fill_color}
                  onChange={handleChange}
                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />

                <div className="mt-6 flex justify-center">
                  <div className="p-4 rounded-xl border bg-white shadow-sm">
                    <QRCodeCanvas
                      value="https://reviewqr.com/preview"
                      size={180}
                      bgColor={form.qr_back_color}
                      fgColor={form.qr_fill_color}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Background Color</h2>

                <input
                  type="color"
                  name="qr_back_color"
                  value={form.qr_back_color}
                  onChange={handleChange}
                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />

                <div className="mt-6 flex justify-center">
                  <div className="p-4 rounded-xl border bg-white shadow-sm">
                    <QRCodeCanvas
                      value="https://reviewqr.com/preview"
                      size={180}
                      bgColor={form.qr_back_color}
                      fgColor={form.qr_fill_color}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Settings</h2>

                <input
                  type="number"
                  name="qr_box_size"
                  value={form.qr_box_size}
                  onChange={handleChange}
                  placeholder="QR Box Size"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="number"
                  name="qr_border"
                  value={form.qr_border}
                  onChange={handleChange}
                  placeholder="QR Border Size"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Your Info</h2>

                <pre className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700">
                  {JSON.stringify(form, null, 2)}
                </pre>

                <button
                  onClick={handleFinalSubmit}
                  className="w-full mt-4 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
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

      </div>
    </div>
  );
}