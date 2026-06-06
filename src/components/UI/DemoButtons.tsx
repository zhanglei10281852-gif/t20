import { Sparkles, Sun, AlignLeft, Leaf } from "lucide-react";
import { useSolarStore } from "@/store/useSolarStore";

export function DemoButtons() {
  const {
    triggerDemo,
    activeDemo,
    focusPlanet,
    setSimulationTime,
    setSpeedPreset,
  } = useSolarStore();

  const handleEclipse = () => {
    triggerDemo("eclipse");
    focusPlanet("earth");
    setSimulationTime(0);
    setSpeedPreset("day");
  };

  const handleAlignment = () => {
    triggerDemo("alignment");
    focusPlanet(null);
    setSimulationTime(5000);
    setSpeedPreset("year");
  };

  const handleSeasons = () => {
    triggerDemo("seasons");
    focusPlanet("earth");
    setSimulationTime(0);
    setSpeedPreset("month");
  };

  return (
    <div className="absolute left-4 bottom-28 z-10">
      <div className="flex flex-col gap-2 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-600/50 shadow-lg">
        <div className="px-3 pt-2 pb-1">
          <span className="text-xs font-medium text-slate-400">
            特殊天象演示
          </span>
        </div>

        <button
          onClick={handleEclipse}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
            activeDemo === "eclipse"
              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Sun className="w-4 h-4" />
          日食演示
        </button>

        <button
          onClick={handleAlignment}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
            activeDemo === "alignment"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          行星连珠
        </button>

        <button
          onClick={handleSeasons}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
            activeDemo === "seasons"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <Leaf className="w-4 h-4" />
          地球四季
        </button>
      </div>

      {activeDemo && (
        <div className="mt-3 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
          <Sparkles className="w-3 h-3 inline mr-1" />
          演示模式：
          {activeDemo === "eclipse" && "日食"}
          {activeDemo === "alignment" && "行星连珠"}
          {activeDemo === "seasons" && "地球四季"}
        </div>
      )}
    </div>
  );
}
