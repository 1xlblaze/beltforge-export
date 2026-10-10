"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function AnimatedBelt() {
  const group = useRef<Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.35;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <torusGeometry args={[1.35, 0.22, 32, 120]} />
        <meshStandardMaterial
          color="#c4a574"
          metalness={0.65}
          roughness={0.28}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.08, 16, 80]} />
        <meshStandardMaterial color="#1a1410" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.45, 0.55, 0.12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
      </mesh>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[-1.1, 0.5, 0.3]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <MeshDistortMaterial
            color="#8b5a2b"
            distort={0.25}
            speed={2}
            roughness={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function BeltScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0.5, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#0c0a09"]} />
        <ambientLight intensity={0.35} />
        <spotLight
          position={[5, 8, 5]}
          angle={0.35}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <pointLight position={[-4, -2, 3]} intensity={0.8} color="#d4af37" />
        <AnimatedBelt />
        <Sparkles count={80} scale={6} size={2} speed={0.3} opacity={0.35} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
