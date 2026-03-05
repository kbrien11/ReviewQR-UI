import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";


export default function AppLayout({ children, slug, business }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F6FF]">

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              className="
                fixed top-0 left-0 h-full w-64 
                bg-[#F8F6FF] shadow-xl z-50
                px-4 py-5
              "
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <Sidebar slug={slug} business={business} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 bg-[#F8F6FF] shadow-sm">
        <Sidebar slug={slug} business={business} />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-14 md:h-16 px-4 md:px-6 flex items-center border-b border-gray-200 bg-white">
          <TopBar onMenuClick={() => setOpen(true)} />
        </div>

        {/* CONTENT */}
        <main className="p-4 sm:p-6 w-full max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}