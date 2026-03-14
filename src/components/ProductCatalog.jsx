// src/components/ProductCatalog.jsx
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import useProducts from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

// Skeleton loader individual
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

  return (
    <>
      <section id="productos" className="py-16 px-6">
        {/* Encabezado de sección */}
        <div className="text-center mb-12">
          <p className="text-[#0066FF] text-sm font-bold uppercase tracking-[0.3em] mb-3">
            Catálogo
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic">
            Nuestros <span className="text-[#0066FF]">Productos</span>
          </h2>
          <div className="mt-4 h-px w-24 bg-[#0066FF]/50 mx-auto" />
        </div>

        {/* Estado de error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 max-w-lg mx-auto mb-8">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">Error al cargar productos: {error}</p>
          </div>
        )}

        {/* Grid de productos o skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={setSelectedProduct}
                />
              ))}
        </div>

        {/* Estado vacío */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            <p className="text-lg">No hay productos disponibles por ahora.</p>
            <p className="text-sm mt-2">¡Vuelve pronto!</p>
          </div>
        )}
      </section>

      {/* Modal de Producto */}
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
