import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold text-[#0066FF]">
            JM SUPLEMENTOS
          </div>

          <div className="flex gap-6">
            <a
              href="#"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2024 JM Suplementos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
