// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection, onSnapshot, getDocs, updateDoc, doc, query, orderBy,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  Boxes, BarChart2, Users, Shield, LogOut, Plus,
  TrendingUp, RefreshCw, ChevronRight, Circle,
} from "lucide-react";
import { db } from "@/store/firebase";
import useAuthStore from "@/store/authStore";

/* ─── Sidebar ────────────────────────────────────────────────── */
const Sidebar = ({ active, onLogout }) => {
  const links = [
    { id: "inventory", label: "Inventory", icon: <Boxes size={18} />, to: "/staff/inventario" },
    { id: "metrics",   label: "Metrics",   icon: <BarChart2 size={18} />, to: "/admin/dashboard" },
    { id: "users",     label: "Users",     icon: <Users size={18} />, to: "/admin/dashboard" },
    { id: "roles",     label: "Roles",     icon: <Shield size={18} />, to: "/admin/dashboard" },
  ];

  return (
    <aside className="w-[200px] flex-shrink-0 bg-[#080810] border-r border-white/10 flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="text-[#0066FF] font-black text-sm uppercase italic">JM Suplementos</p>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Kinetic Lab · Elite</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ id, label, icon, to }) => (
          <Link key={id} to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              active === id ? "bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30" : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}>
            {icon} {label}
          </Link>
        ))}
      </nav>
      <div className="px-3 pb-3">
        <Link to="/staff/inventario"
          className="w-full flex items-center justify-center gap-2 bg-[#0066FF]/20 hover:bg-[#0066FF]/30 border border-[#0066FF]/30 text-[#0066FF] text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all">
          <Plus size={14} /> NEW PRODUCT
        </Link>
      </div>
      <button onClick={onLogout}
        className="flex items-center gap-2 px-6 py-4 border-t border-white/10 text-xs text-gray-600 hover:text-red-400 transition-colors uppercase tracking-wider">
        <LogOut size={14} /> Logout
      </button>
    </aside>
  );
};

