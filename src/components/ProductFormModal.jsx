import React, { useState } from "react";
import { X, Save } from "lucide-react";

const CATEGORIAS = ["Proteínas", "Creatina", "Pre-Entrenamiento", "Vitaminas", "Aminoácidos", "Quemadores", "Ganadores", "Otro"];

const ProductFormModal = ({ initial, onSave, onCancel, isSaving }) => {
  const [form, setForm] = useState(initial);
  
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const inputCls = "w-full bg-white/5 border border-white/10 hover:border-[#0066FF]/40 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm outline-none transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form, 
      precio: parseFloat(form.precio) || 0,
      stock: parseInt(form.stock) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#050505]/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#0A0A10] border border-blue-500/20 shadow-[0_0_40px_rgba(0,102,255,0.1)] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0A0A10]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">
            {initial.nombre ? "Editar Producto" : "Carga de Producto"}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Nombre del Producto *</label>
            <input value={form.nombre} onChange={set("nombre")} placeholder="Ej. Whey Protein Isolate" className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Categoría *</label>
              <select value={form.categoria} onChange={set("categoria")} className={inputCls + " cursor-pointer"} required>
                <option value="">Seleccionar…</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Precio (USD) *</label>
              <input type="number" min="0" step="0.01" value={form.precio} onChange={set("precio")} placeholder="0.00" className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Stock Inicial *</label>
              <input type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="0" className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>SKU *</label>
              <input value={form.sku} onChange={set("sku")} placeholder="WPI-2LB-VAN" className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Marca *</label>
              <input value={form.marca} onChange={set("marca")} placeholder="Optimum Nutrition" className={inputCls} required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Imagen URL *</label>
            <input value={form.imagen} onChange={set("imagen")} placeholder="https://..." className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea value={form.descripcion} onChange={set("descripcion")} rows={3} placeholder="Descripción del producto…" className={inputCls + " resize-none"} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0055DD] shadow-[0_0_15px_rgba(0,102,255,0.4)] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
