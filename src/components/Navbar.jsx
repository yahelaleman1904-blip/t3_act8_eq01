import { useState } from 'react';
import { Bell, LogOut, Plus } from 'lucide-react';

export default function Navbar({ user, activeView, onLogout, onQuickAdd }) {
  const [notifOpen, setNotifOpen] = useState(false);

  const titles = {
    predicciones: 'Predicciones',
    partidos: 'Partidos de la Jornada',
    quiniela: 'Mi Quiniela Interactiva',
    estadisticas: 'Estadísticas y Rendimiento',
  };

  return (
    <header className="h-18 bg-[#0F172A] border-b border-[#1E293B] px-8 flex items-center justify-between relative">
      <div>
        <h1 className="text-lg font-bold text-white">{titles[activeView] || 'Predicciones'}</h1>
        <p className="text-xs text-[#94A3B8]">Temporada 2026/27</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onQuickAdd}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear pronóstico</span>
        </button>

        {/* Campana de Notificaciones Funcional */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-[#94A3B8] hover:text-white transition cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-[#10B981] absolute top-1.5 right-1.5" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#1E293B] border border-[#334155] p-4 shadow-2xl z-50">
              <p className="text-xs font-bold text-white mb-2">Notificaciones recientes</p>
              <div className="space-y-2 text-xs text-[#94A3B8]">
                <div className="p-2 rounded-lg bg-[#0F172A]">
                  ✅ <span className="text-white font-medium">Real Betis vs Getafe:</span> Tu pronóstico fue registrado.
                </div>
                <div className="p-2 rounded-lg bg-[#0F172A]">
                  🔥 <span className="text-white font-medium">Jornada 12:</span> Llevas 5 aciertos seguidos esta semana.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Datos dinámicos del usuario que inició sesión */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#1E293B]">
          <img
            src={user?.image || 'https://dummyjson.com/icon/emilys/128'}
            alt={user?.firstName}
            className="w-9 h-9 rounded-full object-cover border border-[#10B981] bg-[#1E293B]"
          />
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-[#10B981] mt-1">@{user?.username} • 1,240 pts</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}