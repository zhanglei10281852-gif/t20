import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUN_DATA } from "@/data/planets";
import { useSolarStore } from "@/store/useSolarStore";

interface SunProps {
  scaleMode: "schematic" | "real";
}

export function Sun({ scaleMode }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const { correctPlanets } = useSolarStore();

  const size =
    scaleMode === "schematic" ? SUN_DATA.visualSize : SUN_DATA.realSize;
  const isCelebrating = correctPlanets.includes("sun");

  const glowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.3, "rgba(255, 204, 0, 0.5)");
    gradient.addColorStop(0.6, "rgba(255, 153, 0, 0.2)");
    gradient.addColorStop(1, "rgba(255, 102, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
    if (glowRef.current && isCelebrating) {
      const scale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
      glowRef.current.scale.set(size * 3.5 * scale, size * 3.5 * scale, 1);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={isCelebrating ? "#ffee88" : SUN_DATA.color}
          emissive={SUN_DATA.emissiveColor || "#ff9900"}
          emissiveIntensity={isCelebrating ? 1.5 : 1.2}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <sprite
        ref={glowRef}
        scale={[size * 3.5, size * 3.5, 1]}
        position={[0, 0, 0]}
      >
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <pointLight color="#ffcc00" intensity={2} distance={200} decay={2} />
    </group>
  );
}
