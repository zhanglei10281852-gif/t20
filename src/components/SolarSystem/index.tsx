import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { OrbitLine } from "./OrbitLine";
import { StarField } from "./StarField";
import { PLANETS } from "@/data/planets";
import { useSolarStore } from "@/store/useSolarStore";
import { getPlanetAngle, getPlanetPosition } from "@/utils/astronomy";
import { FOCUS_DISTANCE_MULTIPLIER, CAMERA_POSITIONS } from "@/data/constants";

function SolarSystemScene() {
  const {
    simulationTime,
    isPlaying,
    timeSpeed,
    scaleMode,
    focusedPlanet,
    hoveredPlanet,
    viewMode,
    isCameraAnimating,
    setHoveredPlanet,
    focusPlanet,
    incrementTime,
    setCameraAnimating,
    activeDemo,
  } = useSolarStore();

  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (isPlaying && !isCameraAnimating) {
      incrementTime(delta * timeSpeed);
    }
    TWEEN.update();
  });

  useEffect(() => {
    if (!camera || !controlsRef.current) return;

    const controls = controlsRef.current;

    let targetPosition: THREE.Vector3;
    let targetLookAt: THREE.Vector3;

    if (focusedPlanet) {
      const planet = PLANETS.find((p) => p.id === focusedPlanet);
      if (!planet) return;

      const orbitRadius =
        scaleMode === "schematic" ? planet.orbitRadius : planet.realOrbitRadius;
      const size =
        scaleMode === "schematic" ? planet.visualSize : planet.realSize;
      const angle = getPlanetAngle(
        planet.orbitalPeriod,
        planet.initialAngle,
        simulationTime,
      );
      const pos = getPlanetPosition(orbitRadius, angle);

      const distance = size * FOCUS_DISTANCE_MULTIPLIER;
      const cameraHeight = distance * 0.6;
      const cameraDistance = distance * 1.2;

      targetPosition = new THREE.Vector3(
        pos.x + cameraDistance,
        cameraHeight,
        pos.z + cameraDistance,
      );
      targetLookAt = new THREE.Vector3(pos.x, 0, pos.z);
    } else if (viewMode === "orbit") {
      const camPos =
        scaleMode === "schematic"
          ? CAMERA_POSITIONS.overview
          : CAMERA_POSITIONS.overviewReal;
      targetPosition = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
      targetLookAt = new THREE.Vector3(0, 0, 0);
    } else {
      targetPosition = new THREE.Vector3(0, 50, 50);
      targetLookAt = new THREE.Vector3(0, 0, 0);
    }

    setCameraAnimating(true);

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();

    new TWEEN.Tween({ t: 0 })
      .to({ t: 1 }, 1500)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(({ t }) => {
        camera.position.lerpVectors(startPos, targetPosition, t);
        controls.target.lerpVectors(startTarget, targetLookAt, t);
        controls.update();
      })
      .onComplete(() => {
        setCameraAnimating(false);
      })
      .start();
  }, [focusedPlanet, scaleMode, viewMode, activeDemo]);

  useEffect(() => {
    if (
      viewMode === "planet" &&
      focusedPlanet &&
      !isCameraAnimating &&
      controlsRef.current
    ) {
      const planet = PLANETS.find((p) => p.id === focusedPlanet);
      if (!planet) return;

      const orbitRadius =
        scaleMode === "schematic" ? planet.orbitRadius : planet.realOrbitRadius;
      const angle = getPlanetAngle(
        planet.orbitalPeriod,
        planet.initialAngle,
        simulationTime,
      );
      const pos = getPlanetPosition(orbitRadius, angle);

      controlsRef.current.target.set(pos.x, 0, pos.z);
      controlsRef.current.update();
    }
  }, [simulationTime, viewMode, focusedPlanet, scaleMode, isCameraAnimating]);

  const handleSceneClick = () => {
    if (focusedPlanet) {
      focusPlanet(null);
    }
  };

  return (
    <group onClick={handleSceneClick}>
      <StarField />
      <Sun scaleMode={scaleMode} />

      {PLANETS.map((planet) => {
        const orbitRadius =
          scaleMode === "schematic"
            ? planet.orbitRadius
            : planet.realOrbitRadius;
        return (
          <OrbitLine
            key={`orbit-${planet.id}`}
            radius={orbitRadius}
            color={hoveredPlanet === planet.id ? "#ffcc00" : "#4a5568"}
            opacity={hoveredPlanet === planet.id ? 0.6 : 0.25}
          />
        );
      })}

      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          planet={planet}
          scaleMode={scaleMode}
          simulationTime={simulationTime}
          onClick={() => focusPlanet(planet.id)}
          onPointerOver={() => setHoveredPlanet(planet.id)}
          onPointerOut={() => setHoveredPlanet(null)}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={scaleMode === "schematic" ? 500 : 2000}
        makeDefault
      />

      <ambientLight intensity={0.15} />
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#ffcc00"
        distance={500}
      />

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </group>
  );
}

export function SolarSystem() {
  return (
    <Canvas
      camera={{ position: [0, 120, 80], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      style={{ background: "#050812" }}
    >
      <SolarSystemScene />
    </Canvas>
  );
}
