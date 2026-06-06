export const SPEED_PRESETS = {
  day: { label: "1天/秒", value: 1, daysPerSecond: 1 },
  month: { label: "1月/秒", value: 30, daysPerSecond: 30 },
  year: { label: "1年/秒", value: 365, daysPerSecond: 365 },
  decade: { label: "10年/秒", value: 3650, daysPerSecond: 3650 },
} as const;

export const START_DATE = new Date("2024-01-01");

export const STAR_COUNT = 3000;
export const STAR_FIELD_RADIUS = 1000;

export const CAMERA_POSITIONS = {
  overview: { x: 0, y: 120, z: 80 },
  overviewReal: { x: 0, y: 400, z: 300 },
};

export const FOCUS_DISTANCE_MULTIPLIER = 4;

export const AXIAL_TILT_BASE = 23.5;
