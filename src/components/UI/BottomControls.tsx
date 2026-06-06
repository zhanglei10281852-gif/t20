import { Play, Pause, SkipBack, FastForward } from "lucide-react";
import { useSolarStore } from "@/store/useSolarStore";
import { SPEED_PRESETS } from "@/data/constants";
import { getDateFromSimulationTime, formatDate } from "@/utils/astronomy";
import type { SpeedPreset } from "@/types";

export function BottomControls() {
  const {
    isPlaying,
    simulationTime,
    speedPreset,
    togglePlay,
    setSpeedPreset,
    setSimulationTime,
  } = useSolarStore();

  const currentDate = getDateFromSimulationTime(simulationTime);
  const presets: SpeedPreset[] = ["day", "month", "year", "decade"];

  const maxTime = 365 * 100;
  const progress = (simulationTime % maxTime) / maxTime;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSimulationTime(value * maxTime);
  };

  const handleReset = () => {
    setSimulationTime(0);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-3xl px-4">
      <div className="rounded-2xl border border-slate-600/50 bg-slate-900/90 backdrop-blur-xl p-4 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-400">
            模拟日期：
            <span className="text-yellow-400 font-semibold ml-1 text-base">
              {formatDate(currentDate)}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <SkipBack className="w-3 h-3" />
            重置
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={handleSliderChange}
            className="w-full h-2 appearance-none bg-slate-700 rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-yellow-400
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-yellow-400/50
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform"
            style={{
              background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${progress * 100}%, #334155 ${progress * 100}%, #334155 100%)`,
            }}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={togglePlay}
            className={`flex items-center justify-center w-14 h-14 rounded-full transition-all transform hover:scale-105 ${
              isPlaying
                ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                : "bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          <div className="flex items-center gap-1 bg-slate-800/50 rounded-xl p-1">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setSpeedPreset(preset)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  speedPreset === preset
                    ? "bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {SPEED_PRESETS[preset].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <FastForward className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
