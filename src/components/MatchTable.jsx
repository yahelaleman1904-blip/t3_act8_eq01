import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MatchTable({
  matches,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  currentPage,
  setCurrentPage,
  limit,
  setLimit,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
}) {
  // 1. Filtrado local sobre los datos
  const filteredMatches = matches.filter((item) => {
    const matchesText =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ganadorPrevisto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesText && matchesCat;
  });

  // 2. Cálculos de paginación
  const totalRecords = filteredMatches.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * limit;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + limit);

  const badgeStyle = (estado) => {
    switch (estado) {
      case 'Acertada':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'En vivo':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Fallada':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="rounded-2xl bg-[#1E293B] border border-[#334155] overflow-hidden">
      {/* Cabecera de la tabla y controles de filtro */}
      <div className="p-6 border-b border-[#334155] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Pronósticos de partidos</h2>
          <p className="text-xs text-[#94A3B8]">{totalRecords} partidos encontrados</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador por texto */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar equipo o partido..."
              className="pl-9 pr-4 py-2 rounded-xl bg-[#0F172A] border border-[#334155] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Filtro por Categoría / Liga */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#0F172A] border border-[#334155] text-sm text-white focus:outline-none focus:border-[#10B981]"
          >
            <option value="Todas">Todas las ligas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Botón Agregar Registro (CRUD) */}
          <button
            onClick={onOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pronóstico</span>
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#334155] text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] bg-[#0F172A]/40">
              <th className="py-3.5 px-6">Partido</th>
              <th className="py-3.5 px-4">Liga / Categoría</th>
              <th className="py-3.5 px-4">Fecha</th>
              <th className="py-3.5 px-4">Ganador Previsto</th>
              <th className="py-3.5 px-4">Probabilidad</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-6 text-right">Acciones CRUD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/60 text-sm">
            {paginatedMatches.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                  No se encontraron registros que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              paginatedMatches.map((item) => (
                <tr key={item.id} className="hover:bg-[#0F172A]/40 transition">
                  <td className="py-4 px-6 font-semibold text-white">{item.title}</td>
                  <td className="py-4 px-4 text-[#94A3B8] capitalize">{item.category}</td>
                  <td className="py-4 px-4 text-[#94A3B8]">{item.fecha}</td>
                  <td className="py-4 px-4 font-medium text-slate-200">{item.ganadorPrevisto}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 h-2 rounded-full bg-[#0F172A] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.probabilidad >= 60 ? 'bg-[#10B981]' : 'bg-amber-400'
                          }`}
                          style={{ width: `${item.probabilidad}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white">{item.probabilidad}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle(
                        item.estado
                      )}`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onOpenEdit(item)}
                        title="Editar registro"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenDelete(item)}
                        title="Eliminar registro"
                        className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación (10, 20, 40, 50) + Indicador de Página */}
      <div className="p-5 border-t border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-3">
          <span>Filas por página:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-white font-semibold focus:outline-none focus:border-[#10B981]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
          <span>
            Mostrando {totalRecords === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + limit, totalRecords)} de {totalRecords}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1)
            .slice(Math.max(0, safePage - 3), Math.min(totalPages, safePage + 2))
            .map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                  pageNum === safePage
                    ? 'bg-[#10B981] text-slate-950'
                    : 'bg-[#0F172A] border border-[#334155] text-slate-300 hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="p-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}