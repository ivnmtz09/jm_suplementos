// src/components/HeroSection.jsx
import React from "react";
import { Zap, ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToCatalog = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Radial glow and dots */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(0,102,255,0.15) 0%, transparent 70%)"
        }}
      />
      
      {/* Subtle grid and dots overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px, 64px 64px, 32px 32px",
          backgroundPosition: "0 0, 0 0, 16px 16px"
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Label pill */}
        <div className="inline-flex items-center gap-2 border border-[#0066FF]/40 bg-[#0066FF]/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
          <Zap size={13} className="text-[#0066FF]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0066FF]">
            Suplementación de Élite
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase italic leading-none tracking-tight mb-6">
          <span className="block bg-gradient-to-r from-blue-600 via-cyan-400 to-white bg-clip-text text-transparent">
            POTENCIA TU
          </span>
          <span className="block bg-gradient-to-r from-white via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            RENDIMIENTO
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 max-w-2xl text-base sm:text-lg leading-relaxed mb-10">
          Suplementación de élite para atletas que{" "}
          <span className="text-white font-semibold">no aceptan excusas</span>.
          Fórmulas premium diseñadas para maximizar cada entrenamiento.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={scrollToCatalog}
            className="relative group flex items-center gap-2 bg-[#0066FF] hover:bg-[#0055DD] text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            style={{
              boxShadow: "0 0 30px rgba(0,102,255,0.4), 0 0 60px rgba(0,102,255,0.15)",
            }}
          >
            <Zap size={16} />
            Ver Catálogo
            {/* glow ring on hover */}
            <span className="absolute inset-0 rounded-full border border-[#0066FF] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          </button>

          <button
            onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors px-6 py-4 border border-white/10 hover:border-white/30 rounded-full"
          >
            Contactar
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-8 mt-14 text-center">
          {[
            { value: "100%", label: "Productos Originales" },
            { value: "24h", label: "Atención WhatsApp" },
            { value: "Elite", label: "Calidad Premium" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-[#0066FF]">{value}</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={scrollToCatalog}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 hover:text-[#0066FF] transition-colors animate-bounce"
        aria-label="Scroll al catálogo"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
};

export default HeroSection;
