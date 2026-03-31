// src/components/ProductCard.jsx
import React, { useState } from "react";
import { ShoppingCart, Check, Package, Eye } from "lucide-react";
import useCartStore from "@/store/cartStore";

const ProductCard = ({ product, onViewDetail }) => {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const inStock = product.stock === undefined || product.stock > 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock < 5;

  return (
    <div
      className="group relative flex flex-col bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#0066FF]/50 hover:-translate-y-1 cursor-pointer"
      style={{ "--hover-shadow": "0 4px 32px rgba(0,102,255,0.25)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 32px rgba(0,102,255,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
      onClick={() => onViewDetail?.(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-white/5 aspect-square">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-white/20" />
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
            {product.category}
          </span>
        )}

        {/* LED stock badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest border ${
          !inStock
            ? "bg-red-500/20 border-red-500/40 text-red-400"
            : isLowStock
            ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
            : "bg-green-500/20 border-green-500/40 text-green-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            !inStock ? "bg-red-400" : isLowStock ? "bg-yellow-400 animate-pulse" : "bg-green-400 animate-pulse"
          }`} />
          {!inStock ? "Agotado" : isLowStock ? "Últimas" : "Stock"}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/90">
            <Eye size={16} />
            Ver Detalle
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-sm uppercase tracking-wide leading-tight line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
          <span className="text-2xl font-black" style={{
            backgroundImage: "linear-gradient(135deg, #0066FF, #00aaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            ${Number(product.price).toLocaleString("es-CO")}
          </span>

          {product.stock !== undefined && (
            <span className={`text-xs font-bold ${
              product.stock > 0 ? "text-gray-500" : "text-red-400"
            }`}>
              {product.stock > 0 ? `${product.stock} u.` : "Sin stock"}
            </span>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-all duration-300 ${
            added
              ? "bg-green-500 scale-95"
              : !inStock
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-[#0066FF] hover:bg-blue-500 active:scale-95 shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:shadow-[0_0_30px_rgba(0,102,255,0.5)]"
          }`}
        >
          {added ? (
            <><Check size={15} /> Agregado</>
          ) : (
            <><ShoppingCart size={15} /> Agregar</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
