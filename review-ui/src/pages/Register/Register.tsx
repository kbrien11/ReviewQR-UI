
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import StyledQRPreview from "../../components/StyledQRPreview";

type FormData = {
  name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  google_review_link: string;
  brand_color: string;
  qr_fill_color: string;
  qr_back_color: string;
  qr_box_size: number;
  qr_border: number;
};

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  username: "",
  password: "",
  phone: "",
  google_review_link: "",
  brand_color: "#6D5AE6",
  qr_fill_color: "#6D5AE6",
  qr_back_color: "#FFFFFF",
  qr_box_size: 14,
  qr_border: 2,
};

const STEPS = [
  { title: "Business details", description: "Tell us about your business." },
  { title: "Brand identity", description: "Choose your signature color." },
  { title: "QR code color", description: "Customize your QR code." },
  { title: "Background", description: "Choose a background color." },
  { title: "QR settings", description: "Fine-tune your design." },
  { title: "Review & create", description: "Everything ready? Let's go." },
];

const API_URL =
  "https://reviewqrapi.onrender.com/api/business/create/";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [infoTab, setInfoTab] = useState<"business" | "owner">("business");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [alert, setAlert] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [savedProgress, setSavedProgress] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("reviewqr_onboarding");

      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
        setSavedProgress(true);
      }
    } catch {
      localStorage.removeItem("reviewqr_onboarding");
    }

    const params = new URLSearchParams(window.location.search);
    setGoogleConnected(params.get("google") === "connected");
  }, []);

  const updateField = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    setError("");
  };

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const validPhone = /^\+?[0-9\s\-().]{7,20}$/.test(form.phone.trim());

  const validGoogleUrl = (() => {
    try {
      const url = new URL(form.google_review_link);
      return (
        (url.protocol === "https:" || url.protocol === "http:") &&
        url.hostname.includes(".")
      );
    } catch {
      return false;
    }
  })();

  const businessComplete =
    form.name.trim().length > 0 &&
    validPhone &&
    validGoogleUrl;

  const ownerComplete =
    form.username.trim().length > 0 &&
    validEmail &&
    form.password.length >= 8;

  const stepValid = (() => {
    switch (step) {
      case 0:
        return businessComplete && ownerComplete;
      case 1:
        return /^#[0-9A-Fa-f]{6}$/.test(form.brand_color);
      case 2:
        return /^#[0-9A-Fa-f]{6}$/.test(
          form.qr_fill_color || form.brand_color
        );
      case 3:
        return /^#[0-9A-Fa-f]{6}$/.test(form.qr_back_color);
      case 4:
        return (
          Number.isInteger(form.qr_box_size) &&
          form.qr_box_size >= 1 &&
          form.qr_box_size <= 40 &&
          Number.isInteger(form.qr_border) &&
          form.qr_border >= 0 &&
          form.qr_border <= 10
        );
      default:
        return true;
    }
  })();

  const saveProgress = () => {
    try {
      localStorage.setItem("reviewqr_onboarding", JSON.stringify(form));
      setAlert("Progress saved on this device.");
      setError("");
    } catch {
      setError("Could not save progress in this browser.");
    }
  };

  const next = () => {
    if (!stepValid) {
      setError("Please complete the required fields before continuing.");
      return;
    }

    setError("");
    setAlert("");

    if (step === 0 && infoTab === "business") {
      setInfoTab("owner");
      return;
    }

    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const back = () => {
    setError("");
    setAlert("");

    if (step === 0 && infoTab === "owner") {
      setInfoTab("business");
      return;
    }

    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const connectGoogle = () => {
    // Replace with your deployed backend URL when appropriate.
    window.location.href =
      "http://127.0.0.1:8000/googleAuth/google/oauth/start/";
  };

  const handleFinalSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setAlert("");

    try {
      const payload = {
        ...form,
        qr_fill_color: form.qr_fill_color || form.brand_color,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "We couldn't create your account. Please check your information."
        );
      }

      localStorage.removeItem("reviewqr_onboarding");
      setAlert("Your business has been created successfully!");

      window.setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700";

  const qrFill = form.qr_fill_color || form.brand_color;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {/* Sidebar */}
        <aside className="hidden w-[310px] shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-8 lg:flex">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-xl font-bold text-white shadow-lg shadow-violet-600/20">
                R
              </div>
              <span className="text-xl font-bold tracking-tight">
                ReviewQR
              </span>
            </Link>

            <div className="mt-16">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                Get started
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
                Build a better review experience.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Set up your business, personalize your QR code, and
                get everything ready from one simple workflow.
              </p>
            </div>

            <div className="mt-12 space-y-2">
              {STEPS.map((item, index) => {
                const active = index === step;
                const complete = index < step;

                return (
                  <div
                    key={item.title}
                    className={`flex gap-4 rounded-2xl p-3 transition ${
                      active
                        ? "bg-violet-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                        complete
                          ? "bg-emerald-100 text-emerald-700"
                          : active
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {complete ? "✓" : `0${index + 1}`}
                    </div>

                    <div className="pt-0.5">
                      <p
                        className={`text-sm font-semibold ${
                          active ? "text-violet-700" : "text-slate-700"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              ✨
            </div>
            <p className="mt-4 font-semibold">Make it yours</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your QR code can reflect your brand from the very first scan.
            </p>
          </div>
        </aside>

        {/* Main area */}
        <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-8 lg:px-14 lg:py-10">
          <header className="mx-auto flex w-full max-w-3xl items-center justify-between">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-bold text-white">
                R
              </div>
              <span className="font-bold">ReviewQR</span>
            </Link>

            <div className="hidden sm:block lg:ml-auto">
              <span className="text-sm text-slate-500">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="ml-2 text-sm font-semibold text-violet-600 hover:text-violet-800"
              >
                Log in
              </Link>
            </div>

            <Link
              to="/login"
              className="text-sm font-semibold text-violet-600 sm:hidden"
            >
              Log in
            </Link>
          </header>

          {/* Mobile progress */}
          <div className="mx-auto mt-8 w-full max-w-3xl lg:hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Step {step + 1} of {STEPS.length}
              </span>
              <span className="text-sm text-slate-500">
                {Math.round(((step + 1) / STEPS.length) * 100)}%
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{
                  width: `${((step + 1) / STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mx-auto my-8 w-full max-w-3xl flex-1 sm:my-12">
            <div className="mb-8">
              <p className="text-sm font-semibold text-violet-600">
                STEP {step + 1} / {STEPS.length}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {step === 0
                  ? infoTab === "business"
                    ? "Tell us about your business"
                    : "Create your owner account"
                  : STEPS[step].title}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-500">
                {step === 0
                  ? infoTab === "business"
                    ? "Let's start with the basics so we can personalize your experience."
                    : "Add your account details to manage your business."
                  : STEPS[step].description}
              </p>
            </div>

            {/* Alerts */}
            {alert && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                {alert}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {savedProgress && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">
                <span>✓</span>
                Your previous setup details were restored.
                <button
                  type="button"
                  onClick={() => setSavedProgress(false)}
                  className="ml-auto text-violet-700"
                  aria-label="Dismiss restored progress message"
                >
                  ×
                </button>
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              {/* Step 1: Business + owner */}
              {step === 0 && (
                <div className="space-y-7">
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setInfoTab("business")}
                      className={`flex-1 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                        infoTab === "business"
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      Business details {businessComplete ? "✓" : ""}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInfoTab("owner")}
                      className={`flex-1 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                        infoTab === "owner"
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      Owner account {ownerComplete ? "✓" : ""}
                    </button>
                  </div>

                  {infoTab === "business" ? (
                    <div className="space-y-5">
                      <div>
                        <label className={labelClass} htmlFor="name">
                          Business name
                        </label>
                        <input
                          id="name"
                          name="name"
                          autoComplete="organization"
                          value={form.name}
                          onChange={updateField}
                          placeholder="e.g. The Corner Cafe"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="phone">
                          Business phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={updateField}
                          placeholder="+1 (555) 123-4567"
                          className={inputClass}
                          required
                        />
                        {form.phone && !validPhone && (
                          <p className="mt-2 text-xs text-red-600">
                            Enter a valid phone number.
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className={labelClass}
                          htmlFor="google_review_link"
                        >
                          Google review link
                        </label>
                        <input
                          id="google_review_link"
                          name="google_review_link"
                          type="url"
                          value={form.google_review_link}
                          onChange={updateField}
                          placeholder="https://g.page/r/..."
                          className={inputClass}
                          required
                        />
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Add the link customers should use to leave a Google review.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label className={labelClass} htmlFor="username">
                          Your name / username
                        </label>
                        <input
                          id="username"
                          name="username"
                          autoComplete="username"
                          value={form.username}
                          onChange={updateField}
                          placeholder="How should we identify you?"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="email">
                          Business email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={updateField}
                          placeholder="you@yourbusiness.com"
                          className={inputClass}
                          required
                        />
                        {form.email && !validEmail && (
                          <p className="mt-2 text-xs text-red-600">
                            Enter a valid email address.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="password">
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          value={form.password}
                          onChange={updateField}
                          placeholder="At least 8 characters"
                          className={inputClass}
                          minLength={8}
                          required
                        />
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-semibold text-slate-800">
                          Connect Google Business Profile
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Connect your profile if your integration supports automatic review syncing.
                        </p>

                        {googleConnected ? (
                          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700">
                            ✓ Google connection detected
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={connectGoogle}
                            className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
                          >
                            Connect Google Business Profile
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Brand color */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass} htmlFor="brand_color">
                      Choose your brand color
                    </label>
                    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                      <input
                        id="brand_color"
                        name="brand_color"
                        type="color"
                        value={form.brand_color}
                        onChange={updateField}
                        className="h-12 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <div>
                        <p className="font-semibold">{form.brand_color}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Use your logo or brand's primary color.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-6 text-center">
                    <p className="mb-4 text-sm font-medium text-slate-600">
                      Your preview
                    </p>
                    <StyledQRPreview
                      fill={form.brand_color}
                      back="#FFFFFF"
                      brand={form.brand_color}
                      text={form.name || "Your Business"}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: QR fill */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass} htmlFor="qr_fill_color">
                      QR code fill color
                    </label>
                    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                      <input
                        id="qr_fill_color"
                        name="qr_fill_color"
                        type="color"
                        value={qrFill}
                        onChange={updateField}
                        className="h-12 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <div>
                        <p className="font-semibold">{qrFill}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Choose a color with strong contrast against the background.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        qr_fill_color: prev.brand_color,
                      }))
                    }
                    className="text-sm font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Use brand color
                  </button>

                  <div className="flex justify-center rounded-2xl bg-slate-50 p-6">
                    <StyledQRPreview
                      fill={qrFill}
                      back={form.qr_back_color}
                      brand={form.brand_color}
                      text={form.name || "Your Business"}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Background */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass} htmlFor="qr_back_color">
                      QR code background
                    </label>
                    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                      <input
                        id="qr_back_color"
                        name="qr_back_color"
                        type="color"
                        value={form.qr_back_color}
                        onChange={updateField}
                        className="h-12 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <div>
                        <p className="font-semibold">{form.qr_back_color}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          A light background generally scans more reliably.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center rounded-2xl bg-slate-50 p-6">
                    <StyledQRPreview
                      fill={qrFill}
                      back={form.qr_back_color}
                      brand={form.brand_color}
                      text={form.name || "Your Business"}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: QR settings */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass} htmlFor="qr_box_size">
                      QR box size
                    </label>
                    <input
                      id="qr_box_size"
                      name="qr_box_size"
                      type="number"
                      min={1}
                      max={40}
                      step={1}
                      value={form.qr_box_size}
                      onChange={updateField}
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Allowed range: 1–40.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="qr_border">
                      QR border size
                    </label>
                    <input
                      id="qr_border"
                      name="qr_border"
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      value={form.qr_border}
                      onChange={updateField}
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Allowed range: 0–10.
                    </p>
                  </div>

                  <div className="flex justify-center rounded-2xl bg-slate-50 p-6">
                    <StyledQRPreview
                      fill={qrFill}
                      back={form.qr_back_color}
                      brand={form.brand_color}
                      text={form.name || "Your Business"}
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {step === 5 && (
                <div className="space-y-5">
                  <div className="flex justify-center rounded-2xl bg-slate-50 p-6">
                    <StyledQRPreview
                      fill={qrFill}
                      back={form.qr_back_color}
                      brand={form.brand_color}
                      text={form.name || "Your Business"}
                    />
                  </div>

                  {[
                    {
                      title: "Business information",
                      rows: [
                        ["Business", form.name],
                        ["Owner username", form.username],
                        ["Email", form.email],
                        ["Phone", form.phone],
                        ["Google review link", form.google_review_link],
                      ],
                    },
                    {
                      title: "QR design",
                      rows: [
                        ["Brand color", form.brand_color],
                        ["Fill color", qrFill],
                        ["Background", form.qr_back_color],
                        ["Box size", String(form.qr_box_size)],
                        ["Border", String(form.qr_border)],
                      ],
                    },
                  ].map((section) => (
                    <div
                      key={section.title}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <h3 className="mb-3 font-semibold">{section.title}</h3>
                      <dl className="space-y-3">
                        {section.rows.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex flex-col gap-1 sm:flex-row sm:justify-between"
                          >
                            <dt className="text-sm text-slate-500">
                              {label}
                            </dt>
                            <dd className="break-all text-sm font-medium text-slate-800 sm:max-w-[60%] sm:text-right">
                              {value || "Not provided"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}

                  <p className="text-sm leading-6 text-slate-500">
                    By creating your account, you confirm that you are
                    authorized to register this business.
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0 && infoTab === "business"}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:invisible"
                >
                  ← Back
                </button>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={saveProgress}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Save progress
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={!stepValid}
                      className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {step === 0 && infoTab === "business"
                        ? "Continue to owner →"
                        : step === 0
                          ? "Continue →"
                          : "Continue →"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Creating business..." : "Create business →"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Your setup details are saved locally only when you choose
              Save progress. Avoid using shared devices to save passwords.
            </p>
          </div>

          <footer className="mx-auto w-full max-w-3xl border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} ReviewQR. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
