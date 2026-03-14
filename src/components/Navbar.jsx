// src/components/Navbar.jsx
import React, { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio",    href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "Contacto",  href: "#contacto" },
];

/** Scroll suave al id de la sección */
const scrollTo = (href) => {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Navbar = ({ onCartClick, cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLink = (e, href) => {
    e.preventDefault();
    scrollTo(href);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#050505]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <button
        onClick={(e) => handleLink(e, "#inicio")}
        className="text-2xl font-black text-[#0066FF] tracking-tight italic hover:opacity-90 transition-opacity"
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

      {/* Right side: Cart + Mobile Toggle */}
      <div className="flex items-center gap-3">
        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-white/5 rounded-full transition-all"
          aria-label="Abrir carrito"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#0066FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-white/5 rounded-full transition-all"
          aria-label="Menú"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 md:hidden">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
