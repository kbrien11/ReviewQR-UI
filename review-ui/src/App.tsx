
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
// import Dashboard from './pages/Dashboard/Dashboard'
// import Reviews from './pages/Reviews/Reviews'
// import Analytics from './pages/Analytics/Analytics'
// import QRPreview from './pages/QRPreview/QRPreview'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/qr-preview" element={<QRPreview />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

