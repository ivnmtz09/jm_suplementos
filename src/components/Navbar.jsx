import React, { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";

const Navbar = ({ onCartClick, cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#050505]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-[#0066FF]">JM SUPLEMENTOS</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider font-medium">
        <a href="#" className="hover:text-[#0066FF] transition-colors">
          Inicio
        </a>
        <a href="#" className="hover:text-[#0066FF] transition-colors">
          Productos
        </a>
        <a href="#" className="hover:text-[#0066FF] transition-colors">
          Contacto
        </a>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-full transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Cart Button */}
      <button
        onClick={onCartClick}
        className="relative p-2 hover:bg-white/5 rounded-full transition-all"
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#0066FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {cartCount}
          </span>
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            <a
              href="#"
              className="hover:text-[#0066FF] transition-colors text-sm uppercase tracking-wider font-medium"
            >
              Inicio
            </a>
            <a
              href="#"
              className="hover:text-[#0066FF] transition-colors text-sm uppercase tracking-wider font-medium"
            >
              Productos
            </a>
            <a
              href="#"
              className="hover:text-[#0066FF] transition-colors text-sm uppercase tracking-wider font-medium"
            >
              Contacto
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
