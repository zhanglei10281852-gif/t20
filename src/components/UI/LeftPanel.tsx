import { Info, Globe, Calendar, Ruler, Sparkles } from "lucide-react";
import { useSolarStore } from "@/store/useSolarStore";
import { PLANETS, SUN_DATA } from "@/data/planets";
import { SPEED_PRESETS } from "@/data/constants";
import {
  getDateFromSimulationTime,
  formatDate,
  formatKM,
} from "@/utils/astronomy";

export function LeftPanel() {
  const { focusedPlanet, simulationTime, speedPreset, scaleMode, focusPlanet } =
    useSolarStore();

  const currentDate = getDateFromSimulationTime(simulationTime);
  const speedLabel = SPEED_PRESETS[speedPreset].label;

  const currentBody = focusedPlanet
    ? PLANETS.find((p) => p.id === focusedPlanet)
    : null;

  return (
    <div className="absolute left-4 top-4 z-10 w-64 space-y-3">
      <div className="rounded-xl border border-yellow-500/30 bg-slate-900/85 backdrop-blur-md p-4 shadow-lg shadow-black/30">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h2 className="text-base font-bold text-white">太阳系科普平台</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          探索太阳系八大行星的奥秘，了解它们的运行规律和独特特征。
        </p>
      </div>

      <div className="rounded-xl border border-blue-500/30 bg-slate-900/85 backdrop-blur-md p-4 shadow-lg shadow-black/30">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">模拟时间</h3>
        </div>
        <div className="text-xl font-bold text-yellow-400 mb-0.5">
          {formatDate(currentDate)}
        </div>
        <div className="text-xs text-slate-400">速度：{speedLabel}</div>
      </div>

      <div className="rounded-xl border border-purple-500/30 bg-slate-900/85 backdrop-blur-md p-4 shadow-lg shadow-black/30">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">
            {currentBody ? "当前天体" : "太阳系总览"}
          </h3>
        </div>

        {currentBody ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-full shadow-lg flex-shrink-0"
                style={{
                  backgroundColor: currentBody.color,
                  boxShadow: `0 0 15px ${currentBody.color}50`,
                }}
              />
              <div>
                <div className="text-base font-bold text-white">
                  {currentBody.name}
                </div>
                <div className="text-xs text-slate-400">
                  {currentBody.nameEn}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">直径</span>
                <span>{currentBody.diameter.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">距太阳</span>
                <span>{currentBody.distanceAU} AU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">卫星</span>
                <span>{currentBody.moons} 颗</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">中心天体</span>
              <span className="text-yellow-400 font-medium">
                {SUN_DATA.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">行星数量</span>
              <span>8 颗</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">显示模式</span>
              <span>{scaleMode === "schematic" ? "示意尺度" : "真实尺度"}</span>
            </div>
          </div>
        )}
      </div>

      {currentBody && (
        <div className="rounded-xl border border-green-500/30 bg-slate-900/85 backdrop-blur-md p-4 shadow-lg shadow-black/30">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-semibold text-white">距离标尺</h3>
          </div>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">天文单位</span>
                <span className="text-green-400 font-semibold">
                  {currentBody.distanceAU} AU
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                  style={{ width: `${(currentBody.distanceAU / 30) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-slate-500">
              约 {formatKM(currentBody.distanceKM)}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-indigo-500/30 bg-slate-900/85 backdrop-blur-md p-4 shadow-lg shadow-black/30">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">行星导航</h3>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {PLANETS.map((planet) => (
            <button
              key={planet.id}
              onClick={() => focusPlanet(planet.id)}
              className={`group flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
                focusedPlanet === planet.id
                  ? "bg-indigo-500/20 ring-1 ring-indigo-500/50"
                  : "hover:bg-slate-700/50"
              }`}
              title={planet.name}
            >
              <div
                className="w-6 h-6 rounded-full transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: planet.color,
                  boxShadow:
                    focusedPlanet === planet.id
                      ? `0 0 10px ${planet.color}80`
                      : "none",
                }}
              />
              <span className="text-[10px] text-slate-400 group-hover:text-white">
                {planet.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
