// src/pages/StorePage.jsx
// The public-facing store (moved from App.jsx)
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import useCartStore, { selectItemCount } from "@/store/cartStore";
import { MessageCircle, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "¡Hola! Quiero más información sobre sus productos 💪"
  )}`;
  return (
    <section id="contacto" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#0066FF] text-sm font-bold uppercase tracking-[0.3em] mb-3">
          Contáctanos
        </p>
        <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-4">
          ¿Tienes <span className="text-[#0066FF]">dudas?</span>
        </h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Nuestro equipo está listo para asesorarte sobre el suplemento ideal para tus objetivos.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <MessageCircle size={22} className="text-[#0066FF]" />, label: "WhatsApp", value: "+57 305 309 7602" },
            { icon: <MapPin size={22} className="text-[#0066FF]" />, label: "Ubicación", value: "Colombia 🇨🇴" },
            { icon: <Clock size={22} className="text-[#0066FF]" />, label: "Atención", value: "Lun – Sáb, 8am–8pm" },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#0066FF]/30 transition-all"
            >
              {icon}
              <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
              <span className="text-sm font-semibold">{value}</span>
            </div>
          ))}
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full font-black uppercase tracking-wider transition-all hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 active:scale-95"
        >
          <MessageCircle size={20} />
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
};

const StorePage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore(selectItemCount);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0066FF]/30">
      <Navbar onCartClick={() => setIsCartOpen(true)} cartCount={itemCount} />
      <main className="max-w-7xl mx-auto">
        <div id="inicio">
          <HeroSection />
        </div>
        <ProductCatalog />
        <ContactSection />
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  );
};

export default StorePage;
