
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import LandingPage from './pages/Landing/LandingPage'
import Dashboard from './pages/Dashboard/Dashboard'
import Reviews from './pages/Reviews/Reviews'
import QRPreview from './pages/QRPreview/QrPreview'
import LeaveReviewPage from "./pages/Reviews/LeaveReviewPage";
import BusinessQRPage from "./pages/BusinessQRPage/BusinessQRPage";
import ProtectedRoute from "./context/ProtectedRoute";
import Register from "./pages/Register/Register";
import TeamMembers from "./pages/TeamMembers/TeamMembers";
// import Dashboard from './pages/Dashboard/Dashboard'
// import Reviews from './pages/Reviews/Reviews'
// import Analytics from './pages/Analytics/Analytics'
// import QRPreview from './pages/QRPreview/QRPreview'

export default function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL MOBILE WRAPPER */}
      <div className="
        min-h-screen bg-gray-50 overflow-x-hidden
        pt-[env(safe-area-inset-top)]
        pb-[env(safe-area-inset-bottom)]
      ">
        <div className="mx-auto w-full max-w-xl md:max-w-5xl">

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reviews/:business"
              element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              }
            />

            <Route
              path="/scans/:slug"
              element={
                <ProtectedRoute>
                  <QRPreview />
                </ProtectedRoute>
              }
            />

            <Route path="/review/:slug" element={<LeaveReviewPage />} />
            <Route path="/business/:slug/qr" element={<BusinessQRPage />} />
            <Route path="/admin/team/:business" element={<TeamMembers />} />
          </Routes>

        </div>
      </div>

    </BrowserRouter>
  );
}