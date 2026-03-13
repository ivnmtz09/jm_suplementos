import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems] = useState([]); // Placeholder para items del carrito

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0066FF]/30">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartItems.length}
      />

      <main className="max-w-7xl mx-auto">
        <HeroSection />
        {/* Aquí puedes agregar más secciones como productos, etc. */}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />

      <Footer />
    </div>
  );
}

export default App;
