import { START_DATE } from "@/data/constants";

export function getDateFromSimulationTime(days: number): Date {
  const date = new Date(START_DATE.getTime());
  date.setDate(date.getDate() + Math.floor(days));
  return date;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

export function getPlanetAngle(
  orbitalPeriod: number,
  initialAngle: number,
  simulationTime: number,
): number {
  const angularSpeed = (2 * Math.PI) / orbitalPeriod;
  return initialAngle + angularSpeed * simulationTime;
}

export function getPlanetPosition(
  orbitRadius: number,
  angle: number,
  eccentricity: number = 0,
  perihelionAngle: number = 0,
): { x: number; z: number } {
  if (eccentricity === 0) {
    return {
      x: Math.cos(angle) * orbitRadius,
      z: Math.sin(angle) * orbitRadius,
    };
  }

  const a = orbitRadius;
  const e = eccentricity;
  const b = a * Math.sqrt(1 - e * e);

  let x = a * (Math.cos(angle) - e);
  let z = b * Math.sin(angle);

  const cosP = Math.cos(perihelionAngle);
  const sinP = Math.sin(perihelionAngle);
  const rotatedX = x * cosP - z * sinP;
  const rotatedZ = x * sinP + z * cosP;

  return {
    x: rotatedX,
    z: rotatedZ,
  };
}

export function getOrbitEllipsePoints(
  orbitRadius: number,
  eccentricity: number,
  perihelionAngle: number = 0,
  segments: number = 128,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  const a = orbitRadius;
  const e = eccentricity;
  const b = a * Math.sqrt(1 - e * e);

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    let x = a * (Math.cos(angle) - e);
    let z = b * Math.sin(angle);

    const cosP = Math.cos(perihelionAngle);
    const sinP = Math.sin(perihelionAngle);
    const rotatedX = x * cosP - z * sinP;
    const rotatedZ = x * sinP + z * cosP;

    points.push([rotatedX, 0, rotatedZ]);
  }

  return points;
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + " × 10⁹";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + " × 10⁶";
  if (num >= 1e3) return num.toLocaleString("zh-CN");
  return num.toString();
}

export function trueAnomalyToEccentric(
  trueAnomaly: number,
  eccentricity: number,
): number {
  return (
    2 *
    Math.atan(
      Math.sqrt((1 - eccentricity) / (1 + eccentricity)) *
        Math.tan(trueAnomaly / 2),
    )
  );
}

export function formatKM(km: number): string {
  if (km >= 1e8) return (km / 1e8).toFixed(2) + " 亿公里";
  if (km >= 1e4) return (km / 1e4).toFixed(2) + " 万公里";
  return km.toLocaleString("zh-CN") + " 公里";
}
