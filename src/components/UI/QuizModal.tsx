import { useState } from "react";
import {
  X,
  Trophy,
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useSolarStore } from "@/store/useSolarStore";
import { QUIZ_QUESTIONS } from "@/data/quizQuestions";

export function QuizModal() {
  const {
    showQuizModal,
    toggleQuizModal,
    quizScore,
    quizCurrentIndex,
    quizAnswered,
    quizCompleted,
    answerQuestion,
    resetQuiz,
    nextQuestion,
    correctPlanets,
  } = useSolarStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!showQuizModal) return null;

  const currentQuestion = QUIZ_QUESTIONS[quizCurrentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const isLastQuestion = quizCurrentIndex >= totalQuestions - 1;
  const hasAnswered = quizAnswered[quizCurrentIndex];

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || hasAnswered) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    answerQuestion(quizCurrentIndex, isCorrect, currentQuestion.relatedPlanet);
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      return;
    }
    nextQuestion();
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleFinish = () => {
    setShowResult(true);
  };

  const handleRestart = () => {
    resetQuiz();
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleClose = () => {
    toggleQuizModal();
    resetQuiz();
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const showFinalScore =
    quizAnswered.length === totalQuestions && quizAnswered.every((a) => a);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 shadow-2xl overflow-hidden"
        style={{ animation: "fadeIn 0.3s ease-out" }}
      >
        <div className="relative h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-white/90 absolute left-5" />
          <h2 className="text-xl font-bold text-white">天文小测验</h2>
          <button
            onClick={handleClose}
            className="absolute right-4 p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i < quizCurrentIndex ||
                  (i === quizCurrentIndex && hasAnswered)
                    ? "bg-white"
                    : i === quizCurrentIndex
                      ? "bg-white/60 scale-125"
                      : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {showFinalScore ||
          (quizAnswered.length === totalQuestions &&
            isLastQuestion &&
            showResult) ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">测验完成！</h3>
              <p className="text-slate-400 mb-4">
                你答对了{" "}
                <span className="text-yellow-400 font-bold text-xl">
                  {quizScore}
                </span>{" "}
                / {totalQuestions} 道题
              </p>

              {correctPlanets.length > 0 && (
                <div className="mb-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                  <p className="text-green-400 text-sm mb-2">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    答对的行星正在闪光庆祝！
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {correctPlanets.map((p) => (
                      <span
                        key={p}
                        className="px-3 py-1 rounded-full text-xs text-white bg-slate-700"
                      >
                        {p === "sun"
                          ? "太阳"
                          : QUIZ_QUESTIONS.find((q) => q.relatedPlanet === p)
                            ? QUIZ_QUESTIONS.find((q) => q.relatedPlanet === p)
                                ?.relatedPlanet
                            : p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                再来一次
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">
                  第 {quizCurrentIndex + 1} / {totalQuestions} 题
                </span>
                <span className="text-sm font-medium text-yellow-400">
                  得分：{quizScore}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-5">
                {currentQuestion.question}
              </h3>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass =
                    "bg-slate-800/50 border-slate-600/50 text-slate-200";

                  if (hasAnswered && showResult) {
                    if (index === currentQuestion.correctIndex) {
                      buttonClass =
                        "bg-green-500/20 border-green-500/50 text-green-400";
                    } else if (
                      index === selectedAnswer &&
                      index !== currentQuestion.correctIndex
                    ) {
                      buttonClass =
                        "bg-red-500/20 border-red-500/50 text-red-400";
                    } else {
                      buttonClass =
                        "bg-slate-800/30 border-slate-700/30 text-slate-500";
                    }
                  } else if (selectedAnswer === index) {
                    buttonClass =
                      "bg-indigo-500/20 border-indigo-500/50 text-indigo-300";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={hasAnswered}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${buttonClass} ${
                        !hasAnswered
                          ? "hover:border-indigo-400/50 hover:bg-slate-700/50"
                          : ""
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                          hasAnswered &&
                          showResult &&
                          index === currentQuestion.correctIndex
                            ? "bg-green-500/30 text-green-400"
                            : hasAnswered &&
                                showResult &&
                                index === selectedAnswer
                              ? "bg-red-500/30 text-red-400"
                              : selectedAnswer === index
                                ? "bg-indigo-500/30 text-indigo-300"
                                : "bg-slate-700/50 text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {hasAnswered &&
                        showResult &&
                        index === currentQuestion.correctIndex && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      {hasAnswered &&
                        showResult &&
                        index === selectedAnswer &&
                        index !== currentQuestion.correctIndex && (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && showResult && (
                <div className="mb-5 p-4 bg-slate-800/50 rounded-xl border border-slate-600/50">
                  <p className="text-sm text-slate-300">
                    <span className="text-yellow-400 font-medium">解析：</span>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {!hasAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    selectedAnswer !== null
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30"
                      : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  确认答案
                </button>
              ) : isLastQuestion ? (
                <button
                  onClick={handleFinish}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg shadow-yellow-500/30"
                >
                  查看成绩
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/30"
                >
                  下一题
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
