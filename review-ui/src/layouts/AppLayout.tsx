import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";


export default function AppLayout({ children, slug, business }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-gray-50 overflow-x-hidden">

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="
                fixed top-0 left-0 h-full w-64 
                bg-white shadow-xl z-50
                px-4 py-5
              "
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              <Sidebar slug={slug} business={business} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white border-r border-gray-200">
        <Sidebar slug={slug} business={business} />
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* TOP BAR */}
        <div className="h-14 md:h-16 px-4 md:px-6 flex items-center border-b border-gray-200 bg-white">
          <TopBar onMenuClick={() => setOpen(true)} />
        </div>

        {/* CONTENT */}
        <main className="w-full px-4 sm:px-6 lg:px-12 py-6 max-w-full md:max-w-6xl lg:max-w-7xl xl:max-w-[1400px] mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
}