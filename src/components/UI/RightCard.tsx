import {
  X,
  Thermometer,
  Weight,
  Ruler,
  Clock,
  Moon,
  Sparkles,
} from "lucide-react";
import { useSolarStore } from "@/store/useSolarStore";
import { PLANETS } from "@/data/planets";

export function RightCard() {
  const { focusedPlanet, showRightCard, focusPlanet } = useSolarStore();

  const planet = focusedPlanet
    ? PLANETS.find((p) => p.id === focusedPlanet)
    : null;

  if (!showRightCard || !planet) return null;

  return (
    <div className="absolute right-4 top-24 z-10 w-72 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div
        className="rounded-2xl border border-slate-600/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
        style={{
          animation: "slideInRight 0.3s ease-out",
        }}
      >
        <div
          className="relative h-40 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at center, ${planet.color}40 0%, transparent 70%), linear-gradient(to bottom, #0a0e27 0%, #1a1f3a 100%)`,
          }}
        >
          <div
            className="w-24 h-24 rounded-full shadow-2xl"
            style={{
              backgroundColor: planet.color,
              boxShadow: `0 0 60px ${planet.color}60, inset -10px -10px 30px rgba(0,0,0,0.5)`,
            }}
          />
          {planet.showRing && (
            <div
              className="absolute w-48 h-12 rounded-full border-2"
              style={{
                borderColor: planet.ringColor || "#d4b896",
                transform: "rotateX(75deg)",
                opacity: 0.6,
              }}
            />
          )}
          <button
            onClick={() => focusPlanet(null)}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {planet.name}
            </h2>
            <p className="text-slate-400 text-sm">{planet.nameEn}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Ruler className="w-3.5 h-3.5" />
                直径
              </div>
              <div className="text-white font-semibold text-sm">
                {planet.diameter.toLocaleString()} km
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Weight className="w-3.5 h-3.5" />
                质量
              </div>
              <div className="text-white font-semibold text-sm">
                {planet.mass} kg
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                距太阳
              </div>
              <div className="text-white font-semibold text-sm">
                {planet.distanceAU} AU
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Thermometer className="w-3.5 h-3.5" />
                表面温度
              </div>
              <div className="text-white font-semibold text-sm">
                {planet.temperature.average}°C
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                公转周期
              </div>
              <div className="text-white font-semibold text-sm">
                {planet.orbitalPeriod.toLocaleString()} 天
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Moon className="w-3.5 h-3.5" />
                卫星数量
              </div>
              <div className="text-white font-semibold text-sm">
                {planet.moons} 颗
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white mb-2">组成成分</h3>
            <div className="text-sm text-slate-300 bg-slate-800/30 rounded-lg px-3 py-2">
              {planet.composition}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2">简介</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {planet.description}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
