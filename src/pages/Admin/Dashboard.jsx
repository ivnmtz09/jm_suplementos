// src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  LogOut,
  PackageSearch,
  TrendingUp,
  Boxes,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { db } from "@/store/firebase";
import useAuthStore from "@/store/authStore";

/* ─── Helpers ──────────────────────────────────────────────── */
const EMPTY_FORM = {
  nombre: "",
  marca: "",
  precio: "",
  stock: "",
  sku: "",
  categoria: "",
  descripcion: "",
  imagen: "",
};

const CATEGORIAS = [
  "Proteínas",
  "Creatina",
  "Pre-Entrenamiento",
  "Vitaminas",
  "Aminoácidos",
  "Quemadores",
  "Ganadores",
  "Otro",
];

/* ─── Stat Card ────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent = "#0066FF" }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${accent}22`, border: `1px solid ${accent}44` }}
    >
      <Icon size={20} style={{ color: accent }} />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
    </div>
  </div>
);

/* ─── Product Form Modal ───────────────────────────────────── */
const ProductForm = ({ initial = EMPTY_FORM, onSave, onCancel, isSaving }) => {
  const [form, setForm] = useState(initial);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio) {
      toast.error("Nombre y precio son obligatorios");
      return;
    }
    onSave({
      ...form,
      precio: parseFloat(form.precio) || 0,
      stock: parseInt(form.stock) || 0,
    });
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 hover:border-[#0066FF]/40 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm outline-none transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0A0A0F] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0A0A0F] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-black uppercase tracking-widest text-sm text-white">
            {initial.nombre ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Nombre *</label>
              <input value={form.nombre} onChange={set("nombre")} placeholder="Whey Gold Standard" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Marca</label>
              <input value={form.marca} onChange={set("marca")} placeholder="Optimum" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input value={form.sku} onChange={set("sku")} placeholder="WGS-5LB-CHOC" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Precio (COP) *</label>
              <input type="number" min="0" value={form.precio} onChange={set("precio")} placeholder="150000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="20" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Categoría</label>
              <select value={form.categoria} onChange={set("categoria")} className={inputClass + " cursor-pointer"}>
                <option value="">Seleccionar…</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Imagen (URL)</label>
              <input value={form.imagen} onChange={set("imagen")} placeholder="https://..." className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea value={form.descripcion} onChange={set("descripcion")} rows={3} placeholder="Descripción del producto…" className={inputClass + " resize-none"} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-bold uppercase tracking-widest text-xs transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0055DD] disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#0066FF]/25">
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Quick Stock Control ──────────────────────────────────── */
const StockControl = ({ product }) => {
  const [val, setVal] = useState(product.stock ?? 0);
  const [saving, setSaving] = useState(false);

  const save = async (newVal) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "productos", product.id), { stock: newVal, updatedAt: serverTimestamp() });
      toast.success("Stock actualizado");
    } catch {
      toast.error("Error actualizando stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => { const n = Math.max(0, val - 1); setVal(n); save(n); }}
        disabled={saving || val <= 0}
        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all"
      >
        <ChevronDown size={14} />
      </button>
      <span className={`w-10 text-center text-sm font-bold ${val === 0 ? "text-red-400" : val < 5 ? "text-yellow-400" : "text-green-400"}`}>
        {val}
      </span>
      <button
        onClick={() => { const n = val + 1; setVal(n); save(n); }}
        disabled={saving}
        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all"
      >
        <ChevronUp size={14} />
      </button>
    </div>
  );
};

/* ─── Dashboard ────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  /* Real-time listener */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  /* Stats */
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) < 5).length;
  const totalValue = products.reduce((s, p) => s + (p.precio ?? 0) * (p.stock ?? 0), 0);

  /* Filtered list */
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(q) ||
      p.marca?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.categoria?.toLowerCase().includes(q)
    );
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const openNew = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (p) => { setEditTarget(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); };

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
      closeForm();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteDoc(doc(db, "productos", id));
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <header className="bg-[#050505]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black uppercase italic text-[#0066FF] tracking-tight leading-none">
            JM Suplementos
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Dashboard · {role}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-gray-500 border border-white/10 px-3 py-1 rounded-full">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-full"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Boxes} label="Productos" value={totalProducts} />
          <StatCard icon={PackageSearch} label="Stock Total" value={totalStock} />
          <StatCard icon={TrendingUp} label="Stock Bajo" value={lowStock} accent="#F59E0B" />
          <StatCard
            icon={DollarSign}
            label="Valor Inventario"
            value={`$${(totalValue / 1000).toFixed(0)}k`}
            accent="#10B981"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, marca, SKU…"
              className="w-full bg-white/5 border border-white/10 hover:border-[#0066FF]/40 focus:border-[#0066FF] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
            />
          </div>
          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0055DD] text-white font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#0066FF]/25 hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={16} />
            Nuevo Producto
          </button>
        </div>

        {/* Product List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <PackageSearch size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold uppercase tracking-widest text-sm">Sin resultados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white/[0.03] border border-white/10 hover:border-[#0066FF]/30 rounded-2xl px-4 py-4 flex items-center gap-4 transition-all group"
              >
                {/* Thumb */}
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <Boxes size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{p.nombre}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    {p.marca && <span className="text-xs text-gray-500">{p.marca}</span>}
                    {p.categoria && (
                      <span className="text-[10px] text-[#0066FF] border border-[#0066FF]/30 px-1.5 py-0.5 rounded-full">
                        {p.categoria}
                      </span>
                    )}
                    {p.sku && <span className="text-[10px] text-gray-600">#{p.sku}</span>}
                  </div>
                  <p className="text-sm font-black text-white mt-1">
                    ${(p.precio ?? 0).toLocaleString("es-CO")}
                  </p>
                </div>

                {/* Stock Control */}
                <div className="flex-shrink-0">
                  <StockControl product={p} />
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(p)}
                    title="Editar"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#0066FF]/20 border border-white/10 hover:border-[#0066FF]/40 flex items-center justify-center text-gray-400 hover:text-[#0066FF] transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.nombre)}
                    title="Eliminar"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          initial={editTarget ?? EMPTY_FORM}
          onSave={handleSave}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default Dashboard;
