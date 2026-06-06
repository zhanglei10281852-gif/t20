import { create } from "zustand";
import type { SpeedPreset, ViewMode, ScaleMode, DemoType } from "@/types";
import { SPEED_PRESETS } from "@/data/constants";

interface SolarState {
  simulationTime: number;
  timeSpeed: number;
  isPlaying: boolean;
  speedPreset: SpeedPreset;

  focusedPlanet: string | null;
  viewMode: ViewMode;
  scaleMode: ScaleMode;

  showRightCard: boolean;
  showQuizModal: boolean;
  hoveredPlanet: string | null;

  quizScore: number;
  quizCurrentIndex: number;
  quizAnswered: boolean[];
  correctPlanets: string[];
  quizCompleted: boolean;

  activeDemo: DemoType;
  isCameraAnimating: boolean;

  setTimeSpeed: (speed: number) => void;
  togglePlay: () => void;
  setSpeedPreset: (preset: SpeedPreset) => void;
  setSimulationTime: (time: number) => void;
  incrementTime: (deltaDays: number) => void;

  focusPlanet: (name: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setScaleMode: (mode: ScaleMode) => void;
  setHoveredPlanet: (name: string | null) => void;

  toggleQuizModal: () => void;
  answerQuestion: (
    questionIndex: number,
    isCorrect: boolean,
    planetName: string,
  ) => void;
  resetQuiz: () => void;
  nextQuestion: () => void;

  triggerDemo: (demo: DemoType) => void;
  setCameraAnimating: (animating: boolean) => void;

  goToOverview: () => void;
}

export const useSolarStore = create<SolarState>((set) => ({
  simulationTime: 0,
  timeSpeed: SPEED_PRESETS.day.value,
  isPlaying: true,
  speedPreset: "day",

  focusedPlanet: null,
  viewMode: "orbit",
  scaleMode: "schematic",

  showRightCard: false,
  showQuizModal: false,
  hoveredPlanet: null,

  quizScore: 0,
  quizCurrentIndex: 0,
  quizAnswered: [],
  correctPlanets: [],
  quizCompleted: false,

  activeDemo: null,
  isCameraAnimating: false,

  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeedPreset: (preset) =>
    set({
      speedPreset: preset,
      timeSpeed: SPEED_PRESETS[preset].value,
    }),
  setSimulationTime: (time) => set({ simulationTime: time }),
  incrementTime: (deltaDays) =>
    set((state) => ({ simulationTime: state.simulationTime + deltaDays })),

  focusPlanet: (name) =>
    set({
      focusedPlanet: name,
      showRightCard: name !== null,
    }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setScaleMode: (mode) => set({ scaleMode: mode }),
  setHoveredPlanet: (name) => set({ hoveredPlanet: name }),

  toggleQuizModal: () =>
    set((state) => ({ showQuizModal: !state.showQuizModal })),
  answerQuestion: (questionIndex, isCorrect, planetName) =>
    set((state) => {
      const newAnswered = [...state.quizAnswered];
      newAnswered[questionIndex] = true;
      const newCorrect = isCorrect
        ? [...state.correctPlanets, planetName]
        : state.correctPlanets;
      return {
        quizScore: isCorrect ? state.quizScore + 1 : state.quizScore,
        quizAnswered: newAnswered,
        correctPlanets: newCorrect,
      };
    }),
  resetQuiz: () =>
    set({
      quizScore: 0,
      quizCurrentIndex: 0,
      quizAnswered: [],
      correctPlanets: [],
      quizCompleted: false,
    }),
  nextQuestion: () =>
    set((state) => ({
      quizCurrentIndex: state.quizCurrentIndex + 1,
    })),

  triggerDemo: (demo) => set({ activeDemo: demo }),
  setCameraAnimating: (animating) => set({ isCameraAnimating: animating }),

  goToOverview: () =>
    set({
      focusedPlanet: null,
      showRightCard: false,
      viewMode: "orbit",
      activeDemo: null,
    }),
}));
