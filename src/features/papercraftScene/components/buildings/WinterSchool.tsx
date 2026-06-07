import type { Vector3Tuple } from "three";
import {
  BUILDING_COLORS,
  ROAD_LOOP,
  WINTER_SCHOOL_TRANSFORM,
} from "./buildingConfig";
import { Panel, WindowGrid } from "./buildingParts";

/**
 * Elementary school scene for the winter floor: a schoolhouse with a little bell
 * tower and flag, a road running up to it, lane markings, and streetlights.
 */

/** A single streetlight: pole, arm, and a softly glowing lamp head. */
const Streetlight = ({ position }: { position: Vector3Tuple }) => (
  <group position={position}>
    <Panel size={[0.07, 1.2, 0.07]} color={BUILDING_COLORS.lampPole} position={[0, 0.6, 0]} />
    <Panel size={[0.4, 0.07, 0.07]} color={BUILDING_COLORS.lampPole} position={[0.18, 1.16, 0]} />
    <Panel
      size={[0.2, 0.14, 0.2]}
      color={BUILDING_COLORS.lampGlow}
      position={[0.34, 1.08, 0]}
      glow={BUILDING_COLORS.lampGlow}
      glowIntensity={1.6}
    />
  </group>
);

const Schoolhouse = () => {
  const w = 3.2;
  const h = 1.5;
  const d = 1.6;
  return (
    <group position={[0, 0, -1.6]}>
      <Panel size={[w, h, d]} color={BUILDING_COLORS.schoolWall} position={[0, h / 2, 0]} />
      {/* Trim band + roof + snow */}
      <Panel size={[w + 0.05, 0.22, d + 0.05]} color={BUILDING_COLORS.schoolWallTrim} position={[0, h - 0.11, 0]} />
      <Panel size={[w + 0.22, 0.2, d + 0.22]} color={BUILDING_COLORS.schoolRoof} position={[0, h + 0.1, 0]} />
      <Panel size={[w + 0.28, 0.06, d + 0.28]} color={BUILDING_COLORS.snow} position={[0, h + 0.23, 0]} />

      {/* Window rows */}
      <WindowGrid cols={6} rows={2} area={[2.6, 0.9]} center={[0, h / 2 + 0.1, d / 2 + 0.03]} color={BUILDING_COLORS.coolWindow} fill={0.66} />

      {/* Entrance: porch block, door, steps */}
      <Panel size={[0.9, 1.0, 0.4]} color={BUILDING_COLORS.schoolWallTrim} position={[0, 0.5, d / 2 + 0.2]} />
      <Panel size={[0.42, 0.74, 0.08]} color={BUILDING_COLORS.schoolDoor} position={[0, 0.37, d / 2 + 0.41]} />
      <Panel size={[1.0, 0.1, 0.5]} color={BUILDING_COLORS.concrete} position={[0, 0.05, d / 2 + 0.45]} />

      {/* Bell tower + flag */}
      <Panel size={[0.55, 0.75, 0.55]} color={BUILDING_COLORS.schoolWallTrim} position={[0, h + 0.55, 0]} />
      <Panel size={[0.62, 0.22, 0.62]} color={BUILDING_COLORS.schoolRoof} position={[0, h + 1.0, 0]} />
      <Panel size={[0.04, 0.9, 0.04]} color={BUILDING_COLORS.lampPole} position={[0, h + 1.55, 0]} />
      <Panel size={[0.4, 0.26, 0.03]} color={BUILDING_COLORS.flag} position={[0.22, h + 1.78, 0]} />
    </group>
  );
};

/** Evenly spaced centerline offsets across a span (excluding the corners). */
const centerlineOffsets = (span: number, spacing: number) => {
  const count = Math.max(1, Math.round(span / spacing));
  const step = span / count;
  return Array.from({ length: count }, (_, i) => -span / 2 + step * (i + 0.5));
};

/** A looping road around the school: four bands + dashed centerlines. */
const Road = () => {
  const { width, slabHeight, halfX, halfZ, center, dashSpacing, dashLength, dashWidth } = ROAD_LOOP;
  const bandX = halfX * 2 + width;
  const bandZ = halfZ * 2 + width;
  const dashY = slabHeight;

  const xDashes = centerlineOffsets(halfX * 2, dashSpacing);
  const zDashes = centerlineOffsets(halfZ * 2, dashSpacing);

  return (
    <group position={center}>
      {/* The four straight road bands that close into a loop. */}
      <Panel size={[bandX, slabHeight, width]} color={BUILDING_COLORS.road} position={[0, 0, halfZ]} />
      <Panel size={[bandX, slabHeight, width]} color={BUILDING_COLORS.road} position={[0, 0, -halfZ]} />
      <Panel size={[width, slabHeight, bandZ]} color={BUILDING_COLORS.road} position={[halfX, 0, 0]} />
      <Panel size={[width, slabHeight, bandZ]} color={BUILDING_COLORS.road} position={[-halfX, 0, 0]} />

      {/* Dashed centerlines along each side. */}
      {xDashes.map((x) => (
        <Panel key={`n-${x}`} size={[dashLength, slabHeight, dashWidth]} color={BUILDING_COLORS.roadLine} position={[x, dashY, halfZ]} />
      ))}
      {xDashes.map((x) => (
        <Panel key={`s-${x}`} size={[dashLength, slabHeight, dashWidth]} color={BUILDING_COLORS.roadLine} position={[x, dashY, -halfZ]} />
      ))}
      {zDashes.map((z) => (
        <Panel key={`e-${z}`} size={[dashWidth, slabHeight, dashLength]} color={BUILDING_COLORS.roadLine} position={[halfX, dashY, z]} />
      ))}
      {zDashes.map((z) => (
        <Panel key={`w-${z}`} size={[dashWidth, slabHeight, dashLength]} color={BUILDING_COLORS.roadLine} position={[-halfX, dashY, z]} />
      ))}
    </group>
  );
};

export const WinterSchool = () => {
  const { position, rotation, scale } = WINTER_SCHOOL_TRANSFORM;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Road />
      <Schoolhouse />
      {/* Lamps framing the four corners of the road loop. */}
      <Streetlight position={[2.95, 0, 4.6]} />
      <Streetlight position={[-2.95, 0, 4.6]} />
      <Streetlight position={[2.95, 0, -1.0]} />
      <Streetlight position={[-2.95, 0, -1.0]} />
    </group>
  );
};
