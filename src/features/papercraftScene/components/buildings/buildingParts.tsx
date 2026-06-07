import type { Vector3Tuple } from "three";

export interface PanelProps {
  size: Vector3Tuple;
  color: string;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  /** Optional emissive glow color (for lamps/windows that should self-light). */
  glow?: string;
  glowIntensity?: number;
}

/** A single flat-shaded paper panel / block. */
export const Panel = ({
  size,
  color,
  position,
  rotation,
  glow,
  glowIntensity = 1,
}: PanelProps) => (
  <mesh position={position} rotation={rotation}>
    <boxGeometry args={size} />
    <meshStandardMaterial
      color={color}
      flatShading
      emissive={glow ?? "#000000"}
      emissiveIntensity={glow ? glowIntensity : 0}
    />
  </mesh>
);

interface WindowGridProps {
  cols: number;
  rows: number;
  area: [width: number, height: number];
  center: Vector3Tuple;
  color: string;
  fill?: number;
}

/** A grid of little windows laid across a wall face. */
export const WindowGrid = ({
  cols,
  rows,
  area,
  center,
  color,
  fill = 0.6,
}: WindowGridProps) => {
  const [width, height] = area;
  const cellW = width / cols;
  const cellH = height / rows;
  const [cx, cy, cz] = center;

  const windows: PanelProps[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      windows.push({
        size: [cellW * fill, cellH * fill, 0.05],
        color,
        position: [
          cx - width / 2 + cellW * (c + 0.5),
          cy - height / 2 + cellH * (r + 0.5),
          cz,
        ],
      });
    }
  }

  return (
    <group>
      {windows.map((props, index) => (
        <Panel key={index} {...props} />
      ))}
    </group>
  );
};
