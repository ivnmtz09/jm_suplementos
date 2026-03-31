import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans selection:bg-[#0066FF]/30 selection:text-white relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex items-center justify-between border-b border-blue-500/20 bg-[#050510]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-1">
              JM<span className="text-[#0066FF]">SUPPS</span>
            </h2>
          </div>
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Portal</p>
        </div>

        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
