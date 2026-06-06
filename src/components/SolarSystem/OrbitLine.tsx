import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface OrbitLineProps {
  radius: number;
  color?: string;
  opacity?: number;
}

export function OrbitLine({
  radius,
  color = "#4a5568",
  opacity = 0.3,
}: OrbitLineProps) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius]);

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
