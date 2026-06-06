import { useMemo } from "react";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { useSolarStore } from "@/store/useSolarStore";
import { PLANETS } from "@/data/planets";
import {
  getPlanetAngle,
  getPlanetPosition,
  getOrbitEllipsePoints,
} from "@/utils/astronomy";

interface SeasonMarker {
  angle: number;
  label: string;
  color: string;
}

const SEASON_MARKERS: SeasonMarker[] = [
  { angle: 0, label: "春分", color: "#4ade80" },
  { angle: Math.PI / 2, label: "夏至", color: "#f97316" },
  { angle: Math.PI, label: "秋分", color: "#fbbf24" },
  { angle: -Math.PI / 2, label: "冬至", color: "#60a5fa" },
];

export function DemoEffects() {
  const {
    activeDemo,
    scaleMode,
    simulationTime,
    demoPlanetAngleOverride,
  } = useSolarStore();

  const earth = PLANETS.find((p) => p.id === "earth");
  const orbitRadius =
    scaleMode === "schematic" ? earth?.orbitRadius || 0 : earth?.realOrbitRadius || 0;
  const eccentricity =
    scaleMode === "schematic"
      ? earth?.orbitEccentricity || 0
      : earth?.realOrbitEccentricity || 0;
  const perihelionAngle = earth?.perihelionAngle || 0;

  const alignmentLinePoints = useMemo(() => {
    if (activeDemo !== "alignment") return null;

    const pts: [number, number, number][] = [];
    const sortedPlanets = [...PLANETS].sort(
      (a, b) =>
        (scaleMode === "schematic" ? a.orbitRadius : a.realOrbitRadius) -
        (scaleMode === "schematic" ? b.orbitRadius : b.realOrbitRadius),
    );

    const lastPlanet = sortedPlanets[sortedPlanets.length - 1];
    const lastOrbitRadius =
      scaleMode === "schematic"
        ? lastPlanet.orbitRadius
        : lastPlanet.realOrbitRadius;
    const lastEccentricity =
      scaleMode === "schematic"
        ? lastPlanet.orbitEccentricity
        : lastPlanet.realOrbitEccentricity;

    const refAngle = 0;
    const endPos = getPlanetPosition(
      lastOrbitRadius * 1.2,
      refAngle,
      lastEccentricity,
      lastPlanet.perihelionAngle,
    );

    pts.push([0, 0, 0]);
    pts.push([endPos.x, 0, endPos.z]);

    return pts;
  }, [activeDemo, scaleMode]);

  const seasonMarkers = useMemo(() => {
    if (activeDemo !== "seasons" || !earth) return [];

    return SEASON_MARKERS.map((marker) => {
      const pos = getPlanetPosition(
        orbitRadius,
        marker.angle,
        eccentricity,
        perihelionAngle,
      );
      return { ...marker, position: pos };
    });
  }, [activeDemo, earth, orbitRadius, eccentricity, perihelionAngle]);

  if (!activeDemo) return null;

  return (
    <group>
      {activeDemo === "alignment" && alignmentLinePoints && (
        <Line
          points={alignmentLinePoints}
          color="#ffcc00"
          transparent
          opacity={0.6}
          lineWidth={2}
        />
      )}

      {activeDemo === "seasons" &&
        seasonMarkers.map((marker, index) => (
          <group key={index} position={[marker.position.x, 0, marker.position.z]}>
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color={marker.color} />
            </mesh>
            <Html distanceFactor={8} position={[0, 1, 0]} center>
              <div
                style={{
                  background: "rgba(10, 14, 39, 0.9)",
                  color: marker.color,
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  border: `1px solid ${marker.color}60`,
                  boxShadow: `0 0 8px ${marker.color}30`,
                }}
              >
                {marker.label}
              </div>
            </Html>
          </group>
        ))}

      {activeDemo === "seasons" && (
        <Line
          points={getOrbitEllipsePoints(
            orbitRadius,
            eccentricity,
            perihelionAngle,
            128,
          )}
          color="#22d3ee"
          transparent
          opacity={0.5}
          lineWidth={2}
        />
      )}
    </group>
  );
}
