import { Trophy, Calendar, Target, ListChecks, BarChart3 } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView }) {
  const menuItems = [
    { id: 'partidos', label: 'Partidos', icon: Calendar },
    { id: 'predicciones', label: 'Predicciones', icon: Target },
    { id: 'quiniela', label: 'Mi Quiniela', icon: ListChecks },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col justify-between shrink-0 min-h-screen p-5">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Pronostika</span>
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          MENÚ
        </p>

        {/* Navegación */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tarjeta inferior de Jornada (Como en tu Figma) */}
      <div className="p-4 rounded-xl bg-[#1E293B]/70 border border-[#334155]">
        <p className="text-xs font-bold text-white mb-1">Jornada 12</p>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Cierra tu quiniela antes del viernes a las 19:00 h.
        </p>
      </div>
    </aside>
  );
}