import React from "react";

const HeroSection = () => {
  return (
    <section className="text-center py-20 px-6">
      <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 italic uppercase leading-tight">
        Potencia tu <span className="text-[#0066FF]">Rendimiento</span>
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
        La mejor suplementación para atletas que no se conforman con lo básico.
        Descubre productos premium para maximizar tu potencial.
      </p>
      <button className="bg-[#0066FF] hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold uppercase transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
        Ver Catálogo
      </button>
    </section>
  );
};

export default HeroSection;