/* ─── Bar Chart (pure CSS) ───────────────────────────────────── */
const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{
              height: `${(bar.value / max) * 100}%`,
              minHeight: "4px",
              backgroundColor: bar.active ? "#0AEFFF" : "#1a2a40",
              boxShadow: bar.active ? "0 0 12px rgba(10,239,255,0.5)" : "none",
            }}
          />
          <span className="text-[9px] text-gray-600 uppercase">{bar.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Role Badge ─────────────────────────────────────────────── */
const RoleBadge = ({ role }) => {
  const cfg = {
    admin:        { label: "SUPER ADMIN",    cls: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
    staff:        { label: "STAFF",          cls: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
    "sales manager": { label: "SALES MANAGER", cls: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" },
    inventory:    { label: "INVENTORY",      cls: "bg-green-500/20 border-green-500/40 text-green-300" },
  };
  const { label, cls } = cfg[role?.toLowerCase()] ?? { label: role?.toUpperCase() ?? "—", cls: "bg-white/10 border-white/20 text-gray-400" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>{label}</span>
  );
};

/* ─── Admin Dashboard ────────────────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [livePulse, setLivePulse] = useState(true);

  /* Real-time listeners */
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("nombre"));
    return onSnapshot(q, (snap) =>
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "usuarios"));
        setUsuarios(snap.docs.map((d) => {
          const data = d.data();
          return { uid: d.id, ...data, role: data.rol };
        }));
      } catch (e) {
        console.error("Error fetching users:", e);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const handleRoleChange = async (uid, newRole) => {
    setUpdatingRole(uid);
    try {
      await updateDoc(doc(db, "usuarios", uid), { rol: newRole });
      setUsuarios((prev) => prev.map((u) => u.uid === uid ? { ...u, role: newRole } : u));
      toast.success(`Rol actualizado a "${newRole}"`);
    } catch { toast.error("Error al actualizar rol"); }
    finally { setUpdatingRole(null); }
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
      value: (p.precio ?? 0) * (p.stock ?? 0),
      active: i === 5, // highlight last bar like design
    }));

  /* Top 3 by stock */
  const topProducts = [...products].sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0)).slice(0, 3);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar active="users" onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
            <span>Dashboard</span><span>Orders</span><span>Suppliers</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-black">{user?.email?.split("@")[0]?.toUpperCase() ?? "ADMIN"}</p>
              <p className="text-[10px] text-[#0066FF] uppercase tracking-widest">Super Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 flex items-center justify-center text-xs font-black text-[#0066FF]">A</div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Page title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black">Métricas Clave</h1>
              <p className="text-gray-500 text-sm mt-1">
                Bienvenido al núcleo de control estratégico. Visualiza el rendimiento y gestiona los privilegios del laboratorio.
              </p>
            </div>
            <button
              onClick={() => setLivePulse((v) => !v)}
              className="flex items-center gap-2 border border-[#0066FF]/40 bg-[#0066FF]/10 text-[#0066FF] text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all hover:bg-[#0066FF]/20"
            >
              <span className="w-1.5 h-1.5 bg-[#0AEFFF] rounded-full animate-pulse" />
              Live System Sync
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Chart + stats - spans 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Metric cards row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Productos", value: totalProducts, icon: <Boxes size={16} className="text-[#0066FF]" /> },
                  { label: "Unidades", value: totalStock.toLocaleString(), icon: <TrendingUp size={16} className="text-green-400" /> },
                  { label: "Valor Est.", value: `$${(totalValue / 1000).toFixed(0)}k`, icon: <BarChart2 size={16} className="text-cyan-400" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">{icon}<span className="text-[10px] uppercase tracking-widest">{label}</span></div>
                    <p className="text-2xl font-black">{value}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Valor de Inventario</p>
                    <p className="text-3xl font-black text-white">${totalValue.toLocaleString("es-CO")}</p>
                    <p className="text-xs text-green-400 font-bold mt-0.5">▲ en tiempo real</p>
                  </div>
                  <div className="flex gap-1">
                    {["W", "M", "Y"].map((p) => (
                      <button key={p} className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                        p === "M" ? "bg-[#0066FF] text-white" : "text-gray-500 hover:text-white"
                      }`}>{p}</button>
                    ))}
                  </div>
                </div>
                {chartData.length > 0 ? (
                  <BarChart data={chartData} />
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-600 text-sm">Sin datos</div>
                )}
              </div>
            </div>

            {/* Top products panel */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-white mb-5">Productos Más Vistos</h3>
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-600 w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{p.nombre}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">{p.categoria ?? "General"}</p>
                      <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(((p.stock ?? 0) / 50) * 100, 100)}%`, backgroundColor: i === 0 ? "#0AEFFF" : "#0066FF" }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-400">{p.stock ?? 0}u</span>
                  </div>
                ))}
                {topProducts.length === 0 && <p className="text-xs text-gray-600">Sin datos</p>}
              </div>
              <button className="flex items-center gap-1 text-[10px] text-[#0066FF] font-bold uppercase tracking-widest mt-6 hover:opacity-70 transition-opacity">
                Ver Listado Completo <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Users & Roles table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black">Gestión de Usuarios y Roles</h2>
              <div className="flex gap-2">
                <button onClick={() => getDocs(collection(db, "usuarios")).then((s) => setUsuarios(s.docs.map((d) => { const data = d.data(); return { uid: d.id, ...data, role: data.rol }; })))}
                  className="flex items-center gap-1.5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all">
                  <RefreshCw size={12} /> Filtrar
                </button>
                <Link to="/login"
                  className="flex items-center gap-1.5 bg-[#0066FF] hover:bg-[#0055DD] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-[#0066FF]/30">
                  <Users size={12} /> Invite User
                </Link>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[120px_1fr_140px_100px_100px] gap-4 px-6 py-3 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-600">
                <span>User ID</span><span>Name / Contact</span><span>Role</span><span>Status</span><span>Actions</span>
              </div>

              {/* Rows */}
              {usuarios.length === 0 ? (
                <div className="text-center py-12 text-gray-600 text-sm">
                  {usuarios.length === 0 && <p>Cargando usuarios…</p>}
                </div>
              ) : (
                usuarios.map((u, idx) => (
                  <div key={u.uid}
                    className={`grid grid-cols-[120px_1fr_140px_100px_100px] gap-4 px-6 py-4 items-center transition-all hover:bg-white/[0.02] ${
                      idx < usuarios.length - 1 ? "border-b border-white/[0.06]" : ""
                    }`}>
                    {/* UID short */}
                    <span className="text-[#0066FF] text-xs font-bold font-mono">
                      #{u.uid.slice(0, 7).toUpperCase()}
                    </span>

                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-xs font-black text-[#0066FF] flex-shrink-0">
                        {(u.displayName ?? u.email ?? "?")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{u.displayName ?? "Usuario"}</p>
                        <p className="text-[11px] text-gray-500 truncate">{u.email ?? u.uid}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <RoleBadge role={u.role} />

                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                      <Circle size={8} fill="#10B981" className="text-green-400" />
                      <span className="text-xs text-green-400 font-bold">Active</span>
                    </div>

                    {/* Role selector */}
                    <select
                      value={u.role ?? "staff"}
                      disabled={updatingRole === u.uid}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                      className="bg-white/5 border border-white/10 hover:border-[#0066FF]/40 focus:border-[#0066FF] rounded-lg px-2 py-1.5 text-xs text-white outline-none cursor-pointer transition-all disabled:opacity-40"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="sales manager">Sales Mgr</option>
                      <option value="inventory">Inventory</option>
                    </select>
                  </div>
                ))
              )}

              <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
                <p className="text-[11px] text-gray-600">
                  Mostrando 1–{usuarios.length} de {usuarios.length} usuarios
                </p>
                <div className="flex items-center gap-1">
                  {[1].map((n) => (
                    <button key={n} className="w-7 h-7 rounded-lg bg-[#0066FF] text-white text-xs font-black">{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
