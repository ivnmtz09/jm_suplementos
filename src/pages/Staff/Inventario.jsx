// src/pages/Staff/Inventario.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  Boxes, LayoutDashboard, BarChart2, Users, Shield, LogOut,
  Plus, Pencil, Trash2, X, Save, Search, AlertTriangle,
  ArrowRight, Zap, Package, ChevronDown, ChevronUp,
} from "lucide-react";
import { db } from "@/store/firebase";
import useAuthStore from "@/store/authStore";

/* ─── Constants ─────────────────────────────────────────────── */
const CATEGORIAS = ["Proteínas", "Creatina", "Pre-Entrenamiento", "Vitaminas", "Aminoácidos", "Quemadores", "Ganadores", "Otro"];
const EMPTY_FORM = { nombre: "", marca: "", precio: "", stock: "", sku: "", categoria: "", descripcion: "", imagen: "" };

/* ─── Sidebar ────────────────────────────────────────────────── */
const Sidebar = ({ active, onLogout, role }) => {
  const links = [
    { id: "inventario", label: "Inventory", icon: <Boxes size={18} />, to: "/staff/inventario" },
    { id: "metrics",    label: "Metrics",   icon: <BarChart2 size={18} />, to: role === "admin" ? "/admin/dashboard" : "#" },
    { id: "users",      label: "Users",     icon: <Users size={18} />,     to: role === "admin" ? "/admin/dashboard" : "#" },
    { id: "roles",      label: "Roles",     icon: <Shield size={18} />,    to: role === "admin" ? "/admin/dashboard" : "#" },
  ];

  return (
    <aside className="w-[200px] flex-shrink-0 bg-[#080810] border-r border-white/10 flex flex-col min-h-screen">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/10">
        <p className="text-[#0066FF] font-black text-sm uppercase italic">JM Suplementos</p>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Kinetic Lab · Elite</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ id, label, icon, to }) => (
          <Link
            key={id}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              active === id
                ? "bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            {icon} {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-6 py-4 border-t border-white/10 text-xs text-gray-600 hover:text-red-400 transition-colors uppercase tracking-wider mt-auto"
      >
        <LogOut size={14} /> Logout
      </button>
    </aside>
  );
};

/* ─── Stock bar ──────────────────────────────────────────────── */
const StockBar = ({ stock, max = 50 }) => {
  const pct = Math.min((stock / max) * 100, 100);
  const color = stock === 0 ? "#EF4444" : stock < 5 ? "#F59E0B" : "#10B981";
  return (
    <div>
      <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
        <span>Stock Level</span>
        <span style={{ color }}>{Math.round(pct)}% ({stock} units)</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

/* ─── Inline stock control ───────────────────────────────────── */
const StockControl = ({ product }) => {
  const [val, setVal] = useState(product.stock ?? 0);
  const [saving, setSaving] = useState(false);

  const save = async (n) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "productos", product.id), { stock: n, updatedAt: serverTimestamp() });
      toast.success("Stock actualizado");
    } catch { toast.error("Error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex items-center gap-1">
      <button disabled={saving || val <= 0} onClick={() => { const n = Math.max(0, val - 1); setVal(n); save(n); }}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 transition-all">
        <ChevronDown size={13} />
      </button>
      <span className={`w-8 text-center text-sm font-black ${val === 0 ? "text-red-400" : val < 5 ? "text-yellow-400" : "text-green-400"}`}>{val}</span>
      <button disabled={saving} onClick={() => { const n = val + 1; setVal(n); save(n); }}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 transition-all">
        <ChevronUp size={13} />
      </button>
    </div>
  );
};

/* ─── Product Form Modal ─────────────────────────────────────── */
const ProductForm = ({ initial = EMPTY_FORM, onSave, onCancel, isSaving }) => {
  const [form, setForm] = useState(initial);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const inputCls = "w-full bg-white/5 border border-white/10 hover:border-[#0066FF]/40 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm outline-none transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#0A0A10] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#0A0A10] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-sm font-black uppercase tracking-widest">{initial.nombre ? "Editar Producto" : "Carga de Producto"}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, precio: parseFloat(form.precio) || 0, stock: parseInt(form.stock) || 0 }); }} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Nombre del Producto *</label>
            <input value={form.nombre} onChange={set("nombre")} placeholder="Ej. Whey Protein Isolate" className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Categoría</label>
              <select value={form.categoria} onChange={set("categoria")} className={inputCls + " cursor-pointer"}>
                <option value="">Seleccionar…</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Precio (USD) *</label>
              <input type="number" min="0" step="0.01" value={form.precio} onChange={set("precio")} placeholder="0.00" className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Stock Inicial</label>
              <input type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="0" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>SKU</label>
              <input value={form.sku} onChange={set("sku")} placeholder="WPI-2LB-VAN" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Marca</label>
              <input value={form.marca} onChange={set("marca")} placeholder="Optimum" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Imagen URL</label>
            <input value={form.imagen} onChange={set("imagen")} placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea value={form.descripcion} onChange={set("descripcion")} rows={3} placeholder="Descripción del producto…" className={inputCls + " resize-none"} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-bold uppercase tracking-widest text-xs transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0055DD] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
              Finalizar y Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main: Inventario ───────────────────────────────────────── */
