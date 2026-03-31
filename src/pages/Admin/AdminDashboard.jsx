// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection, onSnapshot, getDocs, updateDoc, doc, deleteDoc, query, orderBy,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  Boxes, BarChart2, Users, TrendingUp, RefreshCw, ChevronRight, Circle, Trash2
} from "lucide-react";
import { db } from "@/store/firebase";
import useAuthStore from "@/store/authStore";

/* ─── Bar Chart (pure CSS) ───────────────────────────────────── */
const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-lg transition-all duration-700 relative group"
            style={{
              height: `${(bar.value / max) * 100}%`,
              minHeight: "4px",
              backgroundColor: bar.active ? "#0066FF" : "rgba(255,255,255,0.05)",
              boxShadow: bar.active ? "0 0 15px rgba(0,102,255,0.4)" : "none",
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0A0A10] border border-blue-500/20 text-white text-[10px] py-1 px-2 rounded-md shadow-xl whitespace-nowrap transition-opacity font-bold z-10">
              ${bar.value.toLocaleString()}
            </div>
          </div>
          <span className="text-[9px] text-gray-500 font-bold uppercase truncate w-full text-center">{bar.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Role Badge ─────────────────────────────────────────────── */
const RoleBadge = ({ role }) => {
  const cfg = {
    admin: { label: "ADMIN", cls: "bg-purple-500/10 border-purple-500/30 text-purple-400" },
    staff: { label: "STAFF", cls: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
  };
  const { label, cls } = cfg[role?.toLowerCase()] ?? { label: role?.toUpperCase() ?? "UNKNOWN", cls: "bg-white/10 border-white/20 text-gray-400" };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${cls}`}>{label}</span>
  );
};

/* ─── Admin Dashboard ────────────────────────────────────────── */
const AdminDashboard = () => {
  const { user, role } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [livePulse, setLivePulse] = useState(true);

  // Forced redirect to prevent rendering admin UI for staff
  useEffect(() => {
    if (role === "staff") {
      navigate("/staff/inventario", { replace: true });
    }
  }, [role, navigate]);

  if (role !== "admin") return null;

  /* Real-time listeners */
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("nombre"));
    return onSnapshot(q, (snap) =>
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "usuarios"));
      setUsuarios(snap.docs.map((d) => {
        const data = d.data();
        return { uid: d.id, ...data, role: data.rol };
      }));
    } catch (e) {
      console.error("Error fetching users:", e);
      toast.error("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    setUpdatingRole(uid);
    try {
      await updateDoc(doc(db, "usuarios", uid), { rol: newRole });
      setUsuarios((prev) => prev.map((u) => u.uid === uid ? { ...u, role: newRole } : u));
      toast.success(`Rol de usuario actualizado a "${newRole}"`);
    } catch { toast.error("Error al actualizar rol"); }
    finally { setUpdatingRole(null); }
  };

  const handleDeleteUser = async (uid, email) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el acceso de ${email || uid}?`)) return;
    try {
      await deleteDoc(doc(db, "usuarios", uid));
      setUsuarios((prev) => prev.filter((u) => u.uid !== uid));
      toast.success("Usuario eliminado exitosamente");
    } catch {
      toast.error("Error al eliminar usuario");
    }
  };

  /* Stats */
  const totalProducts = products.length;
  const totalStock    = products.reduce((s, p) => s + (p.stock ?? 0), 0);
  const totalValue    = products.reduce((s, p) => s + (p.precio ?? 0) * (p.stock ?? 0), 0);

  /* Bar chart: top 6 products by value */
  const chartData = [...products]
    .sort((a, b) => (b.precio ?? 0) * (b.stock ?? 0) - (a.precio ?? 0) * (a.stock ?? 0))
    .slice(0, 6)
    .map((p, i) => ({
      label: p.nombre?.split(" ")[0] ?? "—",
      value: (Math.round((p.precio ?? 0) * (p.stock ?? 0))),
      active: i === 0, // highlight the best seller
    }));

  /* Top 4 by stock */
  const topProducts = [...products].sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0)).slice(0, 4);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Resumen de <span className="text-[#0066FF]">Negocio</span></h1>
          <p className="text-gray-400 text-sm mt-1">Métricas y control de acceso del personal.</p>
        </div>
        <button
          onClick={() => setLivePulse((v) => !v)}
          className={`flex items-center gap-2 border bg-[#050510] text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full transition-all ${livePulse ? 'border-[#0066FF]/40 shadow-[0_0_15px_rgba(0,102,255,0.2)] text-[#0066FF]' : 'border-white/10 text-gray-500'}`}
        >
          <span className={`w-2 h-2 rounded-full ${livePulse ? 'bg-[#0066FF] animate-pulse' : 'bg-gray-600'}`} />
          Live System Sync
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Metrics - Spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Productos Activos", value: totalProducts, icon: <Boxes size={20} className="text-[#0066FF]" /> },
              { label: "Unidades en Bodega", value: totalStock.toLocaleString(), icon: <TrendingUp size={20} className="text-[#0066FF]" /> },
              { label: "Valor Inventario", value: `$${totalValue.toLocaleString("es-CO")}`, icon: <BarChart2 size={20} className="text-[#0066FF]" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white/[0.02] border border-blue-500/10 hover:border-[#0066FF]/30 transition-colors rounded-2xl p-5 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-3 text-gray-400 mb-3">{icon}<span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span></div>
                <p className="text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart Panel */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-bold text-[#0066FF] uppercase tracking-widest mb-1">Valor por Producto (Top 6)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-white">${totalValue.toLocaleString("es-CO")}</p>
                  <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded-md">Total Neto</p>
                </div>
              </div>
            </div>
            {chartData.length > 0 ? (
              <BarChart data={chartData} />
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-600 text-[10px] uppercase font-bold tracking-widest border border-dashed border-white/10 rounded-xl">Sin datos suficientes</div>
            )}
          </div>
        </div>

        {/* Top Products Panel */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Top Stock</h3>
            <span className="text-[10px] text-[#0066FF] font-bold bg-[#0066FF]/10 px-2 py-1 rounded">Volumen</span>
          </div>
          <div className="flex-1 space-y-5">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 group">
                <div className="w-6 h-6 rounded bg-[#0A0A10] border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-white group-hover:text-[#0066FF] transition-colors">{p.nombre}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">{p.categoria ?? "General"}</p>
                  <div className="h-1.5 bg-[#0A0A10] rounded-full mt-2 overflow-hidden shadow-inner border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(((p.stock ?? 0) / 100) * 100, 100)}%`, backgroundColor: i === 0 ? "#0066FF" : "#3b82f6", opacity: 1 - (i * 0.15) }}
                    />
                  </div>
                </div>
                <span className="text-xs font-black text-white bg-white/5 px-2 py-1 rounded-md border border-white/10">{p.stock ?? 0}</span>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest text-center py-10 border border-dashed border-white/10 rounded-xl">No hay inventario</p>}
          </div>
          <Link to="/staff/inventario" className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[#0066FF] bg-[#0066FF]/5 hover:bg-[#0066FF]/10 font-bold uppercase tracking-widest py-3 rounded-xl transition-all border border-[#0066FF]/20 shadow-[0_0_10px_rgba(0,102,255,0.05)]">
            Ver Inventario Completo <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-white/[0.02] border border-blue-500/10 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex flex-col w-full">
        <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gradient-to-r from-white/[0.02] to-transparent">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2"><Users size={18} className="text-[#0066FF]"/> Gestión de Usuarios</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Control de acceso y permisos de sesión</p>
          </div>
          <button onClick={fetchUsers} className="flex items-center gap-2 border border-white/10 hover:border-[#0066FF]/50 bg-[#0A0A10] hover:bg-[#0066FF]/10 text-gray-400 hover:text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all flex-shrink-0">
            <RefreshCw size={14} /> Refrescar
          </button>
        </div>

        <div className="w-full overflow-x-auto whitespace-nowrap">
          <div className="min-w-[600px] md:min-w-[800px] flex flex-col">
            {/* Table header */}
            <div className="grid grid-cols-[80px_1fr_100px_150px_60px] md:grid-cols-[80px_1fr_120px_100px_140px_80px] gap-4 px-6 py-4 bg-[#0A0A10]/50 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
              <span>Status</span>
              <span>Usuario</span>
              <span className="hidden md:block">UID</span>
              <span>Rol</span>
              <span>Cambiar Rol</span>
              <span className="text-right">Acción</span>
            </div>

            {/* Rows */}
            {usuarios.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs font-bold uppercase tracking-widest">
                Cargando usuarios…
              </div>
            ) : (
              usuarios.map((u, idx) => (
                <div key={u.uid}
                  className={`grid grid-cols-[80px_1fr_100px_150px_60px] md:grid-cols-[80px_1fr_120px_100px_140px_80px] gap-4 px-6 py-4 items-center transition-all hover:bg-white/[0.04] ${
                    idx < usuarios.length - 1 ? "border-b border-white/[0.05]" : ""
                  }`}
                >
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <Circle size={8} className={u.activo !== false ? "text-[#0066FF] fill-[#0066FF]" : "text-red-500 fill-red-500"} />
                    <span className="text-[10px] font-black text-white tracking-wider hidden md:inline">{u.activo !== false ? 'Activo' : 'Inactivo'}</span>
                  </div>

                  {/* Name/Email */}
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="w-9 h-9 md:w-8 md:h-8 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-xs md:text-[10px] font-black text-white flex-shrink-0 border border-[#0066FF]/30">
                      {(u.nombre ?? u.email ?? u.uid)[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-xs font-bold text-white truncate w-full">{u.nombre || "Usuario del Sistema"}</p>
                      <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-semibold truncate mt-0.5 w-full">{u.email || "Sin Email"}</p>
                    </div>
                  </div>

                  {/* UID (Hidden on Mobile) */}
                  <span className="hidden md:block text-[10px] text-gray-500 font-mono font-bold max-w-[120px] truncate">
                    {u.uid}
                  </span>

                  {/* Current Role Badge */}
                  <div>
                    <RoleBadge role={u.role} />
                  </div>

                  {/* Role Switcher (Big touch target for mobile) */}
                  <select
                    value={u.role ?? "staff"}
                    disabled={updatingRole === u.uid || u.uid === user.uid}
                    onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                    className="bg-[#0A0A10] border border-blue-500/20 hover:border-[#0066FF]/50 outline-none text-[10px] md:text-sm text-white font-bold uppercase tracking-widest rounded-lg px-3 py-3 md:px-2 md:py-2 cursor-pointer transition-all focus:border-[#0066FF] focus:shadow-[0_0_10px_rgba(0,102,255,0.2)] disabled:opacity-30 disabled:cursor-not-allowed w-full min-w-[120px]"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>

                  {/* Actions */}
                  <div className="flex justify-end h-full items-center">
                    <button 
                      onClick={() => handleDeleteUser(u.uid, u.email)}
                      disabled={u.uid === user.uid}
                      className="text-gray-500 hover:text-red-400 p-3 md:p-2 rounded-md hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 flex items-center justify-center"
                      title={u.uid === user.uid ? "No puedes eliminar tu propio usuario" : "Eliminar acceso"}
                    >
                      <Trash2 size={18} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-[#0A0A10] px-6 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
            Total Usuarios: <span className="text-white">{usuarios.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
