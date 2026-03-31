// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, LayoutDashboard, LogOut, Boxes } from "lucide-react";
import useAuthStore from "@/store/authStore";

const NAV_LINKS = [
  { label: "Inicio",    href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "Contacto",  href: "#contacto" },
];

const scrollTo = (href) => {
  const id = href.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Navbar = ({ onCartClick, cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, role, logout } = useAuthStore();

  const handleLink = (e, href) => {
    e.preventDefault();
    scrollTo(href);
    setIsMenuOpen(false);
  };

  const dashboardPath = role === "admin" ? "/admin/dashboard" : "/staff/inventario";
  const dashboardLabel = role === "admin" ? "Admin" : "Mi Panel";

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#050505]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <button
        onClick={(e) => handleLink(e, "#inicio")}
        className="text-xl sm:text-2xl font-black text-[#0066FF] tracking-tight italic hover:opacity-90 transition-opacity"
      >
        JM SUPLEMENTOS
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider font-medium">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => handleLink(e, href)}
            className="hover:text-[#0066FF] transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop Auth Buttons (only if authenticated) */}
        {user && (
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to={dashboardPath}
              className="flex items-center gap-1.5 bg-[#0066FF] hover:bg-[#0055DD] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-[#0066FF]/30 hover:-translate-y-0.5"
            >
              <LayoutDashboard size={13} />
              {dashboardLabel}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 px-3 py-2 transition-all border border-transparent hover:border-red-500/30 rounded-full"
            >
              <LogOut size={13} />
              Salir
            </button>
          </div>
        )}

        {/* Cart */}
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-white/5 rounded-full transition-all"
          aria-label="Abrir carrito"
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#0066FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-white/5 rounded-full transition-all"
          aria-label="Menú"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#050505]/98 backdrop-blur-md border-b border-white/10 md:hidden z-40">
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleLink(e, href)}
                className="hover:text-[#0066FF] transition-colors text-sm uppercase tracking-wider font-medium py-2"
              >
                {label}
              </a>
            ))}

            {/* Auth section in mobile (only if authenticated) */}
            {user && (
              <>
                <div className="w-full h-px bg-white/10 my-2" />
                <Link
                  to={dashboardPath}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0066FF] py-2"
                >
                  <LayoutDashboard size={16} />
                  {dashboardLabel}
                </Link>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0066FF] py-2"
                  style={{ display: role === "admin" ? undefined : "none" }}
                >
                  <Boxes size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-400 py-2"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