const Inventario = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();

  const [products, setProducts]     = useState([]);
  const [search, setSearch]         = useState("");
  const [activeTab, setActiveTab]   = useState("Todos");
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [isSaving, setIsSaving]     = useState(false);

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("nombre"));
    return onSnapshot(q, (snap) =>
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  // Wire FAB
  useEffect(() => {
    const btn = document.getElementById("fab-new-product");
    if (btn) btn.onclick = () => { setEditTarget(null); setShowForm(true); };
  });

  const lowStock = products.filter((p) => (p.stock ?? 0) < 5);
  const tabs = ["Todos", "Proteínas", "Creatina", "Pre-Entrenamiento"];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeTab === "Todos" || (p.categoria ?? "") === activeTab;
      const q = search.toLowerCase();
      const matchQ = !q || p.nombre?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, activeTab, search]);

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (editTarget) {
        await updateDoc(doc(db, "productos", editTarget.id), { ...data, updatedAt: serverTimestamp() });
        toast.success("Producto actualizado ✅");
      } else {
        await addDoc(collection(db, "productos"), { ...data, createdAt: serverTimestamp() });
        toast.success("Producto creado ✅");
      }
      setShowForm(false); setEditTarget(null);
    } catch { toast.error("Error al guardar"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try { await deleteDoc(doc(db, "productos", id)); toast.success("Eliminado"); }
    catch { toast.error("Error al eliminar"); }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar active="inventario" onLogout={handleLogout} role={role} />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
            <span className="text-[#0066FF]">Inventory</span>
            <span>Metrics</span>
            <span>Users</span>
          </div>
          <div className="relative flex-1 sm:flex-none sm:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos…"
              className="w-full bg-white/5 border border-white/10 focus:border-[#0066FF]/50 rounded-full pl-8 pr-4 py-2 text-xs outline-none transition-all text-white placeholder-gray-600" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black">{user?.displayName ?? "JESÚS ADMIN"}</p>
              <p className="text-[10px] text-[#0066FF] uppercase tracking-widest">Staff Principal</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 flex items-center justify-center text-xs font-black">
              {role?.[0]?.toUpperCase() ?? "S"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 max-w-5xl w-full">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-black">Panel de Control <span className="text-[#0066FF]">Staff</span></h1>
            <p className="text-gray-500 text-sm mt-1">Gestión de alto rendimiento para el catálogo de JM Suplementos.</p>
          </div>

          {/* Stock Alerts */}
          {lowStock.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-yellow-400">
                <AlertTriangle size={16} />
                <span className="text-xs font-black uppercase tracking-widest">Alertas de Stock</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lowStock.slice(0, 4).map((p) => (
                  <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border ${
                    p.stock === 0 ? "bg-red-500/10 border-red-500/30" : "bg-yellow-500/10 border-yellow-500/30"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${p.stock === 0 ? "bg-red-500/20" : "bg-yellow-500/20"}`}>
                        {p.stock === 0 ? <X size={14} className="text-red-400" /> : <Zap size={14} className="text-yellow-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{p.nombre}</p>
                        <p className={`text-xs ${p.stock === 0 ? "text-red-400" : "text-yellow-400"}`}>
                          {p.stock === 0 ? "Sin stock" : `Solo quedan ${p.stock} unidades`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => { setEditTarget(p); setShowForm(true); }}
                      className="text-gray-500 hover:text-white transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventario Rápido */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-white">Inventario Rápido</h2>
              <div className="flex gap-1">
                {tabs.map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                      activeTab === t ? "bg-[#0066FF]/20 border-[#0066FF]/50 text-[#0066FF]" : "border-white/10 text-gray-500 hover:text-white"
                    }`}>
                    {t === "Pre-Entrenamiento" ? "Pre-Entrenos" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Product cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const pct = Math.min(((p.stock ?? 0) / 50) * 100, 100);
                const badge = p.stock > 30 ? { label: "TOP SELLER", color: "text-green-400 bg-green-400/10 border-green-400/30" }
                  : p.stock < 5 ? { label: "LOW STOCK", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" }
                  : { label: "MID RANGE", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" };

                return (
                  <div key={p.id} className="bg-white/[0.03] border border-white/10 hover:border-[#0066FF]/30 rounded-2xl overflow-hidden group transition-all">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                      {p.imagen ? (
                        <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package size={32} className="text-white/10" /></div>
                      )}
                      <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.color}`}>{badge.label}</span>
                      {p.categoria && <span className="absolute top-3 right-3 px-2 py-1 bg-[#0066FF]/80 text-white rounded-full text-[10px] font-bold uppercase">{p.categoria}</span>}
                    </div>
                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-black text-sm uppercase leading-tight">{p.nombre}</p>
                        <span className="text-[#0066FF] font-black text-sm flex-shrink-0">${(p.precio ?? 0).toLocaleString("es-CO")}</span>
                      </div>
                      <StockBar stock={p.stock ?? 0} />
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <StockControl product={p} />
                        <div className="flex gap-1">
                          <button onClick={() => { setEditTarget(p); setShowForm(true); }}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#0066FF]/20 border border-white/10 hover:border-[#0066FF]/40 flex items-center justify-center text-gray-500 hover:text-[#0066FF] transition-all">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.nombre)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-600">
                <Boxes size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-xs uppercase tracking-widest">Sin productos</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FAB Flotante */}
      <button
        onClick={() => { setEditTarget(null); setShowForm(true); }}
        className="fixed bottom-6 right-6 z-[60] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,102,255,0.5)] bg-[#0066FF] hover:bg-[#0055DD] text-white text-xs font-black uppercase tracking-widest px-5 py-4 rounded-full transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={18} /> NEW PRODUCT
      </button>

      {showForm && (
        <ProductForm
          initial={editTarget ?? EMPTY_FORM}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default Inventario;
