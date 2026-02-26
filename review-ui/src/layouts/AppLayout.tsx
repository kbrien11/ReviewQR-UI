import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

export default function AppLayout({ children, slug, business }) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="
                    w-64 
                    min-h-screen        /* <-- REQUIRED */
                    flex-shrink-0
                    bg-[#F8F6FF]        /* <-- move purple background here */
                    border-r border-gray-200
                  ">
        <Sidebar slug={slug} business={business} />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR — Vercel style */}
        <div className="
          h-16 px-6 flex items-center justify-between
          border-b border-gray-200 bg-white
        ">
          <TopBar />
        </div>

        {/* CONTENT */}
        <main className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}