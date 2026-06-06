import { SolarSystem } from "@/components/SolarSystem";
import { LeftPanel } from "@/components/UI/LeftPanel";
import { BottomControls } from "@/components/UI/BottomControls";
import { RightCard } from "@/components/UI/RightCard";
import { ViewModeButtons } from "@/components/UI/ViewModeButtons";
import { QuizButton } from "@/components/UI/QuizButton";
import { QuizModal } from "@/components/UI/QuizModal";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050812]">
      <SolarSystem />

      <LeftPanel />
      <RightCard />
      <BottomControls />
      <ViewModeButtons />
      <QuizButton />
      <QuizModal />

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-slate-600 pointer-events-none z-0 select-none">
        拖拽旋转 · 滚轮缩放 · 点击行星查看详情
      </div>
    </div>
  );
}
