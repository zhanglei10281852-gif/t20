import { HelpCircle, Sparkles } from "lucide-react";
import { useSolarStore } from "@/store/useSolarStore";

export function QuizButton() {
  const { toggleQuizModal, quizScore } = useSolarStore();

  return (
    <button
      onClick={toggleQuizModal}
      className="absolute bottom-28 right-4 z-10 group"
    >
      <div className="relative flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all transform hover:scale-105 hover:-translate-y-0.5">
        <Sparkles className="w-5 h-5 text-yellow-300" />
        <span>天文小测验</span>
        {quizScore > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 text-slate-900 text-xs font-bold flex items-center justify-center">
            {quizScore}
          </span>
        )}
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity -z-10" />
    </button>
  );
}
