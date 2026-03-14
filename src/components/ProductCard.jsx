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

  return (
    <div
      className="group relative flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#0066FF]/50 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 cursor-pointer"
      onClick={() => onViewDetail?.(product)}
    >
      {/* Imagen */}
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

        {/* Badge de categoría */}
        {product.category && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-[#0066FF]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
            {product.category}
          </span>
        )}

        {/* Overlay "Ver Detalle" al hacer hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/90">
            <Eye size={16} />
            Ver Detalle
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-base uppercase tracking-wide leading-tight line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
          {/* Precio */}
          <span className="text-2xl font-black text-[#0066FF]">
            ${Number(product.price).toFixed(2)}
          </span>

          {/* Stock */}
          {product.stock !== undefined && (
            <span
              className={`text-xs font-medium ${
                product.stock > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
            </span>
          )}
        </div>

        {/* Botón Agregar */}
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all duration-300
            ${
              added
                ? "bg-green-500 hover:bg-green-500 scale-95"
                : !inStock
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-[#0066FF] hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            }`}
        >
          {added ? (
            <>
              <Check size={16} />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Agregar al Carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
