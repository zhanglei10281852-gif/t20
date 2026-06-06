import {
  Eye,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sun,
  AlignLeft,
  Leaf,
  Sparkles,
  Play,
  Pause,
} from "lucide-react";
import { useSolarStore } from "@/store/useSolarStore";
import { PLANETS } from "@/data/planets";
import { trueAnomalyToEccentric } from "@/utils/astronomy";

export function ViewModeButtons() {
  const {
    viewMode,
    scaleMode,
    focusedPlanet,
    activeDemo,
    isPlaying,
    setViewMode,
    setScaleMode,
    goToOverview,
    triggerDemo,
    focusPlanet,
    setSimulationTime,
    setSpeedPreset,
    setDemoPlanetAngleOverride,
    setDemoMoonAngleOverride,
    togglePlay,
  } = useSolarStore();

  const handleEclipse = () => {
    if (activeDemo === "eclipse") {
      triggerDemo(null);
      setDemoMoonAngleOverride(null);
      setDemoPlanetAngleOverride(null);
      return;
    }
    triggerDemo("eclipse");
    focusPlanet("earth");
    setSimulationTime(0);
    setSpeedPreset("day");

    const earth = PLANETS.find((p) => p.id === "earth");
    if (earth) {
      const targetDir = 0;
      const trueAnomaly = targetDir - earth.perihelionAngle;
      const eccentricAnomaly = trueAnomalyToEccentric(
        trueAnomaly,
        earth.orbitEccentricity,
      );
      const angleOverride: Record<string, number> = { earth: eccentricAnomaly };
      setDemoPlanetAngleOverride(angleOverride);
    }

    setDemoMoonAngleOverride(Math.PI);

    if (isPlaying) togglePlay();
  };

  const handleAlignment = () => {
    if (activeDemo === "alignment") {
      triggerDemo(null);
      setDemoPlanetAngleOverride(null);
      setDemoMoonAngleOverride(null);
      return;
    }
    triggerDemo("alignment");
    focusPlanet(null);

    const targetDir = 0;
    const angleOverride: Record<string, number> = {};
    PLANETS.forEach((planet) => {
      const eccentricity = planet.orbitEccentricity;
      const trueAnomaly = targetDir - planet.perihelionAngle;
      const eccentricAnomaly = trueAnomalyToEccentric(
        trueAnomaly,
        eccentricity,
      );
      angleOverride[planet.id] = eccentricAnomaly;
    });
    setDemoPlanetAngleOverride(angleOverride);
    setDemoMoonAngleOverride(0);
    if (isPlaying) togglePlay();
  };

  const handleSeasons = () => {
    if (activeDemo === "seasons") {
      triggerDemo(null);
      return;
    }
    triggerDemo("seasons");
    focusPlanet("earth");
    setSimulationTime(0);
    setSpeedPreset("month");
    if (!isPlaying) togglePlay();
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-3 w-44">
      {focusedPlanet && (
        <button
          onClick={goToOverview}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-yellow-500/40 text-yellow-400 text-sm font-medium hover:bg-slate-800/90 hover:border-yellow-500/60 transition-all shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          返回全景
        </button>
      )}

      <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-600/50 shadow-lg">
        <div className="px-2 pt-1 pb-1">
          <span className="text-xs font-medium text-slate-500">视图模式</span>
        </div>
        <button
          onClick={() => setViewMode("orbit")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            viewMode === "orbit"
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Eye className="w-4 h-4" />
          轨道视图
        </button>
        <button
          onClick={() => focusedPlanet && setViewMode("planet")}
          disabled={!focusedPlanet}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            viewMode === "planet"
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              : focusedPlanet
                ? "text-slate-400 hover:text-white hover:bg-slate-700/50"
                : "text-slate-600 cursor-not-allowed"
          }`}
        >
          <Eye className="w-4 h-4" />
          行星视角
        </button>
      </div>

      <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-600/50 shadow-lg">
        <div className="px-2 pt-1 pb-1">
          <span className="text-xs font-medium text-slate-500">尺度模式</span>
        </div>
        <button
          onClick={() => setScaleMode("schematic")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            scaleMode === "schematic"
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Maximize2 className="w-4 h-4" />
          示意尺度
        </button>
        <button
          onClick={() => setScaleMode("real")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            scaleMode === "real"
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Minimize2 className="w-4 h-4" />
          真实尺度
        </button>
      </div>

      <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-600/50 shadow-lg">
        <div className="px-2 pt-1 pb-1">
          <span className="text-xs font-medium text-slate-500">特殊天象</span>
        </div>
        <button
          onClick={handleEclipse}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            activeDemo === "eclipse"
              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Sun className="w-4 h-4" />
          日食演示
        </button>
        <button
          onClick={handleAlignment}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            activeDemo === "alignment"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          行星连珠
        </button>
        <button
          onClick={handleSeasons}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            activeDemo === "seasons"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Leaf className="w-4 h-4" />
          地球四季
        </button>
      </div>

      {activeDemo && (
        <div className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs text-center">
          <Sparkles className="w-3 h-3 inline mr-1" />
          {activeDemo === "eclipse" && "日食演示中"}
          {activeDemo === "alignment" && "行星连珠演示中"}
          {activeDemo === "seasons" && "四季演示中"}
        </div>
      )}
    </div>
  );
}
