import type { ReactNode } from "react";
import type { Vector3Tuple } from "three";
import { BUILDING_COLORS, WINTER_BUILDINGS_ARC } from "./buildingConfig";
import { Panel, WindowGrid } from "./buildingParts";

/**
 * New papercraft buildings for the EPOS quadrant, built from simple boxes in
 * the cut-paper style. Composes a small apartment complex (three blocks), an
 * open parking structure, and a warehouse.
 */

interface ApartmentProps {
  height: number;
  wallColor: string;
  roofColor: string;
  rows: number;
}

/** Living-quarters apartment block: body, window grid, parapet + snow. */
const ApartmentBuilding = ({
  height,
  wallColor,
  roofColor,
  rows,
}: ApartmentProps) => {
  const w = 1.8;
  const d = 1.5;
  return (
    <group>
      <Panel size={[w, height, d]} color={wallColor} position={[0, height / 2, 0]} />
      <Panel size={[w + 0.12, 0.2, d + 0.12]} color={roofColor} position={[0, height + 0.1, 0]} />
      <Panel size={[w + 0.18, 0.06, d + 0.18]} color={BUILDING_COLORS.snow} position={[0, height + 0.23, 0]} />
      <WindowGrid
        cols={3}
        rows={rows}
        area={[1.2, height - 0.9]}
        center={[0, height / 2 + 0.15, d / 2 + 0.03]}
        color={BUILDING_COLORS.warmWindow}
      />
      <Panel size={[0.42, 0.72, 0.08]} color={BUILDING_COLORS.door} position={[0, 0.36, d / 2 + 0.03]} />
    </group>
  );
};

/** Open multi-level parking structure: slabs, corner pillars, low walls. */
const ParkingStructure = () => {
  const w = 2.4;
  const d = 1.8;
  const floors = 3;
  const floorH = 0.9;
  const topY = (floors - 1) * floorH;

  const slabs = Array.from({ length: floors }, (_, i) => i * floorH);
  const pillarX = w / 2 - 0.12;
  const pillarZ = d / 2 - 0.12;
  const pillarH = topY + 0.12;

  return (
    <group>
      {slabs.map((y) => (
        <Panel key={`slab-${y}`} size={[w, 0.12, d]} color={BUILDING_COLORS.concrete} position={[0, y, 0]} />
      ))}
      {[
        [pillarX, pillarZ],
        [-pillarX, pillarZ],
        [pillarX, -pillarZ],
        [-pillarX, -pillarZ],
      ].map(([px, pz], i) => (
        <Panel
          key={`pillar-${i}`}
          size={[0.16, pillarH, 0.16]}
          color={BUILDING_COLORS.concreteDark}
          position={[px, pillarH / 2, pz]}
        />
      ))}
      {slabs.slice(1).map((y) => (
        <Panel
          key={`wall-${y}`}
          size={[w, 0.28, 0.08]}
          color={BUILDING_COLORS.concreteDark}
          position={[0, y - 0.18, d / 2]}
        />
      ))}
      <Panel size={[w + 0.1, 0.06, d + 0.1]} color={BUILDING_COLORS.snow} position={[0, topY + 0.09, 0]} />
      <Panel size={[0.5, 0.5, 0.06]} color={BUILDING_COLORS.sign} position={[w / 2 - 0.1, topY + 0.5, d / 2 - 0.2]} />
    </group>
  );
};

/** Long low warehouse: big roller door, clerestory windows, snowy roof. */
const Warehouse = () => {
  const w = 3.2;
  const h = 1.5;
  const d = 2.0;
  const doors = 1.0;

  return (
    <group>
      <Panel size={[w, h, d]} color={BUILDING_COLORS.warehouseWall} position={[0, h / 2, 0]} />
      <Panel size={[w + 0.14, 0.16, d + 0.14]} color={BUILDING_COLORS.warehouseRoof} position={[0, h + 0.08, 0]} />
      <Panel size={[w + 0.2, 0.06, d + 0.2]} color={BUILDING_COLORS.snow} position={[0, h + 0.18, 0]} />
      <Panel size={[doors, doors, 0.08]} color={BUILDING_COLORS.concrete} position={[0, doors / 2, d / 2 + 0.03]} />
      <WindowGrid
        cols={6}
        rows={1}
        area={[2.6, 0.28]}
        center={[0, h - 0.25, d / 2 + 0.03]}
        color={BUILDING_COLORS.coolWindow}
        fill={0.7}
      />
    </group>
  );
};

/**
 * Places a building on the EPOS backdrop arc: at `angleDeg` around the diorama
 * center, at the configured radius, turned to face inward toward the path.
 */
const ArcSlot = ({
  angleDeg,
  children,
}: {
  angleDeg: number;
  children: ReactNode;
}) => {
  const { radius, scale } = WINTER_BUILDINGS_ARC;
  const t = (angleDeg * Math.PI) / 180;
  const x = radius * Math.cos(t);
  const z = radius * Math.sin(t);
  // Face the center: default +Z forward should point toward the origin.
  const rotationY = Math.atan2(x, z) + Math.PI;
  const position: Vector3Tuple = [x, 0, z];
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {children}
    </group>
  );
};

export const WinterBuildings = () => {
  return (
    <group position={[0, WINTER_BUILDINGS_ARC.groundY, 0]}>
      {/* Apartment complex: three blocks of varying height/color. */}
      <ArcSlot angleDeg={-84}>
        <ApartmentBuilding
          height={2.6}
          wallColor={BUILDING_COLORS.apartmentWall}
          roofColor={BUILDING_COLORS.apartmentRoof}
          rows={3}
        />
      </ArcSlot>
      <ArcSlot angleDeg={-70}>
        <ApartmentBuilding
          height={3.4}
          wallColor={BUILDING_COLORS.apartmentWallAlt}
          roofColor={BUILDING_COLORS.apartmentRoof}
          rows={4}
        />
      </ArcSlot>
      <ArcSlot angleDeg={-56}>
        <ApartmentBuilding
          height={3.0}
          wallColor={BUILDING_COLORS.apartmentWallAlt2}
          roofColor={BUILDING_COLORS.apartmentRoof}
          rows={3}
        />
      </ArcSlot>
      <ArcSlot angleDeg={-28}>
        <ParkingStructure />
      </ArcSlot>
      <ArcSlot angleDeg={-12}>
        <Warehouse />
      </ArcSlot>
    </group>
  );
};
