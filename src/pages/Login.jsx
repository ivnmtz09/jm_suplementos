// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Dumbbell, Zap } from "lucide-react";
import useAuthStore from "@/store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const role = await login(email, password);
      toast.success("¡Bienvenido de vuelta! 💪");
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "staff") {
        navigate("/staff/inventario");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      const messages = {
        "auth/invalid-credential": "Email o contraseña incorrectos.",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
        "auth/user-not-found": "Usuario no encontrado.",
        "auth/wrong-password": "Contraseña incorrecta.",
      };
      toast.error(messages[err.code] ?? "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0066FF]/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,102,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#0066FF]/20 border border-[#0066FF]/40 rounded-xl flex items-center justify-center">
              <Dumbbell size={24} className="text-[#0066FF]" />
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tight">
            JM <span className="text-[#0066FF]">Suplementos</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest">
            Panel de Administración
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/60">
          {/* Card header */}
          <div className="flex items-center gap-2 mb-8">
            <Zap size={18} className="text-[#0066FF]" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-white">
              Acceder
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jmsuplementos.com"
                className="w-full bg-white/5 border border-white/10 hover:border-[#0066FF]/40 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 hover:border-[#0066FF]/40 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 text-sm outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#0066FF] hover:bg-[#0055DD] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-[#0066FF]/25 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ingresando…
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Ingresar
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Acceso exclusivo para staff autorizado
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors"
          >
            ← Volver a la tienda
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
