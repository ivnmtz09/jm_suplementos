import React from "react";
import { X, ShoppingBag } from "lucide-react";

const CartDrawer = ({ isOpen, onClose, cartItems = [] }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold uppercase tracking-wider">
              Carrito
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-[#0066FF] font-bold">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20">
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-[#0066FF]">
                  $
                  {cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  )}
                </span>
              </div>
              <button className="w-full bg-[#0066FF] hover:bg-blue-700 text-white py-3 rounded-full font-bold uppercase transition-all">
                Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
