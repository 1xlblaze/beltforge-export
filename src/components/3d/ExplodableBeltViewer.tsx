"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { BeltLayer, Product } from "@/types/product";
import { cn } from "@/lib/utils";

const DEFAULT_LAYERS: BeltLayer[] = [
  {
    id: "buckle",
    name: "Buckle",
    material: "Heritage metal",
    description: "Statement hardware plate.",
  },
  {
    id: "outer",
    name: "Outer strap",
    material: "Embroidered textile",
    description: "Design-forward visible layer.",
  },
  {
    id: "core",
    name: "Core",
    material: "Stabilized ply",
    description: "Structure for export durability.",
  },
  {
    id: "lining",
    name: "Lining",
    material: "Suede-touch interior",
    description: "Comfort lining for retail.",
  },
  {
    id: "edge",
    name: "Edge coat",
    material: "Waxed edge paint",
    description: "Sealed perimeter stitching.",
  },
];

type PartConfig = {
  layerId: string;
  geometry: "box" | "torus" | "cylinder";
  args: number[];
  position: [number, number, number];
  explode: [number, number, number];
  color: string;
  rotation?: [number, number, number];
};

function buildParts(layers: BeltLayer[]): PartConfig[] {
  const palette = ["#c9a227", "#8b4513", "#2a1810", "#d4a574", "#1a1410"];
  return layers.map((layer, i) => {
    if (layer.id === "buckle") {
      return {
        layerId: layer.id,
        geometry: "box",
        args: [0.55, 0.7, 0.14],
        position: [1.45, 0, 0],
        explode: [0.4, 0.6, 0.2],
        color: palette[0],
      };
    }
    if (layer.id === "outer") {
      return {
        layerId: layer.id,
        geometry: "torus",
        args: [1.2, 0.2, 24, 80],
        position: [0, 0, 0.12],
        explode: [0, 0, 0.55],
        color: palette[1],
      };
    }
    if (layer.id === "core") {
      return {
        layerId: layer.id,
        geometry: "torus",
        args: [1.2, 0.1, 16, 64],
        position: [0, 0, 0],
        explode: [0, 0, 0],
        color: palette[2],
      };
    }
    if (layer.id === "lining") {
      return {
        layerId: layer.id,
        geometry: "torus",
        args: [1.2, 0.08, 16, 64],
        position: [0, 0, -0.1],
        explode: [0, 0, -0.5],
        color: palette[3],
      };
    }
    return {
      layerId: layer.id,
      geometry: "torus",
      args: [1.2, 0.04, 12, 64],
      position: [0, 0, 0.22],
      explode: [0, 0.35, 0.35],
      color: palette[i % palette.length],
      rotation: [Math.PI / 2, 0, 0],
    };
  });
}

function BeltPart({
  config,
  explode,
  focusId,
  selectedId,
  onSelect,
}: {
  config: PartConfig;
  explode: number;
  focusId: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!ref.current) return;
    const e = explode;
    const f = focusId === config.layerId ? 1.25 : 1;
    target.set(
      config.position[0] + config.explode[0] * e * f,
      config.position[1] + config.explode[1] * e * f,
      config.position[2] + config.explode[2] * e * f,
    );
    ref.current.position.lerp(target, 0.12);
    const scale = selectedId === config.layerId ? 1.08 : 1;
    ref.current.scale.setScalar(scale);
  });

  const geom = useMemo(() => {
    if (config.geometry === "box") {
      return new THREE.BoxGeometry(config.args[0], config.args[1], config.args[2]);
    }
    if (config.geometry === "cylinder") {
      return new THREE.CylinderGeometry(
        config.args[0],
        config.args[0],
        config.args[1],
        config.args[2],
      );
    }
    return new THREE.TorusGeometry(
      config.args[0],
      config.args[1],
      config.args[2],
      config.args[3],
    );
  }, [config]);

  return (
    <mesh
      ref={ref}
      geometry={geom}
      rotation={config.rotation ?? [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(config.layerId);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <meshStandardMaterial
        color={config.color}
        metalness={config.layerId === "buckle" ? 0.9 : 0.35}
        roughness={config.layerId === "buckle" ? 0.15 : 0.45}
        emissive={
          selectedId === config.layerId ? new THREE.Color("#d4af37") : new THREE.Color("#000000")
        }
        emissiveIntensity={selectedId === config.layerId ? 0.25 : 0}
      />
    </mesh>
  );
}

function BeltAssembly({
  layers,
  explode,
  selectedId,
  focusId,
  onSelect,
}: {
  layers: BeltLayer[];
  explode: number;
  selectedId: string | null;
  focusId: string | null;
  onSelect: (id: string) => void;
}) {
  const parts = useMemo(() => buildParts(layers), [layers]);
  return (
    <group rotation={[0.4, -0.6, 0.1]}>
      {parts.map((p) => (
        <BeltPart
          key={p.layerId}
          config={p}
          explode={explode}
          focusId={focusId}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

type ViewerProps = {
  product: Product;
  className?: string;
};

export function ExplodableBeltViewer({ product, className }: ViewerProps) {
  const layers = product.layers?.length ? product.layers : DEFAULT_LAYERS;
  const [exploded, setExploded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const explode = exploded ? 1 : 0;
  const active = layers.find((l) => l.id === selectedId) ?? layers[0];

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1fr_280px]", className)}>
      <div className="relative aspect-square min-h-[280px] overflow-hidden rounded-xl border border-stone-800 bg-stone-950">
        <Canvas camera={{ position: [0, 0.5, 4.5], fov: 40 }}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 6, 3]} intensity={1.4} />
          <BeltAssembly
            layers={layers}
            explode={explode}
            selectedId={selectedId}
            focusId={focusId}
            onSelect={(id) => {
              setSelectedId(id);
              setExploded(true);
              setFocusId(id);
            }}
          />
          <OrbitControls enablePan={false} minDistance={3} maxDistance={7} />
          <Environment preset="studio" />
          <Html position={[0, -1.8, 0]} center>
            <p className="pointer-events-none text-center text-[10px] text-stone-500">
              Drag to rotate · Click a layer to open
            </p>
          </Html>
        </Canvas>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-200 hover:bg-stone-800"
            onClick={() => {
              setExploded(false);
              setFocusId(null);
            }}
          >
            Close belt
          </button>
          <button
            type="button"
            className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-stone-950 hover:bg-amber-400"
            onClick={() => {
              setExploded(true);
              setFocusId(null);
            }}
          >
            Open all parts
          </button>
        </div>
        <p className="text-xs uppercase tracking-wider text-amber-400/90">Export belt anatomy</p>
        <p className="font-medium text-stone-100">{product.name}</p>
        <ul className="max-h-40 space-y-1 overflow-y-auto">
          {layers.map((layer) => (
            <li key={layer.id}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-lg border px-2 py-1.5 text-left text-xs transition",
                  selectedId === layer.id
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-100"
                    : "border-stone-800 text-stone-400 hover:border-stone-600",
                )}
                onClick={() => {
                  setSelectedId(layer.id);
                  setExploded(true);
                  setFocusId(layer.id);
                }}
              >
                {layer.name}
              </button>
            </li>
          ))}
        </ul>
        {active && (
          <div className="rounded-lg border border-stone-800 bg-stone-900/80 p-3">
            <p className="font-medium text-stone-100">{active.name}</p>
            <p className="mt-1 text-xs text-amber-200/90">{active.material}</p>
            <p className="mt-2 text-xs leading-relaxed text-stone-400">{active.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
