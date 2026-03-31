// src/components/ProductModal.jsx
import React, { useEffect, useState } from "react";
import { X, ShoppingCart, Check, Package, Tag, Layers, Zap } from "lucide-react";
import useCartStore from "@/store/cartStore";

const ProductModal = ({ product, onClose }) => {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!product) return null;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const inStock = product.stock === undefined || product.stock > 0;
  const isLow   = product.stock !== undefined && product.stock > 0 && product.stock < 5;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,102,255,0.45), 0 0 40px rgba(0,102,255,0.15); }
          50%       { box-shadow: 0 0 32px rgba(0,102,255,0.7),  0 0 64px rgba(0,102,255,0.3); }
        }
        @keyframes glow-ring {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        .animate-modal-in  { animation: modal-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        .glow-btn          { animation: glow-pulse 2.5s ease-in-out infinite; }
        .glow-ring-anim    { animation: glow-ring 1.5s ease-out infinite; }
      `}</style>

      {/* Panel */}
      <div
        className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-white/10 rounded-full border border-white/10 transition-all"
        >
          <X size={18} />
        </button>

        {/* Image side */}
        <div className="md:w-1/2 relative bg-white/5 aspect-square md:aspect-auto flex-shrink-0 overflow-hidden">
          {/* Subtle ping ring behind image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full border-[6px] border-[#0066FF]/30 animate-[ping_3s_ease-in-out_infinite]" />
            <div className="absolute w-64 h-64 rounded-full bg-[#0066FF]/15 blur-[60px]" />
          </div>

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover relative z-10"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <Package size={80} className="text-white/15" />
            </div>
          )}

          {/* Bottom fade for mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 via-transparent to-transparent md:hidden z-20" />

          {/* Category badge */}
          {product.category && (
            <span className="absolute top-4 left-4 z-30 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF] text-white px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Info side */}
        <div className="flex flex-col flex-1 p-6 md:p-8 overflow-y-auto">
          {/* SKU */}
          {(product.sku || product.id) && (
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-2">
              SKU: {product.sku ?? product.id}
            </p>
          )}

          <h2 className="text-2xl md:text-3xl font-black uppercase italic leading-tight mb-3">
            {product.name}
          </h2>

          {/* Stock LED indicator */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border mb-5 w-fit ${
            !inStock ? "bg-red-500/15 border-red-500/30 text-red-400"
            : isLow  ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
            :          "bg-green-500/15 border-green-500/30 text-green-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              !inStock ? "bg-red-400" : isLow ? "bg-yellow-400 animate-pulse" : "bg-green-400 animate-pulse"
            }`} />
            {!inStock ? "Sin Stock" : isLow ? `Últimas ${product.stock} unidades` : "Disponible"}
          </div>

          {product.description && (
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {product.description}
            </p>
          )}

          {/* Flavours */}
          {product.sabores?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2">
                <Layers size={12} /> Sabores disponibles
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sabores.map((s) => (
                  <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specs */}
          {product.especificaciones && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2">
                <Tag size={12} /> Especificaciones
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
            {/* Price */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <span
                  className="text-5xl font-black leading-none"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #0066FF 0%, #00c8ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ${Number(product.price).toLocaleString("es-CO")}
                </span>
                <span className="text-gray-500 text-sm ml-2">COP</span>
              </div>
            </div>

            {/* Add to cart — glow button */}
            <div className="relative">
              {/* Glow ring behind button */}
              {inStock && !added && (
                <div className="absolute inset-0 rounded-xl border border-[#0066FF]/60 glow-ring-anim pointer-events-none" />
              )}
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={`relative w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase tracking-wider text-base transition-all duration-300 ${
                  added
                    ? "bg-green-500 scale-95"
                    : !inStock
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-[#0066FF] hover:bg-[#0055DD] glow-btn active:scale-95"
                }`}
              >
                {added ? (
                  <><Check size={20} /> ¡Agregado al Carrito!</>
                ) : (
                  <><Zap size={18} /><ShoppingCart size={18} /> Agregar al Carrito</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
