import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import qrCartoon from '../../assets/qrCartoon.png'

export default function LandingPage() {
  const [fadeIn, setFadeIn] = useState(false);

  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3);
    }, 2000); // change screen every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR — Linear style with scroll blur */}
      <nav className="
        w-full flex justify-between items-center px-6 py-4 fixed top-0 left-0
        bg-white/80 border-b border-gray-200 backdrop-blur-xl
        shadow-sm z-50 transition-all duration-300
      ">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">ReviewQR</h1>

        <div className="flex gap-4">
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
              px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium
              hover:bg-indigo-700 transition-all active:scale-[.98]
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
                p-8 rounded-2xl bg-white border border-gray-200 shadow-sm
                hover:shadow-md hover:-translate-y-[2px] hover:scale-[1.01]
                transition-all duration-300 opacity-0 animate-fadeUp
              "
              style={{ animationDelay: `${300 + i * 150}ms` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="py-24 bg-white border-t border-gray-200">
        <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 animate-fadeUp">
          How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            { icon: "📱", title: "Scan the QR", desc: "Customers scan your branded QR code." },
            { icon: "⭐", title: "Leave a Review", desc: "They’re guided to your review funnel." },
            { icon: "📈", title: "Grow Reputation", desc: "You collect more 5‑star reviews." },
          ].map((step, i) => (
            <div
              key={i}
              className="text-center animate-fadeUp opacity-0"
              style={{ animationDelay: `${200 + i * 200}ms` }}
            >
              <div className="text-5xl mb-4 animate-pop">{step.icon}</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE DEMO — Animated Phone Preview */}
      <div className="py-24 bg-white border-t border-gray-200">
        <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 animate-fadeUp">
          See It In Action
        </h3>

        <div className="flex justify-center">
          <div className="relative w-[300px] h-[560px] rounded-3xl bg-black shadow-2xl overflow-hidden animate-float">

            {/* Screen 1 — Scan QR */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-700"
              style={{ opacity: demoStep === 0 ? 1 : 0 }}
            >
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-700 font-medium">Scan the QR Code</p>
            </div>

            {/* Screen 2 — Review Page */}
            {/* Screen 2 — Review Page */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-700 px-6"
              style={{ opacity: demoStep === 1 ? 1 : 0 }}
            >
              <div className="text-5xl mb-3">⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-gray-700 font-medium mb-4">Leave a Review</p>

              <input
                type="text"
                placeholder="Write your feedback..."
                className="
      w-full px-4 py-2 rounded-xl border border-gray-300
      text-gray-700 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-indigo-500
      transition-all
    "
              />
            </div>

            {/* Screen 3 — Success */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-700"
              style={{ opacity: demoStep === 2 ? 1 : 0 }}
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
          </div>
        </div>
      </div>

      {/* TESTIMONIALS — fade-up stagger */}
      <div className="bg-gray-50 py-20 px-6 border-t border-gray-200">
        <h3
          className="
            text-3xl md:text-4xl font-bold text-center text-gray-900 mb-14
            animate-fadeUp opacity-0
          "
        >
          Loved by Local Businesses
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
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
                p-8 bg-white rounded-2xl border border-gray-200 shadow-sm
                hover:shadow-md hover:-translate-y-[2px]
                transition-all duration-300 opacity-0 animate-fadeUp
              "
              style={{ animationDelay: `${500 + i * 150}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>

              <p className="text-gray-700 italic leading-relaxed">“{t.text}”</p>
            </div>
          ))}
        </div>
      </div>


      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 text-gray-700 py-10 mt-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between">
          <div>
            <h4 className="text-xl font-bold mb-2 text-gray-900">ReviewQR</h4>
            <p className="text-gray-500 max-w-xs">
              Helping small businesses grow through the power of customer reviews.
            </p>
          </div>

          <div className="flex gap-10 mt-6 md:mt-0">
            <div>
              <h5 className="font-semibold mb-2 text-gray-900">Product</h5>
              <ul className="space-y-1 text-gray-500">
                <li>Features</li>
                <li>Pricing</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-2 text-gray-900">Company</h5>
              <ul className="space-y-1 text-gray-500">
                <li>About</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-8 text-sm">
          © {new Date().getFullYear()} ReviewQR. All rights reserved.
        </p>
      </footer>
    </div>
  )
}