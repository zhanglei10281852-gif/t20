export interface PlanetTemperature {
  min: number;
  max: number;
  average: number;
}

export interface PlanetData {
  id: string;
  name: string;
  nameEn: string;

  diameter: number;
  mass: string;
  distanceAU: number;
  distanceKM: number;
  orbitalPeriod: number;
  rotationPeriod: number;
  temperature: PlanetTemperature;
  moons: number;
  composition: string;
  description: string;

  color: string;
  emissiveColor?: string;
  showRing?: boolean;
  ringColor?: string;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  hasMoon?: boolean;

  visualSize: number;
  orbitRadius: number;
  orbitEccentricity: number;
  perihelionAngle: number;
  orbitSpeed: number;
  rotationSpeed: number;

  realSize: number;
  realOrbitRadius: number;
  realOrbitEccentricity: number;

  initialAngle: number;
  axialTilt: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  relatedPlanet: string;
  explanation: string;
}

export type SpeedPreset = 'day' | 'month' | 'year' | 'decade';
export type ViewMode = 'orbit' | 'planet';
export type ScaleMode = 'schematic' | 'real';
export type DemoType = 'eclipse' | 'alignment' | 'seasons' | null;
