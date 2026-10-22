
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./context/ProtectedRoute";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login/Login"));
const LandingPage = lazy(() => import("./pages/Landing/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Reviews = lazy(() => import("./pages/Reviews/Reviews"));
const QRPreview = lazy(() => import("./pages/QRPreview/QrPreview"));
const LeaveReviewPage = lazy(
  () => import("./pages/Reviews/LeaveReviewPage")
);
const BusinessQRPage = lazy(
  () => import("./pages/BusinessQRPage/BusinessQRPage")
);
const Register = lazy(() => import("./pages/Register/Register"));
const TeamMembers = lazy(() => import("./pages/TeamMembers/TeamMembers"));
const PlanAndBilling = lazy(
  () => import("./pages/PlanAndBilling/PlanAndBilling")
);
const IncentiveManager = lazy(
  () => import("./pages/Incentive/IncentiveManager")
);
const AboutAdyenIntegration = lazy(
  () => import("./pages/AboutAdyenIntegration/AboutAdyenIntegration")
);
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-gray-500">
          Loading page...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />

        <div
          className="
            min-h-screen bg-gray-50
            overflow-x-hidden
            pt-[env(safe-area-inset-top)]
            pb-[env(safe-area-inset-bottom)]
          "
        >
          <div className="w-full mx-auto max-w-full md:max-w-6xl lg:max-w-7xl xl:max-w-[1400px]">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/about"
                  element={<AboutAdyenIntegration />}
                />

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

                <Route
                  path="/review/:slug"
                  element={<LeaveReviewPage />}
                />

                <Route
                  path="/business/:slug/qr"
                  element={<BusinessQRPage />}
                />

                <Route
                  path="/admin/team/:business"
                  element={<TeamMembers />}
                />

                <Route
                  path="/admin/plan/:business"
                  element={<PlanAndBilling />}
                />

                <Route
                  path="/admin/reward"
                  element={<IncentiveManager />}
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
