// src/components/ProductCatalog.jsx
import React, { useState, useMemo } from "react";
import { AlertCircle, Dumbbell, Zap, Flame, LayoutGrid } from "lucide-react";
import useProducts from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

const CATEGORIES = [
  { id: "all",          label: "Todos",           icon: <LayoutGrid size={14} /> },
  { id: "Proteínas",   label: "Proteínas",        icon: <Dumbbell size={14} /> },
  { id: "Creatina",    label: "Creatinas",        icon: <Zap size={14} /> },
  { id: "Pre-Entrenamiento", label: "Pre-Entrenos", icon: <Flame size={14} /> },
];

const SkeletonCard = () => (
  <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-square bg-white/10" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-2/3" />
      <div className="h-10 bg-white/10 rounded-xl mt-2" />
    </div>
  </div>
);

const ProductCatalog = () => {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter(
      (p) => (p.categoria ?? p.category ?? "").toLowerCase() === activeCategory.toLowerCase()
    );
  }, [products, activeCategory]);

  return (
    <>
      <section id="productos" className="py-16 px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <p className="text-[#0066FF] text-sm font-bold uppercase tracking-[0.3em] mb-3">
            Catálogo
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic">
            Nuestros <span className="text-[#0066FF]">Productos</span>
          </h2>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-[#0066FF]/70 to-transparent mx-auto" />
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${
                activeCategory === id
                  ? "bg-[#0066FF] border-[#0066FF] text-white shadow-lg shadow-[#0066FF]/30"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-[#0066FF]/40 hover:text-white"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 max-w-lg mx-auto mb-8">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">Error al cargar productos: {error}</p>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={setSelectedProduct}
                />
              ))}
        </div>

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center text-gray-600 py-16">
            <Dumbbell size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">
              {activeCategory === "all"
                ? "No hay productos disponibles por ahora."
                : `No hay productos en "${activeCategory}".`}
            </p>
          </div>
        )}
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductCatalog;
