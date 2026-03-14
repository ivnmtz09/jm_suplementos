// src/components/ProductModal.jsx
import React, { useEffect, useState } from "react";
import { X, ShoppingCart, Check, Package, Tag, Layers } from "lucide-react";
import useCartStore from "@/store/cartStore";

const ProductModal = ({ product, onClose }) => {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!product) return null;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full transition-all"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        {/* Imagen */}
        <div className="md:w-1/2 relative bg-white/5 aspect-square md:aspect-auto flex-shrink-0 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={80} className="text-white/15" />
            </div>
          )}

          {/* Gradient overlay en imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent md:hidden" />

          {/* Badge categoría */}
          {product.category && (
            <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-6 md:p-8 overflow-y-auto">
          {/* SKU */}
          {(product.sku || product.id) && (
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">
              SKU: {product.sku ?? product.id}
            </p>
          )}

          <h2 className="text-2xl md:text-3xl font-black uppercase italic leading-tight mb-4">
            {product.name}
          </h2>

          {/* Descripción */}
          {product.description && (
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Sabores / variantes */}
          {product.sabores && product.sabores.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2">
                <Layers size={12} />
                Sabores disponibles
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sabores.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Especificaciones extra */}
          {product.especificaciones && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2">
                <Tag size={12} />
                Especificaciones
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                {Object.entries(product.especificaciones).map(([k, v]) => (
                  <li key={k} className="flex gap-2">
                    <span className="text-gray-600 capitalize">{k}:</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto">
            {/* Precio + stock */}
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-4xl font-black text-[#0066FF]">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-gray-500 text-sm ml-1">COP</span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  inStock ? "text-green-400" : "text-red-400"
                }`}
              >
                {inStock
                  ? product.stock !== undefined
                    ? `${product.stock} en stock`
                    : "Disponible"
                  : "Sin stock"}
              </span>
            </div>

            {/* Botón añadir */}
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase tracking-wider text-base transition-all duration-300
                ${
                  added
                    ? "bg-green-500 scale-95 shadow-lg shadow-green-500/30"
                    : !inStock
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-[#0066FF] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                }`}
            >
              {added ? (
                <>
                  <Check size={20} />
                  ¡Agregado al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Agregar al Carrito
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease-out both; }
      `}</style>
    </div>
  );
};

export default ProductModal;
