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
import { DemoEffects } from "./DemoEffects";
import { PLANETS } from "@/data/planets";
import { useSolarStore } from "@/store/useSolarStore";
import { getPlanetAngle, getPlanetPosition } from "@/utils/astronomy";
import { FOCUS_DISTANCE_MULTIPLIER, CAMERA_POSITIONS } from "@/data/constants";
import { MOON_DATA } from "@/data/planets";

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
    demoPlanetAngleOverride,
    demoMoonAngleOverride,
  } = useSolarStore();

  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (isPlaying && !isCameraAnimating) {
      incrementTime(delta * timeSpeed);
    }
    TWEEN.update();
  });

  const getPlanetCurrentPosition = (planetId: string) => {
    const planet = PLANETS.find((p) => p.id === planetId);
    if (!planet) return new THREE.Vector3(0, 0, 0);

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

    const pos = getPlanetPosition(
      orbitRadius,
      angle,
      eccentricity,
      planet.perihelionAngle,
    );
    return new THREE.Vector3(pos.x, 0, pos.z);
  };

  useEffect(() => {
    if (!camera || !controlsRef.current) return;

    const controls = controlsRef.current;

    let targetPosition: THREE.Vector3;
    let targetLookAt: THREE.Vector3;
    let animationDuration = 1500;

    if (activeDemo === "eclipse") {
      const earthPos = getPlanetCurrentPosition("earth");
      const earth = PLANETS.find((p) => p.id === "earth");
      if (!earth) return;

      const earthSize =
        scaleMode === "schematic" ? earth.visualSize : earth.realSize;

      const dirToSun = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), earthPos)
        .normalize();
      const upDir = new THREE.Vector3(0, 1, 0);
      const sideDir = new THREE.Vector3()
        .crossVectors(dirToSun, upDir)
        .normalize();

      targetPosition = new THREE.Vector3(
        earthPos.x + dirToSun.x * earthSize * 0.3 + sideDir.x * earthSize * 0.8,
        earthPos.y + earthSize * 0.3,
        earthPos.z + dirToSun.z * earthSize * 0.3 + sideDir.z * earthSize * 0.8,
      );
      targetLookAt = new THREE.Vector3(0, 0, 0);
      animationDuration = 2000;
    } else if (activeDemo === "alignment") {
      const camPos =
        scaleMode === "schematic"
          ? CAMERA_POSITIONS.overview
          : CAMERA_POSITIONS.overviewReal;
      targetPosition = new THREE.Vector3(
        camPos.x * 0.3,
        camPos.y * 0.6,
        camPos.z * 1.5,
      );
      targetLookAt = new THREE.Vector3(0, 0, 0);
    } else if (activeDemo === "seasons") {
      const earth = PLANETS.find((p) => p.id === "earth");
      if (!earth) return;
      const orbitRadius =
        scaleMode === "schematic" ? earth.orbitRadius : earth.realOrbitRadius;

      targetPosition = new THREE.Vector3(
        0,
        orbitRadius * 0.8,
        orbitRadius * 1.5,
      );
      targetLookAt = new THREE.Vector3(0, 0, 0);
      animationDuration = 1800;
    } else if (viewMode === "planet" && focusedPlanet) {
      const planet = PLANETS.find((p) => p.id === focusedPlanet);
      if (!planet) return;

      const size =
        scaleMode === "schematic" ? planet.visualSize : planet.realSize;
      const planetPos = getPlanetCurrentPosition(focusedPlanet);

      const sunDir = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), planetPos)
        .normalize();

      const upDir = new THREE.Vector3(0, 1, 0);
      const sideDir = new THREE.Vector3()
        .crossVectors(sunDir, upDir)
        .normalize();

      const tiltAngle = planet.axialTilt * (Math.PI / 180);
      const surfaceNormal = new THREE.Vector3(0, 1, 0);
      surfaceNormal.applyAxisAngle(new THREE.Vector3(1, 0, 0), tiltAngle);

      const camHeight = size * 0.05;
      const horizonOffset = size * 0.3;

      targetPosition = new THREE.Vector3(
        planetPos.x + sideDir.x * horizonOffset,
        planetPos.y + size + camHeight,
        planetPos.z + sideDir.z * horizonOffset,
      );

      const lookFar = 200;
      targetLookAt = new THREE.Vector3(
        planetPos.x + sunDir.x * lookFar + sideDir.x * 20,
        planetPos.y + size * 0.8,
        planetPos.z + sunDir.z * lookFar + sideDir.z * 20,
      );
      animationDuration = 2000;
    } else if (focusedPlanet) {
      const planet = PLANETS.find((p) => p.id === focusedPlanet);
      if (!planet) return;

      const size =
        scaleMode === "schematic" ? planet.visualSize : planet.realSize;
      const pos = getPlanetCurrentPosition(focusedPlanet);

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
      .to({ t: 1 }, animationDuration)
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
  }, [focusedPlanet, scaleMode, viewMode, activeDemo, simulationTime]);

  useEffect(() => {
    if (
      (viewMode === "planet" || activeDemo === "eclipse") &&
      focusedPlanet &&
      !isCameraAnimating &&
      controlsRef.current
    ) {
      const planet = PLANETS.find((p) => p.id === focusedPlanet);
      if (!planet) return;

      const planetPos = getPlanetCurrentPosition(focusedPlanet);
      const size =
        scaleMode === "schematic" ? planet.visualSize : planet.realSize;

      if (viewMode === "planet") {
        const sunDir = new THREE.Vector3()
          .subVectors(new THREE.Vector3(0, 0, 0), planetPos)
          .normalize();
        const upDir = new THREE.Vector3(0, 1, 0);
        const sideDir = new THREE.Vector3()
          .crossVectors(sunDir, upDir)
          .normalize();

        const camHeight = size * 0.05;
        const horizonOffset = size * 0.3;
        const lookFar = 200;

        const newCamPos = new THREE.Vector3(
          planetPos.x + sideDir.x * horizonOffset,
          planetPos.y + size + camHeight,
          planetPos.z + sideDir.z * horizonOffset,
        );
        const newLookAt = new THREE.Vector3(
          planetPos.x + sunDir.x * lookFar + sideDir.x * 20,
          planetPos.y + size * 0.8,
          planetPos.z + sunDir.z * lookFar + sideDir.z * 20,
        );

        camera.position.copy(newCamPos);
        controlsRef.current.target.copy(newLookAt);
      } else {
        controlsRef.current.target.set(0, 0, 0);
      }
      controlsRef.current.update();
    }
  }, [
    simulationTime,
    viewMode,
    focusedPlanet,
    scaleMode,
    isCameraAnimating,
    activeDemo,
  ]);

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
        const eccentricity =
          scaleMode === "schematic"
            ? planet.orbitEccentricity
            : planet.realOrbitEccentricity;
        return (
          <OrbitLine
            key={`orbit-${planet.id}`}
            radius={orbitRadius}
            eccentricity={eccentricity}
            perihelionAngle={planet.perihelionAngle}
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

      <DemoEffects />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={0.5}
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
