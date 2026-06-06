import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { getOrbitEllipsePoints } from "@/utils/astronomy";

interface OrbitLineProps {
  radius: number;
  eccentricity?: number;
  perihelionAngle?: number;
  color?: string;
  opacity?: number;
}

export function OrbitLine({
  radius,
  eccentricity = 0,
  perihelionAngle = 0,
  color = "#4a5568",
  opacity = 0.3,
}: OrbitLineProps) {
  const points = useMemo(() => {
    return getOrbitEllipsePoints(radius, eccentricity, perihelionAngle, 128);
  }, [radius, eccentricity, perihelionAngle]);

  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={opacity}
      lineWidth={1}
    />
  );
}
