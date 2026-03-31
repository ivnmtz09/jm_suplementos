// src/pages/Staff/Inventario.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy, increment
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  Boxes, Plus, Pencil, Trash2, X, Search, AlertTriangle,
  ArrowRight, Zap, Package, ChevronDown, ChevronUp,
} from "lucide-react";
import { db } from "@/store/firebase";
import ProductFormModal from "@/components/ProductFormModal";

const EMPTY_FORM = { nombre: "", marca: "", precio: "", stock: "", sku: "", categoria: "", descripcion: "", imagen: "" };

/* ─── Stock bar ──────────────────────────────────────────────── */
const StockBar = ({ stock, max = 50 }) => {
  const pct = Math.min((stock / max) * 100, 100);
  const color = stock === 0 ? "#EF4444" : stock < 5 ? "#F59E0B" : "#0066FF";
  return (
    <div>
      <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
        <span>Stock</span>
        <span style={{ color }}>{Math.round(pct)}% ({stock})</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

/* ─── Inline stock control ───────────────────────────────────── */
const StockControl = ({ product }) => {
  const [saving, setSaving] = useState(false);

  const adjustStok = async (amount) => {
    // Prevent going below zero
    if (amount < 0 && (product.stock || 0) <= 0) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "productos", product.id), { 
        stock: increment(amount), 
        updatedAt: serverTimestamp() 
      });
      toast.success(amount > 0 ? "+1 Stock añadido" : "-1 Stock retirado");
    } catch { 
      toast.error("Error al actualizar stock"); 
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button disabled={saving || (product.stock || 0) <= 0} onClick={() => adjustStok(-1)}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 transition-all">
        <ChevronDown size={13} />
      </button>
      <span className={`w-8 text-center text-sm font-black ${(product.stock || 0) === 0 ? "text-red-400" : (product.stock || 0) < 5 ? "text-yellow-400" : "text-white"}`}>
        {product.stock || 0}
      </span>
      <button disabled={saving} onClick={() => adjustStok(1)}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 transition-all">
        <ChevronUp size={13} />
      </button>
    </div>
  );
};

/* ─── Main: Inventario ───────────────────────────────────────── */
const Inventario = () => {
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

  const lowStock = products.filter((p) => (p.stock ?? 0) < 5);
  const tabs = ["Todos", "Proteínas", "Creatina", "Pre-Entrenamiento"];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeTab === "Todos" || (p.categoria ?? "") === activeTab;
      const q = search.toLowerCase();
      const matchQ = !q || p.nombre?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.marca?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, activeTab, search]);

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (editTarget) {
        await updateDoc(doc(db, "productos", editTarget.id), { ...data, updatedAt: serverTimestamp() });
        toast.success("Producto actualizado exitosamente");
      } else {
        await addDoc(collection(db, "productos"), { ...data, createdAt: serverTimestamp() });
        toast.success("Producto creado exitosamente");
      }
      setShowForm(false); setEditTarget(null);
    } catch { toast.error("Error al guardar producto"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${name}" permanentemente?`)) return;
    try { await deleteDoc(doc(db, "productos", id)); toast.success("Producto eliminado"); }
    catch { toast.error("Error al eliminar"); }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Gestión de <span className="text-[#0066FF]">Inventario</span></h1>
          <p className="text-gray-400 text-sm mt-1">Control de stock en tiempo real y catálogo.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, SKU o marca…"
            className="w-full bg-white/5 border border-white/10 focus:border-[#0066FF]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all text-white placeholder-gray-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]" 
          />
        </div>
      </div>

      {/* Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-white/5 border border-yellow-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 text-yellow-400">
            <AlertTriangle size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Alertas Críticas de Stock</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lowStock.slice(0, 4).map((p) => (
              <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                p.stock === 0 ? "bg-red-500/10 border-red-500/30" : "bg-yellow-500/10 border-yellow-500/30"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.stock === 0 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {p.stock === 0 ? <X size={16} /> : <Zap size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[120px]" title={p.nombre}>{p.nombre}</p>
                    <p className={`text-[10px] font-semibold tracking-wider uppercase ${p.stock === 0 ? "text-red-400" : "text-yellow-400"}`}>
                      {p.stock === 0 ? "Agotado" : `Quedan ${p.stock}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.02] p-2 rounded-xl border border-white/5">
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === t 
                  ? "bg-[#0066FF]/20 text-[#0066FF] shadow-[0_0_10px_rgba(0,102,255,0.2)]" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}>
              {t === "Pre-Entrenamiento" ? "Pre-Entrenos" : t}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0055DD] text-white shadow-[0_4px_14px_rgba(0,102,255,0.4)] text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all"
        >
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      {/* Product cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => {
          return (
            <div key={p.id} className="bg-white/[0.02] border border-blue-500/10 hover:border-[#0066FF]/40 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,102,255,0.1)] flex flex-col">
              {/* Image Section */}
              <div className="relative aspect-[4/3] bg-[#0A0A10] overflow-hidden flex-shrink-0 border-b border-white/5">
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package size={32} className="text-gray-600" /></div>
                )}
                {p.categoria && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-[#050510]/80 backdrop-blur-md border border-[#0066FF]/30 text-[#0066FF] rounded text-[9px] font-black uppercase tracking-wider">
                    {p.categoria}
                  </span>
                )}
                {/* SKU Badge */}
                {p.sku && (
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-gray-300 rounded text-[9px] font-mono tracking-widest">
                    {p.sku}
                  </span>
                )}
              </div>
              
              {/* Info Section */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{p.marca || "Sin Marca"}</p>
                  <p className="font-black text-sm text-white uppercase leading-snug line-clamp-2" title={p.nombre}>{p.nombre}</p>
                  <p className="text-[#0066FF] font-black text-lg mt-2">${(p.precio ?? 0).toLocaleString("es-CO")}</p>
                </div>
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>
                
                <div className="space-y-4">
                  <StockBar stock={p.stock ?? 0} />
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <StockControl product={p} />
                    <div className="flex gap-2">
                      <button onClick={() => { setEditTarget(p); setShowForm(true); }}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#0066FF]/20 border border-transparent hover:border-[#0066FF]/40 flex items-center justify-center text-gray-400 hover:text-[#0066FF] transition-all" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.nombre)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-transparent hover:border-red-500/40 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-white/5">
          <Boxes size={48} className="mx-auto mb-4 text-gray-600/50" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No se encontraron productos</p>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <ProductFormModal
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
