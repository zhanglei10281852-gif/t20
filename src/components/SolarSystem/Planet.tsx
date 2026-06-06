import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetData } from "@/types";
import { useSolarStore } from "@/store/useSolarStore";
import { getPlanetAngle, getPlanetPosition } from "@/utils/astronomy";
import { getPlanetTexture } from "@/utils/planetTextures";
import { MOON_DATA } from "@/data/planets";

interface PlanetProps {
  planet: PlanetData;
  scaleMode: "schematic" | "real";
  simulationTime: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export function Planet({
  planet,
  scaleMode,
  simulationTime,
  onClick,
  onPointerOver,
  onPointerOut,
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const {
    hoveredPlanet,
    focusedPlanet,
    correctPlanets,
    demoPlanetAngleOverride,
  } = useSolarStore();

  const isHovered = hoveredPlanet === planet.id;
  const isFocused = focusedPlanet === planet.id;
  const isCelebrating = correctPlanets.includes(planet.id);

  const size = scaleMode === "schematic" ? planet.visualSize : planet.realSize;
  const orbitRadius =
    scaleMode === "schematic" ? planet.orbitRadius : planet.realOrbitRadius;
  const eccentricity =
    scaleMode === "schematic"
      ? planet.orbitEccentricity
      : planet.realOrbitEccentricity;

  let angle = getPlanetAngle(
    planet.orbitalPeriod,
    planet.initialAngle,
    simulationTime,
  );
  if (
    demoPlanetAngleOverride &&
    demoPlanetAngleOverride[planet.id] !== undefined
  ) {
    angle = demoPlanetAngleOverride[planet.id];
  }
  const position = getPlanetPosition(
    orbitRadius,
    angle,
    eccentricity,
    planet.perihelionAngle,
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * planet.rotationSpeed * 10;
    }
    if (isCelebrating && meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
    }
  });

  const scale = isHovered || isFocused ? size * 1.15 : size;
  const emissiveIntensity = isCelebrating
    ? 0.8
    : isHovered || isFocused
      ? 0.3
      : 0;

  const tiltAngle = planet.axialTilt * (Math.PI / 180);

  const texture = useMemo(() => {
    return getPlanetTexture(planet.id, 512);
  }, [planet.id]);

  return (
    <group ref={groupRef} position={[position.x, 0, position.z]}>
      <group rotation={[tiltAngle, 0, 0]}>
        <mesh
          ref={meshRef}
          scale={scale}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onPointerOver?.();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onPointerOut?.();
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            map={texture || undefined}
            color={texture ? "#ffffff" : planet.color}
            emissive={planet.color}
            emissiveIntensity={emissiveIntensity}
            emissiveMap={texture || undefined}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {planet.showRing &&
          planet.ringInnerRadius &&
          planet.ringOuterRadius && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[
                  planet.ringInnerRadius * scale,
                  planet.ringOuterRadius * scale,
                  64,
                ]}
              />
              <meshBasicMaterial
                color={planet.ringColor || "#d4b896"}
                side={THREE.DoubleSide}
                transparent
                opacity={0.7}
              />
            </mesh>
          )}

        {planet.hasMoon && (
          <Moon
            parentSize={size}
            simulationTime={simulationTime}
            scaleMode={scaleMode}
            planetId={planet.id}
          />
        )}
      </group>

      {(isHovered || isFocused) && (
        <Html distanceFactor={10} position={[0, size * 1.5, 0]} center>
          <div className="planet-label">
            <span
              style={{
                background: "rgba(10, 14, 39, 0.9)",
                color: "white",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                whiteSpace: "nowrap",
                border: "1px solid rgba(255, 204, 0, 0.5)",
                boxShadow: "0 0 10px rgba(255, 204, 0, 0.3)",
              }}
            >
              {planet.name}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

interface MoonProps {
  parentSize: number;
  simulationTime: number;
  scaleMode: "schematic" | "real";
  planetId: string;
}

function Moon({ parentSize, simulationTime, scaleMode, planetId }: MoonProps) {
  const moonRef = useRef<THREE.Mesh>(null);
  const { demoMoonAngleOverride, activeDemo } = useSolarStore();

  const moonTexture = useMemo(() => {
    return getPlanetTexture("moon", 256);
  }, []);

  const isEclipseDemo = activeDemo === "eclipse" && planetId === "earth";
  const eclipseScale = isEclipseDemo ? 1.5 : 1;

  const moonOrbitRadius =
    scaleMode === "schematic"
      ? MOON_DATA.orbitRadius * parentSize * 1.5
      : MOON_DATA.orbitRadius * parentSize * 0.5;
  const moonSize =
    scaleMode === "schematic"
      ? MOON_DATA.visualSize * 1.2 * eclipseScale
      : MOON_DATA.visualSize * 0.3 * eclipseScale;

  let moonAngle = (simulationTime / MOON_DATA.orbitalPeriod) * Math.PI * 2;
  if (demoMoonAngleOverride !== null && planetId === "earth") {
    moonAngle = demoMoonAngleOverride;
  }
  const moonX = Math.cos(moonAngle) * moonOrbitRadius;
  const moonZ = Math.sin(moonAngle) * moonOrbitRadius;

  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <mesh ref={moonRef} position={[moonX, 0, moonZ]}>
      <sphereGeometry args={[moonSize, 32, 32]} />
      <meshStandardMaterial
        map={moonTexture || undefined}
        color={moonTexture ? "#ffffff" : MOON_DATA.color}
        roughness={1}
      />
    </mesh>
  );
}
