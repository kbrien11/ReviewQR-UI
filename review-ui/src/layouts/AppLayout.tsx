import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

export default function AppLayout({ children, slug }) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar slug={slug} />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  }