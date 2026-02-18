import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">

      {/* SUCCESS / ERROR ALERT */}
      {alert && (
        <div className="absolute top-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
          {alert}
        </div>
      )}

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 relative overflow-hidden">

        {/* LOGO */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: form.brand_color }}
          >
            <span className="text-white font-bold text-lg">R</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <span className="text-blue-600">Review</span>QR
          </h1>
        </div>

        {/* BREADCRUMBS */}
        {!showReviewModal && (
        <div className="flex items-center justify-between mb-6 mt-16 relative">
          {steps.map((label, index) => (
            <div key={index} className="flex-1 flex flex-col items-center relative">

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 transition-all duration-500 
                  ${index < step ? "bg-blue-600" : "bg-gray-200"}`}
                />
              )}

              {/* Step circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold z-10 transition-all duration-300
                ${index <= step ? "bg-blue-600 text-white scale-110" : "bg-gray-200 text-gray-500"}`}
              >
                {index + 1}
              </div>

              <p
                className={`text-xs mt-2 transition-all duration-300 ${
                  index <= step ? "text-blue-600 font-medium" : "text-gray-400"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
        )}

        {/* PROGRESS BAR */}
        {!showReviewModal && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
        </div>
        )}

        {/* STEP CONTENT */}
        <div className={slideClass}>
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Business Info</h2>

              <input
                type="text"
                name="name"
                placeholder="Business Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${
                    form.email.trim() !== "" && !isValidEmail(form.email)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${
                    form.phone.trim() !== "" && !isValidPhone(form.phone)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />

              <input
                type="text"
                name="google_review_link"
                placeholder="Google Review Link"
                value={form.google_review_link}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${
                    form.google_review_link.trim() !== "" && !isValidUrl(form.google_review_link)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />

              <div className="flex justify-between items-center">
                <button
                  onClick={saveProgress}
                  className="text-sm underline text-gray-500"
                >
                  Save & Continue Later
                </button>

                <button
  onClick={next}
  disabled={!validateStep()}
  className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 
    ${validateStep()
      ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
>
  Continue
</button>
              </div>
            </div>
          )}

          {/* BRAND COLOR */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800">Choose Brand Color</h2>

              <div className="flex justify-center">
                <input
                  type="color"
                  name="brand_color"
                  value={form.brand_color}
                  onChange={handleChange}
                  className="h-20 w-32 border rounded shadow"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={back} className="px-6 py-3 rounded-lg border">
                  Back
                </button>
                <button
                  onClick={next}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* QR FILL */}
          {step === 2 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800">QR Fill Color</h2>

              <div className="flex justify-center">
                <input
                  type="color"
                  name="qr_fill_color"
                  value={form.qr_fill_color}
                  onChange={handleChange}
                  className="h-20 w-32 border rounded shadow"
                />
              </div>

              {/* QR PREVIEW */}
              <div className="flex justify-center mt-6 animate-fade-scale">
                <QRCodeSVG
                  value="reviewqr-preview"
                  size={150}
                  bgColor={form.qr_back_color}
                  fgColor={form.qr_fill_color}
                  level="H"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={back} className="px-6 py-3 rounded-lg border">
                  Back
                </button>
                <button
                  onClick={next}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* QR BACKGROUND */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800">QR Background Color</h2>

              <div className="flex justify-center">
                <input
                  type="color"
                  name="qr_back_color"
                  value={form.qr_back_color}
                  onChange={handleChange}
                  className="h-20 w-32 border rounded shadow"
                />
              </div>

              {/* QR PREVIEW */}
              <div className="flex justify-center mt-6 animate-fade-scale">
                <QRCodeSVG
                  value="reviewqr-preview"
                  size={150}
                  bgColor={form.qr_back_color}
                  fgColor={form.qr_fill_color}
                  level="H"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={back} className="px-6 py-3 rounded-lg border">
                  Back
                </button>
                <button
                  onClick={next}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* QR SETTINGS */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800">QR Settings</h2>

              <label className="text-sm text-gray-600">QR Box Size ({form.qr_box_size})</label>
              <input
                type="range"
                name="qr_box_size"
                min="8"
                max="20"
                value={form.qr_box_size}
                onChange={handleChange}
                className="w-full"
              />

              <label className="text-sm text-gray-600">QR Border ({form.qr_border})</label>
              <input
                type="range"
                name="qr_border"
                min="1"
                max="6"
                value={form.qr_border}
                onChange={handleChange}
                className="w-full"
              />

              {/* QR PREVIEW */}
              <div className="flex justify-center mt-6 animate-fade-scale">
                <QRCodeSVG
                  value="reviewqr-preview"
                  size={150}
                  bgColor={form.qr_back_color}
                  fgColor={form.qr_fill_color}
                  level="H"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={back} className="px-6 py-3 rounded-lg border">
                  Back
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 hover:scale-105 transition-all shadow-md"
                >
                  Finish & Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg animate-fade-in">

            <h2 className="text-2xl font-bold mb-6 text-center">Review Your Details</h2>

            <div className="space-y-3 text-gray-700">
              {Object.entries(form).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-2">
                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                  <span>{value.toString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 transition-all duration-300 hover:bg-gray-200 hover:text-black hover:scale-105"
              >
                Back
              </button>

              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 transition-all duration-300 hover:bg-blue-700 hover:scale-105 shadow-md"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ANIMATION KEYFRAMES */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slide-left-fade {
          animation: slideLeftFade 0.45s ease-out;
        }
        .animate-slide-right-fade {
          animation: slideRightFade 0.45s ease-out;
        }
        .animate-fade-scale {
          animation: fadeScale 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideLeftFade {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideRightFade {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}