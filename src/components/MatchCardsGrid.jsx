import { Calendar } from 'lucide-react';

export default function MatchCardsGrid({ matches, onSelectForEdit }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Cartelera Oficial ESPN</h2>
        <p className="text-sm text-[#94A3B8]">
          Partidos en tiempo real obtenidos de la API de ESPN. Haz clic en Predecir para ajustar tu pronóstico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {matches.slice(0, 18).map((item) => {
          const parts = item.title.split(' vs ');
          const local = item.localName || parts[0] || item.title;
          const visitante = item.awayName || (parts[1] ? parts[1].split(' (')[0] : 'Visitante');

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5 flex flex-col justify-between hover:border-[#10B981]/50 transition"
            >
              <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-4">
                <span className="px-2.5 py-1 rounded-md bg-[#0F172A] font-semibold uppercase">
                  {item.category}
                </span>
                <span className="text-[#10B981] font-medium">{item.estado}</span>
              </div>

              <div className="flex items-center justify-between my-3">
                <div className="text-center w-2/5">
                  {item.localLogo ? (
                    <img
                      src={item.localLogo}
                      alt={local}
                      className="w-12 h-12 object-contain mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0F172A] border border-[#10B981]/40 flex items-center justify-center mx-auto mb-2 font-bold text-xs text-[#10B981]">
                      {local.slice(0, 3).toUpperCase()}
                    </div>
                  )}
                  <p className="text-sm font-bold text-white truncate">{local}</p>
                  <p className="text-[11px] text-[#94A3B8]">Local</p>
                </div>

                <span className="text-xs font-bold text-slate-500">VS</span>

                <div className="text-center w-2/5">
                  {item.awayLogo ? (
                    <img
                      src={item.awayLogo}
                      alt={visitante}
                      className="w-12 h-12 object-contain mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0F172A] border border-amber-400/40 flex items-center justify-center mx-auto mb-2 font-bold text-xs text-amber-400">
                      {visitante.slice(0, 3).toUpperCase()}
                    </div>
                  )}
                  <p className="text-sm font-bold text-white truncate">{visitante}</p>
                  <p className="text-[11px] text-[#94A3B8]">Visitante</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8] my-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.fecha} • Favorito: {item.ganadorPrevisto}</span>
              </div>

              <button
                onClick={() => onSelectForEdit(item)}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                Predecir ({item.probabilidad}%)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}