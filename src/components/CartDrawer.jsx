// src/components/CartDrawer.jsx
import React, { useState } from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import useCartStore, { selectTotal } from "@/store/cartStore";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

/** Modal simple para capturar el nombre del cliente antes de enviar a WhatsApp */
const ClientNameModal = ({ onConfirm, onCancel }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(name.trim() || "Cliente");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d0d14] border border-white/15 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-black uppercase tracking-wider mb-1">
          Un último paso 👋
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Ingresa tu nombre para personalizar tu pedido en WhatsApp.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            autoFocus
            type="text"
            placeholder="Tu nombre (ej: Juan García)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#0066FF]/60 transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Confirmar y enviar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose }) => {
  const items        = useCartStore((s) => s.items);
  const removeItem   = useCartStore((s) => s.removeItem);
  const updateQty    = useCartStore((s) => s.updateQuantity);
  const total        = useCartStore(selectTotal);

  const [showNameModal, setShowNameModal] = useState(false);

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    setShowNameModal(true);
  };

  const handleConfirmName = (clientName) => {
    setShowNameModal(false);
    const url = buildWhatsAppUrl(items, clientName);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Overlay del drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-black uppercase tracking-wider">
            Carrito
            {items.length > 0 && (
              <span className="ml-2 text-sm font-bold text-[#0066FF]">
                ({items.length} {items.length === 1 ? "ítem" : "ítems"})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-all"
            aria-label="Cerrar carrito"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <ShoppingBag size={36} className="text-white/20" />
              </div>
              <div>
                <p className="font-bold text-white/50 uppercase tracking-wider">
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Agrega productos para comenzar
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all"
                >
                  {/* Imagen */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm uppercase tracking-wide truncate">
                      {item.name}
                    </h3>
                    {item.sku && (
                      <p className="text-[10px] text-gray-600 font-mono">
                        SKU: {item.sku}
                      </p>
                    )}
                    <p className="text-[#0066FF] font-black text-base">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Controles */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:text-red-400 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 bg-white/10 hover:bg-[#0066FF]/40 rounded-full flex items-center justify-center transition-all"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con Total y Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 shrink-0 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 uppercase text-sm tracking-wider">
                Total
              </span>
              <span className="text-2xl font-black text-[#0066FF]">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 active:scale-95 text-white py-4 rounded-xl font-black uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-green-500/30"
            >
              <MessageCircle size={20} />
              Finalizar por WhatsApp
            </button>

            <p className="text-center text-xs text-gray-600">
              Serás redirigido a WhatsApp para confirmar tu pedido
            </p>
          </div>
        )}
      </div>

      {/* Modal de nombre del cliente */}
      {showNameModal && (
        <ClientNameModal
          onConfirm={handleConfirmName}
          onCancel={() => setShowNameModal(false)}
        />
      )}
    </>
  );
};

export default CartDrawer;
