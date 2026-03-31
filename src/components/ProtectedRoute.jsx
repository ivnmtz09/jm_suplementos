// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

/**
 * Wraps a route so only authenticated users with an accepted role can access it.
 *
 * @param {React.ReactNode} children - The protected content
 * @param {string[]}        roles    - Allowed roles, e.g. ['admin', 'staff']
 *                                    If empty/undefined, only checks authentication.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, role, loading } = useAuthStore();

  // Mientras carga el estado en Zustand o si firebase todavía no resolvió la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col gap-4 items-center justify-center">
        <div 
          className="w-12 h-12 border-4 border-[#0066FF]/30 border-t-[#0066FF] rounded-full animate-spin relative"
          style={{ boxShadow: "0 0 20px rgba(0,102,255,0.4)" }}
        >
          {/* inner glow */}
          <div className="absolute inset-0 rounded-full border border-t-white mix-blend-overlay" />
        </div>
        <p className="text-[#0066FF] text-xs font-bold uppercase tracking-widest animate-pulse" style={{ textShadow: "0 0 10px rgba(0,102,255,0.5)" }}>
          Authenticating...
        </p>
      </div>
    );
  }

  // Si no hay usuario autenticado, mandar al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se pasaron roles requeridos, verificar que el rol del usuario esté permitido
  if (roles && roles.length > 0) {
    if (!role || !roles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
