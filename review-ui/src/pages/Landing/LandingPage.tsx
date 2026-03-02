import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import qrCartoon from '../../assets/qrCartoon.png'

export default function LandingPage() {
  const [fadeIn, setFadeIn] = useState(false);

  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 4);
    }, 2000); // change screen every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR — Premium SaaS style */}
      <nav
        className="
    fixed top-0 left-0 w-full z-50
    bg-white/70 backdrop-blur-xl
    border-b border-gray-200
    px-8 py-5 flex items-center justify-between
    transition-all duration-300
  "
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
        h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center
        text-white font-bold text-lg shadow-sm
        group-hover:scale-105 transition-transform
      "
          >
            R
          </div>

          <span
            className="
        text-2xl font-semibold tracking-tight text-gray-900
        group-hover:text-indigo-600 transition-colors
      "
          >
            ReviewQR
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="
        px-4 py-2 rounded-lg font-medium text-gray-700
        hover:bg-gray-100 transition-all
      "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
        px-5 py-2.5 rounded-lg font-semibold text-white
        bg-indigo-600 hover:bg-indigo-700
        shadow-sm hover:shadow-md
        transition-all active:scale-[.97]
      "
          >
            Register
          </Link>
        </div>
      </nav>

      {/* HERO — with floating illustration + glow + fade-up */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 mt-32 gap-10 max-w-6xl mx-auto">

        {/* Left: Text */}
        <div className="text-center md:text-left md:w-1/2">
          <h2
            className={`
              text-4xl md:text-5xl font-bold tracking-tight text-gray-900
              transition-all duration-700 animate-fadeUp
            `}
          >
            Get More Reviews Instantly
            <span className="text-indigo-600"> With One Scan</span>
          </h2>

          <p
            className="
              mt-4 text-gray-600 max-w-md animate-fadeUp opacity-0
              [animation-delay:200ms]
            "
          >
            ReviewQR helps small businesses collect more 5‑star reviews using
            beautifully branded QR codes and a smart review funnel.
          </p>

          <Link
            to="/register"
            className="
              mt-8 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg
              text-lg font-semibold shadow-sm hover:bg-indigo-700
              transition-all duration-300 hover:scale-[1.03] active:scale-[.98]
              animate-fadeUp opacity-0 [animation-delay:350ms]
            "
          >
            Get Started Free
          </Link>
        </div>

        {/* Right: Illustration */}
        <div className="relative md:w-1/2 flex justify-center items-center animate-fadeUp opacity-0 [animation-delay:450ms]">
          <div className="absolute inset-0 bg-indigo-300/30 rounded-3xl blur-3xl opacity-60 animate-pulse-slow"></div>

          <img
            src={qrCartoon}
            alt="QR Illustration"
            className="w-72 md:w-96 relative z-10 animate-float"
          />
        </div>
      </div>

      {/* FEATURES — staggered fade-up */}
      <div className="mt-24 px-6 max-w-6xl mx-auto pb-20">
        <h2
          className="
            text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12
            animate-fadeUp opacity-0
          "
        >
          Powerful Features Built for Local Businesses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Branded QR Codes",
              desc: "Customize colors, logos, and styles to match your business identity.",
              icon: "🎨",
            },
            {
              title: "Smart Review Funnel",
              desc: "Send happy customers to Google and collect private feedback from others.",
              icon: "🚀",
            },
            {
              title: "Real-Time Analytics",
              desc: "Track scans, reviews, and performance from a clean dashboard.",
              icon: "📊",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="
              group relative p-8 rounded-2xl bg-white/80 backdrop-blur-xl
              border border-gray-200 shadow-sm
              transition-all duration-500
              hover:shadow-xl hover:-translate-y-2
              hover:bg-white
            "
              style={{ animationDelay: `${300 + i * 150}ms` }}
            >
              {/* Glow */}
              <div className="
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40
              bg-gradient-to-br from-indigo-200 to-purple-200
              blur-2xl transition-all duration-500
            " />

              {/* Icon */}
              <div className="relative text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              <h3 className="relative text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="relative text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* HOW IT WORKS */}
      <div className="py-24 bg-white border-t border-gray-200 relative">
      <div className="absolute inset-0 pointer-events-none animate-pulseSlow bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_75%)]"></div>
        {/* Section Title */}
        <h3
          className="
    text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16
    animate-fadeUp opacity-0
  "
        >
          How It Works
        </h3>

        {/* Connector Line (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-[260px] -translate-x-1/2 w-[60%] h-[2px] bg-gray-200"></div>
        

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative z-10">

          {[
            { icon: "📱", title: "Scan the QR", desc: "Customers scan your branded QR code." },
            { icon: "⭐", title: "Leave a Review", desc: "They’re guided to your review funnel." },
            { icon: "📈", title: "Grow Reputation", desc: "You collect more 5‑star reviews." },
          ].map((step, i) => (
            <div
              key={i}
              className="text-center opacity-0 animate-fadeUp"
              style={{ animationDelay: `${200 + i * 200}ms` }}
            >
              {/* Step Number Ring */}
              <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                <div className="
          absolute inset-0 rounded-full border-2 border-indigo-300
          opacity-30 animate-ping
        "></div>

                <div className="
          relative w-16 h-16 rounded-full bg-white border border-gray-300
          shadow-sm flex items-center justify-center text-lg font-bold text-gray-700
        ">
                  {i + 1}
                </div>
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4 animate-pop">{step.icon}</div>

              {/* Title */}
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h4>

              {/* Description */}
              <p className="text-gray-600 max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
      {/* SEE IT IN ACTION */}
      <div className="py-28 bg-white border-t border-gray-200 relative overflow-hidden">

        {/* Section Title */}
        <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-20 animate-fadeUp">
          See It In Action
        </h3>

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 to-transparent blur-3xl pointer-events-none"></div>

        {/* Phone Wrapper */}
        <div className="flex justify-center">
          <div
            className="
      relative w-[320px] h-[600px]
      rounded-[2.2rem] bg-black shadow-[0_20px_40px_rgba(0,0,0,0.25)]
      overflow-hidden border border-gray-800
      transition-transform duration-700
      hover:-translate-y-2 hover:rotate-1
    "
          >

            {/* Reflection Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

            {/* Screen 1 — Scan QR */}
            <div
              className={`
        absolute inset-0 flex flex-col items-center justify-center
        bg-white px-6 transition-all duration-700
        ${demoStep === 0 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
            >
              <div className="text-6xl mb-4 animate-pop">📱</div>
              <p className="text-gray-700 font-medium mb-4">Scan the QR Code</p>

              <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200 animate-float">
                <QRCodeCanvas
                  value="https://reviewqr.com/demo"
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin={false}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Screen 2 — Review Page */}
            <div
              className={`
        absolute inset-0 flex flex-col items-center justify-center
        bg-white px-6 transition-all duration-700
        ${demoStep === 1 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
            >
              <div className="text-5xl mb-3 animate-pop">⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-gray-700 font-medium mb-4">Leave a Review</p>

              <input
                type="text"
                placeholder="Write your feedback..."
                className="
          w-full px-4 py-2 rounded-xl border border-gray-300
          text-gray-700 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition-all shadow-sm
        "
              />
            </div>

            {/* Screen 3 — Success */}
            <div
              className={`
        absolute inset-0 flex flex-col items-center justify-center
        bg-white transition-all duration-700
        ${demoStep === 2 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
            >
              <svg
                className="w-20 h-20 text-green-500 animate-draw"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 48 48"
              >
                <path d="M12 24l8 8 16-16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-gray-700 font-medium mt-4">Success!</p>
            </div>

            {/* Screen 4 — Analytics */}
            <div
              className={`
        absolute inset-0 flex flex-col items-center justify-center
        bg-white px-6 transition-all duration-700
        ${demoStep === 3 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
            >
              <p className="text-gray-700 font-medium mb-4">Track Your Analytics</p>

              <div className="w-full bg-gray-100 rounded-xl p-4 shadow-inner">
                <div className="flex items-end gap-2 h-32">

                  <div className="w-6 bg-indigo-300 rounded-t-lg animate-bar1"></div>
                  <div className="w-6 bg-indigo-400 rounded-t-lg animate-bar2"></div>
                  <div className="w-6 bg-indigo-500 rounded-t-lg animate-bar3"></div>
                  <div className="w-6 bg-indigo-400 rounded-t-lg animate-bar4"></div>
                  <div className="w-6 bg-indigo-300 rounded-t-lg animate-bar5"></div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="relative bg-gray-50 py-24 px-6 border-t border-gray-200 overflow-hidden">

        {/* Soft Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/40 to-transparent blur-3xl opacity-60 pointer-events-none"></div>

        {/* Section Title */}
        <h3
          className="
    text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16
    animate-fadeUp opacity-0
  "
        >
          Loved by Local Businesses
        </h3>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10">

          {[
            {
              name: "Sarah M.",
              role: "Salon Owner",
              text: "We doubled our Google reviews in 3 weeks. Customers love how easy it is.",
            },
            {
              name: "Daniel R.",
              role: "Restaurant Manager",
              text: "The QR codes look amazing on our tables. ReviewQR is a game changer.",
            },
            {
              name: "Lena K.",
              role: "Fitness Studio Owner",
              text: "Finally a tool that makes reviews effortless. Highly recommended.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="
        group relative p-8 bg-white rounded-2xl border border-gray-200
        shadow-sm transition-all duration-500 opacity-0 animate-fadeUp
        hover:shadow-xl hover:-translate-y-2 hover:rotate-[0.3deg]
      "
              style={{ animationDelay: `${400 + i * 150}ms` }}
            >

              {/* Glow Behind Card */}
              <div className="
        absolute inset-0 rounded-2xl bg-gradient-to-br
        from-indigo-200/30 to-purple-200/30 blur-2xl opacity-0
        group-hover:opacity-40 transition-all duration-500
      "></div>

              {/* Avatar + Info */}
              <div className="relative flex items-center gap-4 mb-4">

                {/* Avatar Container */}
                <div className="relative">
                  {/* Glow Ring */}
                  <div className="
            absolute inset-0 rounded-full border-2 border-indigo-400
            opacity-30 animate-ping
          "></div>

                  {/* Avatar */}
                  <div className="
            relative w-12 h-12 rounded-full bg-indigo-600
            flex items-center justify-center text-white font-bold shadow-md
          ">
                    {t.name[0]}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="relative text-gray-700 italic leading-relaxed">
                “{t.text}”
              </p>
            </div>
          ))}

        </div>
      </div>


      {/* FOOTER */}
      <footer className="relative bg-white border-t border-gray-200 pt-20 pb-10 overflow-hidden">

        {/* Soft Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/40 to-transparent blur-3xl opacity-60 pointer-events-none"></div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">

          {/* Brand Block */}
          <div className="
    p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-sm
    hover:shadow-md transition-all
  ">
            <h4 className="text-2xl font-bold text-gray-900 mb-3">ReviewQR</h4>
            <p className="text-gray-600 leading-relaxed">
              Helping small businesses grow through the power of customer reviews.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Product</h5>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-gray-900 transition cursor-pointer">Features</li>
              <li className="hover:text-gray-900 transition cursor-pointer">Pricing</li>
              <li className="hover:text-gray-900 transition cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Company</h5>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-gray-900 transition cursor-pointer">About</li>
              <li className="hover:text-gray-900 transition cursor-pointer">Contact</li>
              <li className="hover:text-gray-900 transition cursor-pointer">Support</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-400 mt-6 text-sm relative z-10">
          © {new Date().getFullYear()} ReviewQR. All rights reserved.
        </p>
      </footer>
    </div>
  )
}