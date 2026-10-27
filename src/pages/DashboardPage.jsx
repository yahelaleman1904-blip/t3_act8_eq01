import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MatchTable from '../components/MatchTable';
import MatchCardsGrid from '../components/MatchCardsGrid';
import CrudModal from '../components/CrudModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  fetchMatches,
  createMatchApi,
  updateMatchApi,
  deleteMatchApi,
} from '../services/api';

export default function DashboardPage({ user, onLogout }) {
  const [activeView, setActiveView] = useState('predicciones');
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Estado interactivo para la vista "Mi Quiniela"
  const [quinielaPicks, setQuinielaPicks] = useState({});

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page'), 10);
    return p > 0 ? p : 1;
  };

  const getInitialLimit = () => {
    const params = new URLSearchParams(window.location.search);
    const l = parseInt(params.get('limit'), 10);
    return [10, 20, 40, 50].includes(l) ? l : 10;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [limit, setLimit] = useState(getInitialLimit);

  // Modales CRUD
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sincronizar URL (?page=X&limit=Y)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage);
    params.set('limit', limit);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ page: currentPage, limit }, '', newUrl);
  }, [currentPage, limit]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
      setLimit(getInitialLimit());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const data = await fetchMatches();
        setMatches(data);
      } catch (err) {
        setErrorMsg(err.message || 'Error al conectar con la API.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const categories = Array.from(new Set(matches.map((m) => m.category)));

  const handleSaveCrud = async (formData) => {
    try {
      if (editingItem) {
        await updateMatchApi(editingItem.id, formData);
        setMatches((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...formData } : item
          )
        );
        showToast('Pronóstico actualizado correctamente (PUT 200 OK).');
      } else {
        const apiResponse = await createMatchApi(formData);
        const newRecord = {
          id: apiResponse.id || Date.now(),
          ...formData,
          fecha: '24 oct, 19:00 p.m.',
        };
        setMatches((prev) => [newRecord, ...prev]);
        showToast('Nuevo pronóstico agregado (POST 201 OK).');
      }
      setIsCrudModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMatchApi(itemToDelete.id);
      setMatches((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      showToast('Pronóstico eliminado correctamente (DELETE 200 OK).');
      setItemToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePickQuiniela = (matchId, selection) => {
    setQuinielaPicks((prev) => ({ ...prev, [matchId]: selection }));
  };

  const acertadasCount = matches.filter((m) => m.estado === 'Acertada').length;
  const tasaAcierto = matches.length
    ? Math.round((acertadasCount / matches.length) * 100)
    : 68;

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-[#F8FAFC]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          user={user}
          activeView={activeView}
          onLogout={onLogout}
          onQuickAdd={() => {
            setEditingItem(null);
            setIsCrudModalOpen(true);
          }}
        />

        <main className="p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Hola, {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-[#94A3B8]">
                Revisa tus pronósticos y las probabilidades de la jornada en tiempo real.
              </p>
            </div>
            {toastMsg && (
              <div className="px-4 py-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-semibold">
                {toastMsg}
              </div>
            )}
          </div>

          {/* Tarjetas KPI interactivas (cambian de vista al hacer clic) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div
              onClick={() => setActiveView('predicciones')}
              className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-[#10B981]/50 transition cursor-pointer"
            >
              <p className="text-xs text-[#94A3B8] mb-2">Predicciones activas</p>
              <p className="text-3xl font-extrabold text-white">{matches.length}</p>
              <p className="text-xs text-[#10B981] mt-1">Ver tabla completa →</p>
            </div>
            <div
              onClick={() => setActiveView('estadisticas')}
              className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-[#10B981]/50 transition cursor-pointer"
            >
              <p className="text-xs text-[#94A3B8] mb-2">Tasa de acierto</p>
              <p className="text-3xl font-extrabold text-white">{tasaAcierto}%</p>
              <p className="text-xs text-[#10B981] mt-1">+4.2% vs. mes anterior</p>
            </div>
            <div
              onClick={() => setActiveView('quiniela')}
              className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-[#10B981]/50 transition cursor-pointer"
            >
              <p className="text-xs text-[#94A3B8] mb-2">Selecciones en Quiniela</p>
              <p className="text-3xl font-extrabold text-white">
                {Object.keys(quinielaPicks).length} / 10
              </p>
              <p className="text-xs text-[#10B981] mt-1">Armar mi quiniela →</p>
            </div>
            <div
              onClick={() => setActiveView('partidos')}
              className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-[#10B981]/50 transition cursor-pointer"
            >
              <p className="text-xs text-[#94A3B8] mb-2">Racha actual</p>
              <p className="text-3xl font-extrabold text-white">5</p>
              <p className="text-xs text-[#10B981] mt-1">aciertos seguidos</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center rounded-2xl bg-[#1E293B] border border-[#334155]">
              <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#94A3B8]">Cargando pronósticos desde la API...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-8 text-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
              <p className="font-bold mb-1">Ocurrió un problema al cargar los datos</p>
              <p className="text-sm">{errorMsg}</p>
            </div>
          ) : activeView === 'partidos' ? (
            <MatchCardsGrid
              matches={matches}
              onSelectForEdit={(item) => {
                setEditingItem(item);
                setIsCrudModalOpen(true);
              }}
            />
          ) : activeView === 'quiniela' ? (
            /* VISTA 3: MI QUINIELA INTERACTIVA */
            <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Boleta Oficial - Jornada 12 ({user?.firstName})
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Selecciona Local (L), Empate (E) o Visita (V) para cada encuentro.
                  </p>
                </div>
                <button
                  onClick={() =>
                    showToast(
                      `¡Quiniela guardada con ${Object.keys(quinielaPicks).length} pronósticos registrados!`
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-sm cursor-pointer"
                >
                  Guardar mi Quiniela ({Object.keys(quinielaPicks).length}/10)
                </button>
              </div>

              <div className="space-y-3">
                {matches.slice(0, 10).map((item) => {
                  const currentPick = quinielaPicks[item.id];
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[11px] font-semibold uppercase text-[#10B981]">
                          {item.category}
                        </span>
                        <p className="text-sm font-bold text-white">{item.title}</p>
                        <p className="text-xs text-[#94A3B8]">
                          Favorito IA: {item.ganadorPrevisto} ({item.probabilidad}%)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {['Local', 'Empate', 'Visita'].map((option) => (
                          <button
                            key={option}
                            onClick={() => handlePickQuiniela(item.id, option)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              currentPick === option
                                ? 'bg-[#10B981] text-slate-950 border-[#10B981]'
                                : 'bg-[#1E293B] text-slate-300 border-[#334155] hover:border-[#10B981]'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeView === 'estadisticas' ? (
            /* VISTA 4: ESTADÍSTICAS Y RENDIMIENTO */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Precisión por Liga / Categoría
                </h3>
                <div className="space-y-4">
                  {categories.slice(0, 6).map((cat, idx) => {
                    const pct = 88 - idx * 7;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-white capitalize">{cat}</span>
                          <span className="text-[#10B981] font-bold">{pct}% efectividad</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#0F172A] overflow-hidden">
                          <div
                            className="h-full bg-[#10B981] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Ranking de Analistas - Temporada 2026/27
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      pos: 1,
                      name: `${user?.firstName} ${user?.lastName} (Tú)`,
                      pts: '1,240 pts',
                      acc: '87%',
                      highlight: true,
                    },
                    { pos: 2, name: 'Mario Eduardo Grajales', pts: '1,195 pts', acc: '84%' },
                    { pos: 3, name: 'Emily Smith', pts: '1,120 pts', acc: '81%' },
                    { pos: 4, name: 'Michael Williams', pts: '980 pts', acc: '76%' },
                  ].map((row) => (
                    <div
                      key={row.pos}
                      className={`p-3.5 rounded-xl flex items-center justify-between border ${
                        row.highlight
                          ? 'bg-[#10B981]/15 border-[#10B981]/40'
                          : 'bg-[#0F172A] border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1E293B] text-xs font-bold flex items-center justify-center text-[#10B981]">
                          #{row.pos}
                        </span>
                        <span className="text-sm font-semibold text-white">{row.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#10B981]">{row.pts}</p>
                        <p className="text-[11px] text-[#94A3B8]">Precisión: {row.acc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VISTA 2 (POR DEFECTO): TABLA DE PREDICCIONES + FILTROS + PAGINACIÓN + CRUD */
            <MatchTable
              matches={matches}
              categories={
                categories.length ? categories : ['LaLiga', 'Liga MX', 'Premier League']
              }
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              limit={limit}
              setLimit={setLimit}
              onOpenAdd={() => {
                setEditingItem(null);
                setIsCrudModalOpen(true);
              }}
              onOpenEdit={(item) => {
                setEditingItem(item);
                setIsCrudModalOpen(true);
              }}
              onOpenDelete={(item) => setItemToDelete(item)}
            />
          )}
        </main>
      </div>

      <CrudModal
        isOpen={isCrudModalOpen}
        onClose={() => {
          setIsCrudModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveCrud}
        editingItem={editingItem}
        categories={categories.length ? categories : ['LaLiga', 'Liga MX', 'Premier League']}
      />

      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        itemTitle={itemToDelete?.title}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}