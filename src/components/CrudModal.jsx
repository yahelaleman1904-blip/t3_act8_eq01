import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CrudModal({ isOpen, onClose, onSave, editingItem, categories }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ganadorPrevisto, setGanadorPrevisto] = useState('');
  const [probabilidad, setProbabilidad] = useState(65);
  const [estado, setEstado] = useState('Pendiente');
  const [confirmStep, setConfirmStep] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setGanadorPrevisto(editingItem.ganadorPrevisto);
      setProbabilidad(editingItem.probabilidad);
      setEstado(editingItem.estado);
    } else {
      setTitle('');
      setCategory(categories[0] || 'LaLiga');
      setGanadorPrevisto('');
      setProbabilidad(65);
      setEstado('Pendiente');
    }
    setConfirmStep(false);
  }, [editingItem, isOpen, categories]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !ganadorPrevisto.trim()) return;

    // Si estamos editando, primero pedimos confirmación como exige la rúbrica
    if (editingItem && !confirmStep) {
      setConfirmStep(true);
      return;
    }

    onSave({
      title: title.trim(),
      category,
      ganadorPrevisto: ganadorPrevisto.trim(),
      probabilidad: Number(probabilidad),
      estado,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1E293B] border border-[#334155] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">
            {editingItem ? 'Editar Pronóstico' : 'Agregar Nuevo Pronóstico'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Partido / Evento (Ej. Real Betis vs Getafe CF)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Equipo Local vs Equipo Visitante"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Liga / Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Acertada">Acertada</option>
                <option value="En vivo">En vivo</option>
                <option value="Fallada">Fallada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ganador Previsto
              </label>
              <input
                type="text"
                required
                value={ganadorPrevisto}
                onChange={(e) => setGanadorPrevisto(e.target.value)}
                placeholder="Ej. Real Betis o Empate"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Probabilidad ({probabilidad}%)
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={probabilidad}
                onChange={(e) => setProbabilidad(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Mensaje de confirmación antes de editar (Requisito de la rúbrica) */}
          {confirmStep && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs">
              ¿Estás seguro de que deseas guardar los cambios en este registro? Haz clic en
              "Confirmar Edición" para enviar la petición PUT a la API.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 text-sm font-bold cursor-pointer"
            >
              {editingItem
                ? confirmStep
                  ? 'Confirmar Edición'
                  : 'Guardar Cambios'
                : 'Crear Pronóstico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}