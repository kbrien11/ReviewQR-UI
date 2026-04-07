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
  const testimonials = [
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
    {
      name: "Marcus T.",
      role: "Barbershop Owner",
      text: "Our customers scan the code right after their cut. Reviews shot up instantly.",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <nav
        className="
    fixed top-0 left-0 w-full z-50
    bg-white/80 backdrop-blur-xl
    border-b border-gray-200
    px-4 py-3
    flex items-center justify-between
    transition-all duration-300
  "
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="
        h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center
        text-white font-bold text-base shadow-sm
        group-hover:scale-105 transition-transform
      "
          >
            R
          </div>

          <span
            className="
        text-xl font-semibold tracking-tight text-gray-900
        group-hover:text-indigo-600 transition-colors
      "
          >
            ReviewQR
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="
        px-3 py-1.5 rounded-lg font-medium text-gray-700 text-sm
        hover:bg-gray-100 transition-all
      "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
        px-4 py-2 rounded-lg font-semibold text-white text-sm
        bg-indigo-600 hover:bg-indigo-700
        shadow-sm hover:shadow-md
        transition-all active:scale-[.97]
      "
          >
            Register
          </Link>
        </div>
      </nav>

      {/* HERO — Mobile-first premium */}
      <div className="
  flex flex-col-reverse md:flex-row
  items-center justify-between
  px-5 max-w-6xl mx-auto
  mt-20 md:mt-32
  gap-12 md:gap-10
">

        {/* Left: Text */}
        <div className="text-center md:text-left md:w-1/2 space-y-5">
          <h2
            className="
        text-3xl leading-tight md:text-5xl font-bold tracking-tight text-gray-900
        animate-fadeUp
      "
          >
            Get More Reviews Instantly
            <span className="text-indigo-600"> With One Scan</span>
          </h2>

          <p
            className="
        text-gray-600 text-[15px] leading-relaxed
        max-w-sm mx-auto md:mx-0
        animate-fadeUp opacity-0 [animation-delay:200ms]
      "
          >
            ReviewQR helps small businesses collect more 5‑star reviews using
            beautifully branded QR codes and a smart review funnel.
          </p>

          <Link
            to="/register"
            className="
        inline-block
        px-5 py-3 rounded-xl
        bg-indigo-600 text-white font-semibold text-[15px]
        shadow-md hover:bg-indigo-700
        transition-all duration-300
        hover:scale-[1.03] active:scale-[.98]
        animate-fadeUp opacity-0 [animation-delay:350ms]
      "
          >
            Get Started Free
          </Link>
        </div>

        {/* Right: Illustration */}
        <div className="
    relative md:w-1/2 flex justify-center items-center
    animate-fadeUp opacity-0 [animation-delay:450ms]
  ">
          <div className="
      absolute inset-0
      bg-indigo-300/20 rounded-3xl blur-2xl opacity-60
      md:blur-3xl md:opacity-70
      animate-pulse-slow
    "></div>

          <img
            src={qrCartoon}
            alt="QR Illustration"
            className="
        w-56 md:w-96 relative z-10
        animate-float
      "
          />
        </div>
      </div>

      {/* FEATURES — Mobile-first, Desktop-scaled */}
      <div className="mt-20 px-5 md:px-10 lg:px-20 max-w-6xl mx-auto pb-20">

        <h2
          className="
    text-2xl md:text-4xl font-bold text-center text-gray-900
    mb-10 md:mb-16
    leading-snug
    animate-fadeUp opacity-0
  "
        >
          Powerful Features Built for Local Businesses
        </h2>

        <div
          className="
    flex flex-col md:grid md:grid-cols-3
    gap-6 md:gap-10
  "
        >
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
        relative p-5 md:p-7 rounded-2xl
        bg-white/90 backdrop-blur-xl
        border border-gray-200 shadow-sm
        flex items-start gap-4 md:gap-5
        transition-all duration-500
        hover:shadow-xl hover:-translate-y-2
      "
              style={{ animationDelay: `${200 + i * 120}ms` }}
            >
              {/* Icon container */}
              <div
                className="
          h-12 w-12 md:h-16 md:w-16 rounded-xl
          bg-indigo-100 text-indigo-600
          flex items-center justify-center
          text-2xl md:text-3xl
          shadow-sm
        "
              >
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-[15px] md:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS — Mobile + Desktop Premium */}
      <div className="py-16 md:py-28  relative">

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_75%)]"></div>

        <h3
          className="
    text-2xl md:text-4xl font-bold text-center text-gray-900
    mb-12 md:mb-20
    animate-fadeUp opacity-0
  "
        >
          How It Works
        </h3>

        <div className="
  grid grid-cols-1 md:grid-cols-3
  gap-10 md:gap-14
  max-w-5xl mx-auto
  px-6 md:px-0
  relative z-10
">
          {[
            { icon: "📱", title: "Scan the QR", desc: "Customers scan your branded QR code." },
            { icon: "⭐", title: "Leave a Review", desc: "They’re guided to your review funnel." },
            { icon: "📈", title: "Grow Reputation", desc: "You collect more 5‑star reviews." },
          ].map((step, i) => (
            <div
              key={i}
              className="
        bg-white/90 backdrop-blur-xl
        border border-gray-200 shadow-sm
        rounded-2xl p-6 md:p-8 text-center
        animate-fadeUp opacity-0
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-2
      "
              style={{ animationDelay: `${200 + i * 180}ms` }}
            >
              <div className="relative mx-auto mb-5 md:mb-7 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-300 opacity-30 animate-ping"></div>
                <div className="relative w-full h-full rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-lg md:text-xl font-bold text-gray-700">
                  {i + 1}
                </div>
              </div>

              <div className="text-4xl md:text-5xl mb-3 md:mb-4">{step.icon}</div>

              <h4 className="text-lg md:text-2xl font-semibold text-gray-900 mb-1 md:mb-2">
                {step.title}
              </h4>

              <p className="text-gray-600 text-[15px] md:text-base leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* SEE IT IN ACTION */}
      <div className="py-28  relative overflow-hidden">

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

        {/* MOBILE CAROUSEL */}
        <div className="md:hidden overflow-hidden pb-4">
          <div className="carousel-track flex gap-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="
          min-w-[85%]
          group relative p-8 bg-white rounded-2xl border border-gray-200
          shadow-sm transition-all duration-500
        "
              >
                {/* Glow */}
                <div className="
          absolute inset-0 rounded-2xl bg-gradient-to-br
          from-indigo-200/30 to-purple-200/30 blur-2xl opacity-0
          group-hover:opacity-40 transition-all duration-500
        "></div>

                {/* Avatar */}
                <div className="relative flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="
              absolute inset-0 rounded-full border-2 border-indigo-400
              opacity-30 animate-ping
            "></div>

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

                <p className="relative text-gray-700 italic leading-relaxed">
                  “{t.text}”
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10">

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
            {
              name: "Marcus T.",
              role: "Barbershop Owner",
              text: "Our customers scan the code right after their cut. Reviews shot up instantly.",
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
                <div className="relative">
                  <div className="
            absolute inset-0 rounded-full border-2 border-indigo-400
            opacity-30 animate-ping
          "></div>

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

              <p className="relative text-gray-700 italic leading-relaxed">
                “{t.text}”
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Carousel Animation */}
<style>
  {`
.carousel-track {
  display: flex;
  gap: 24px;
  animation: carousel 8s linear infinite;
}

@keyframes carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-340vw - 72px)); }
}
`}
</style>


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