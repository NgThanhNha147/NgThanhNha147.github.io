import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Points,
  PointMaterial,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function DeveloperCore() {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(
    () => Float32Array.from({ length: 1200 }, () => (Math.random() - 0.5) * 8),
    [],
  );
  useFrame(({ pointer, clock }) => {
    if (!group.current) return;
    group.current.rotation.y += 0.002;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.18,
      0.03,
    );
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      pointer.x * 0.35,
      0.03,
    );
    group.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.08;
  });
  return (
    <group ref={group}>
      <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.45}>
        <mesh>
          <icosahedronGeometry args={[1.35, 5]} />
          <MeshDistortMaterial
            color="#041f35"
            emissive="#00bcd4"
            emissiveIntensity={0.65}
            roughness={0.18}
            metalness={0.82}
            distort={0.32}
            speed={1.6}
            wireframe
          />
        </mesh>
        <mesh scale={0.76}>
          <icosahedronGeometry args={[1.35, 2]} />
          <meshPhysicalMaterial
            color="#0af0d0"
            transparent
            opacity={0.1}
            transmission={0.7}
            roughness={0.1}
          />
        </mesh>
      </Float>
      <Points positions={particles} stride={3}>
        <PointMaterial
          transparent
          color="#5df8e5"
          size={0.018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.72}
        />
      </Points>
    </group>
  );
}
export default function ThreeHero() {
  return (
    <div className="three-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.35} />
        <pointLight color="#00d9ff" position={[2, 2, 3]} intensity={18} />
        <DeveloperCore />
      </Canvas>
    </div>
  );
}
