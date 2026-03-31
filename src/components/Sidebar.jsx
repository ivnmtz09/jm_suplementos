import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, LogOut, User, X } from "lucide-react";
import useAuthStore from "@/store/authStore";

const Sidebar = ({ isOpen, onClose }) => {
  const { role, user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Overlay para Móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#050510]/95 backdrop-blur-xl border-r border-blue-500/20 shadow-[4px_0_24px_rgba(0,102,255,0.05)] flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                JM<span className="text-[#0066FF]">SUPPS</span>
              </h2>
              <p className="text-xs text-blue-400/60 mt-1 uppercase tracking-widest font-bold">
                {role === "admin" ? "Admin Portal" : "Staff Portal"}
              </p>
            </div>
            {/* Botón de cerrar solo en móvil */}
            <button 
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-white focus:outline-none p-1"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-2 px-4">
            {role === "admin" && (
              <NavLink
                to="/admin/dashboard"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30 shadow-[0_0_15px_rgba(0,102,255,0.15)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <LayoutDashboard size={20} />
                <span className="font-semibold text-sm tracking-wide">Dashboard</span>
              </NavLink>
            )}

            <NavLink
              to="/staff/inventario"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30 shadow-[0_0_15px_rgba(0,102,255,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Package size={20} />
              <span className="font-semibold text-sm tracking-wide">Inventario</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-blue-500/20 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 mb-4 shadow-inner">
            <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF] flex-shrink-0">
              <User size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-white font-medium truncate">{user?.email}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/10 transition-all duration-300 font-semibold text-sm tracking-wide shadow-sm"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
