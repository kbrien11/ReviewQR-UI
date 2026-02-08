import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center px-6 py-4 fixed top-0 left-0 bg-white/70 backdrop-blur-md shadow-sm z-50">
  <h1 className="text-xl font-bold tracking-tight">ReviewQR</h1>

  <div className="flex gap-4">
    <Link
      to="/login"
      className="px-4 py-2 rounded-lg font-medium text-gray-700 transition-all duration-300 hover:bg-gray-200 hover:text-black hover:scale-105"
    >
      Login
    </Link>

    <Link
      to="/register"
      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:scale-105"
    >
      Register
    </Link>
  </div>
</nav>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-32">
        <h2
          className={`text-4xl md:text-5xl font-extrabold leading-tight transition-all duration-700 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Get More Reviews Instantly  
          <span className="text-blue-600"> With One Scan</span>
        </h2>

        <p
          className={`mt-4 text-gray-600 max-w-md transition-all duration-700 delay-200 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          ReviewQR helps small businesses collect more 5‑star reviews using
          beautifully branded QR codes and a smart review funnel.
        </p>

        <Link
          to="/register"
          className={`mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Get Started Free
        </Link>
      </div>

      {/* FEATURES */}
      <div className="mt-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-20">
        {[
          {
            title: "Branded QR Codes",
            desc: "Customize colors, logos, and styles to match your business identity.",
          },
          {
            title: "Smart Review Funnel",
            desc: "Send happy customers to Google and collect private feedback from others.",
          },
          {
            title: "Real-Time Analytics",
            desc: "Track scans, reviews, and performance from a clean dashboard.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-6 bg-white rounded-xl shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer ${
              fadeIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${300 + i * 150}ms` }}
          >
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-white py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">Loved by Local Businesses</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <p className="text-gray-700 italic mb-4">“{t.text}”</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10 mt-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between">
          <div>
            <h4 className="text-xl font-bold mb-2">ReviewQR</h4>
            <p className="text-gray-400 max-w-xs">
              Helping small businesses grow through the power of customer reviews.
            </p>
          </div>

          <div className="flex gap-10 mt-6 md:mt-0">
            <div>
              <h5 className="font-semibold mb-2">Product</h5>
              <ul className="space-y-1 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-2">Company</h5>
              <ul className="space-y-1 text-gray-400">
                <li>About</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          © {new Date().getFullYear()} ReviewQR. All rights reserved.
        </p>
      </footer>
    </div>
  );
}