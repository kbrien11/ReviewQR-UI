import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

export default function AppLayout({ children, slug }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
  
      {/* SIDEBAR */}
      <div className="
        w-64 border-r border-gray-200 bg-white
        flex-shrink-0
      ">
        <Sidebar slug={slug} />
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