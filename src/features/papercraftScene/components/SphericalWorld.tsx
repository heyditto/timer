import type { ReactNode } from "react";
import { Text } from "@react-three/drei";
import type { Vector3Tuple } from "three";
import { BackSide, DoubleSide } from "three";

const WORLD = {
  radius: 15,
  floorRadius: 12.6,
  floorThickness: 0.12,
  floorY: 0,
  wallHeight: 8,
  wallY: 3.7,
  wallSegments: 64,
  paperThickness: 0.08,
} as const;

const COLORS = {
  floor: "#f5efe0",
  floorEdge: "#dfcfad",
  wallWinter: "#dbe7ef",
  wallSpring: "#e7efd4",
  wallSummer: "#f8e8ba",
  wallFall: "#ecd9c7",
  floorWinter: "#eef6fb",
  floorSpring: "#edf5df",
  floorSummer: "#faefc7",
  floorFall: "#f1dfcf",
  horizonWinter: "#f7fbff",
  horizonSpring: "#f7e2ef",
  horizonSummer: "#f8d47c",
  horizonFall: "#c9825d",
  divider: "#c6b38d",
  shadow: "#d7c39e",
  cloud: "#fff7ea",
  star: "#f6d36f",
} as const;

const QUADRANTS = [
  {
    key: "epos",
    label: "EPOS",
    start: -Math.PI / 2,
    color: COLORS.wallWinter,
    floor: COLORS.floorWinter,
    horizon: COLORS.horizonWinter,
  },
  {
    key: "tomoko",
    label: "TOMOKO",
    start: 0,
    color: COLORS.wallSpring,
    floor: COLORS.floorSpring,
    horizon: COLORS.horizonSpring,
  },
  {
    key: "mlqt",
    label: "MLQT",
    start: Math.PI / 2,
    color: COLORS.wallSummer,
    floor: COLORS.floorSummer,
    horizon: COLORS.horizonSummer,
  },
  {
    key: "digitalTwin",
    label: "Digital Twin",
    start: Math.PI,
    color: COLORS.wallFall,
    floor: COLORS.floorFall,
    horizon: COLORS.horizonFall,
  },
] as const;

interface CurvedPanelProps {
  radius: number;
  height: number;
  y: number;
  thetaStart: number;
  thetaLength: number;
  color: string;
  opacity?: number;
}

const CurvedPanel = ({
  radius,
  height,
  y,
  thetaStart,
  thetaLength,
  color,
  opacity = 1,
}: CurvedPanelProps) => (
  <mesh position={[0, y, 0]}>
    <cylinderGeometry
      args={[
        radius,
        radius,
        height,
        WORLD.wallSegments,
        1,
        true,
        thetaStart,
        thetaLength,
      ]}
    />
    <meshStandardMaterial
      color={color}
      roughness={0.9}
      side={BackSide}
      transparent={opacity < 1}
      opacity={opacity}
    />
  </mesh>
);

const PaperDisk = ({
  radius,
  height,
  y,
  color,
}: {
  radius: number;
  height: number;
  y: number;
  color: string;
}) => (
  <mesh position={[0, y, 0]}>
    <cylinderGeometry args={[radius, radius, height, 96]} />
    <meshStandardMaterial color={color} roughness={0.88} flatShading />
  </mesh>
);

const FloorQuadrant = ({
  thetaStart,
  thetaLength,
  color,
}: {
  thetaStart: number;
  thetaLength: number;
  color: string;
}) => (
  <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WORLD.floorY + 0.006, 0]}>
    <circleGeometry args={[WORLD.floorRadius, 48, thetaStart, thetaLength]} />
    <meshStandardMaterial color={color} roughness={0.88} side={DoubleSide} />
  </mesh>
);

const DividerSeam = ({ angle }: { angle: number }) => {
  const seamLength = WORLD.floorRadius * 2;
  const halfSeam = seamLength / 4;

  return (
    <mesh
      position={[
        Math.cos(angle) * halfSeam,
        WORLD.floorY + 0.04,
        Math.sin(angle) * halfSeam,
      ]}
      rotation={[0, Math.PI / 2 - angle, 0]}
    >
      <boxGeometry args={[0.08, 0.045, seamLength / 2]} />
      <meshStandardMaterial color={COLORS.divider} roughness={0.9} />
    </mesh>
  );
};

const WallSeam = ({ angle }: { angle: number }) => (
  <mesh
    position={[
      Math.cos(angle) * (WORLD.radius - WORLD.paperThickness * 2),
      WORLD.wallY,
      Math.sin(angle) * (WORLD.radius - WORLD.paperThickness * 2),
    ]}
    rotation={[0, Math.PI / 2 - angle, 0]}
  >
    <boxGeometry args={[0.1, WORLD.wallHeight, 0.08]} />
    <meshStandardMaterial color={COLORS.divider} roughness={0.9} />
  </mesh>
);

const PaperOval = ({
  position,
  scale,
  color,
}: {
  position: Vector3Tuple;
  scale: Vector3Tuple;
  color: string;
}) => (
  <mesh position={position} scale={scale}>
    <sphereGeometry args={[1, 24, 12]} />
    <meshStandardMaterial color={color} roughness={0.95} flatShading />
  </mesh>
);

const FloatingCutout = ({
  position,
  rotation,
  children,
}: {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  children: ReactNode;
}) => (
  <group position={position} rotation={rotation}>
    {children}
  </group>
);

const Cloud = ({ position, rotation }: { position: Vector3Tuple; rotation: Vector3Tuple }) => (
  <FloatingCutout position={position} rotation={rotation}>
    <PaperOval position={[-0.38, 0, 0]} scale={[0.52, 0.22, 0.04]} color={COLORS.cloud} />
    <PaperOval position={[0, 0.08, 0.01]} scale={[0.62, 0.3, 0.04]} color={COLORS.cloud} />
    <PaperOval position={[0.42, -0.02, 0]} scale={[0.48, 0.2, 0.04]} color={COLORS.cloud} />
  </FloatingCutout>
);

const Star = ({ position, rotation }: { position: Vector3Tuple; rotation: Vector3Tuple }) => (
  <mesh position={position} rotation={rotation}>
    <circleGeometry args={[0.18, 5]} />
    <meshStandardMaterial color={COLORS.star} roughness={0.85} side={DoubleSide} />
  </mesh>
);

const QuadrantLabel = ({
  label,
  angle,
}: {
  label: string;
  angle: number;
}) => {
  const radius = WORLD.radius - 0.18;
  const position: Vector3Tuple = [
    Math.cos(angle) * radius,
    2.6,
    Math.sin(angle) * radius,
  ];

  return (
    <Text
      position={position}
      rotation={[0, Math.PI / 2 - angle, 0]}
      fontSize={label.length > 8 ? 0.58 : 0.72}
      letterSpacing={0.04}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.025}
      outlineColor="#fdf8ec"
    >
      {label}
      <meshStandardMaterial color="#5f5140" roughness={0.8} side={DoubleSide} />
    </Text>
  );
};

const polarPosition = (radius: number, angle: number, y = 0): Vector3Tuple => [
  Math.cos(angle) * radius,
  y,
  Math.sin(angle) * radius,
];

const faceCenterRotation = (angle: number): Vector3Tuple => [
  0,
  -angle - Math.PI / 2,
  0,
];

const SceneBox = ({
  size,
  color,
  position,
  rotation,
}: {
  size: Vector3Tuple;
  color: string;
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
}) => (
  <mesh position={position} rotation={rotation}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.86} flatShading />
  </mesh>
);

const FilingCabinet = ({
  angle,
  radius,
  height,
  color,
}: {
  angle: number;
  radius: number;
  height: number;
  color: string;
}) => (
  <group position={polarPosition(radius, angle, 0.08)} rotation={faceCenterRotation(angle)}>
    <SceneBox size={[0.8, height, 0.56]} color={color} position={[0, height / 2, 0]} />
    {[0.42, 0.92, 1.42].map((y) => (
      <group key={y}>
        <SceneBox size={[0.68, 0.08, 0.04]} color="#f6ead4" position={[0, y, 0.3]} />
        <SceneBox size={[0.22, 0.03, 0.035]} color="#9d8f78" position={[0, y - 0.12, 0.33]} />
      </group>
    ))}
    <SceneBox size={[0.58, 0.04, 0.42]} color="#fff8e8" position={[0.12, height + 0.04, 0.02]} rotation={[0.02, 0.18, 0.18]} />
    <SceneBox size={[0.5, 0.04, 0.38]} color="#f8d38b" position={[-0.18, height + 0.1, 0.03]} rotation={[-0.05, -0.28, -0.16]} />
  </group>
);

const GraphNode = ({ position, color }: { position: Vector3Tuple; color: string }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.16, 16, 10]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} roughness={0.55} />
  </mesh>
);

const GraphEdge = ({ from, to }: { from: Vector3Tuple; to: Vector3Tuple }) => {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const length = Math.hypot(dx, dz);
  const angle = Math.atan2(dx, dz);

  return (
    <SceneBox
      size={[0.045, 0.045, length]}
      color="#74a8c7"
      position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]}
      rotation={[0, angle, 0]}
    />
  );
};

const TomokoQuadrant = () => {
  const graphNodes = [
    polarPosition(9.2, 0.72, 1.1),
    polarPosition(9.8, 0.9, 1.45),
    polarPosition(8.6, 1.04, 1.25),
    polarPosition(10.6, 1.14, 1.65),
    polarPosition(9.4, 1.3, 1.35),
  ];

  return (
    <group>
      {[
        [0.12, 9.7, 1.45, "#8aa0ad"],
        [0.22, 10.5, 1.7, "#78939f"],
        [0.34, 9.4, 1.55, "#9ba8a3"],
        [0.46, 10.25, 1.38, "#879d8e"],
      ].map(([angle, radius, height, color]) => (
        <FilingCabinet
          key={`${angle}-${radius}`}
          angle={angle as number}
          radius={radius as number}
          height={height as number}
          color={color as string}
        />
      ))}
      {graphNodes.slice(1).map((node, index) => (
        <GraphEdge key={`edge-${index}`} from={graphNodes[0]} to={node} />
      ))}
      {graphNodes.map((position, index) => (
        <GraphNode
          key={`node-${index}`}
          position={position}
          color={index === 0 ? "#4f93c3" : "#72c6a2"}
        />
      ))}
    </group>
  );
};

const MiniApartment = ({
  angle,
  radius,
  height,
  color,
}: {
  angle: number;
  radius: number;
  height: number;
  color: string;
}) => (
  <group position={polarPosition(radius, angle, 0.06)} rotation={faceCenterRotation(angle)}>
    <SceneBox size={[0.9, height, 0.72]} color={color} position={[0, height / 2, 0]} />
    <SceneBox size={[1.02, 0.12, 0.82]} color="#8c6b5a" position={[0, height + 0.06, 0]} />
    {[-0.24, 0.24].map((x) =>
      [0.58, 1.08, 1.58].map((y) => (
        <SceneBox
          key={`${x}-${y}`}
          size={[0.16, 0.18, 0.04]}
          color="#f5d27a"
          position={[x, Math.min(y, height - 0.24), 0.39]}
        />
      )),
    )}
  </group>
);

const Plane = ({
  angle,
  radius,
  y,
  color,
}: {
  angle: number;
  radius: number;
  y: number;
  color: string;
}) => (
  <group position={polarPosition(radius, angle, y)} rotation={[0.08, -angle + Math.PI / 2, -0.1]}>
    <SceneBox size={[0.24, 0.18, 1.0]} color={color} position={[0, 0, 0]} />
    <SceneBox size={[1.25, 0.05, 0.32]} color="#edf4f6" position={[0, 0.02, -0.05]} />
    <SceneBox size={[0.54, 0.04, 0.26]} color="#edf4f6" position={[0, 0.09, 0.42]} />
    <SceneBox size={[0.16, 0.3, 0.08]} color={color} position={[0, 0.2, 0.48]} />
  </group>
);

const Marine = ({ angle, radius }: { angle: number; radius: number }) => (
  <group position={polarPosition(radius, angle, 0.1)} rotation={faceCenterRotation(angle)}>
    <mesh position={[0, 0.82, 0]}>
      <sphereGeometry args={[0.13, 12, 8]} />
      <meshStandardMaterial color="#8b6f54" roughness={0.82} />
    </mesh>
    <SceneBox size={[0.08, 0.035, 0.025]} color="#2e2a24" position={[0, 0.84, 0.13]} />
    <SceneBox size={[0.24, 0.42, 0.14]} color="#5f7450" position={[0, 0.48, 0]} />
    <SceneBox size={[0.34, 0.09, 0.12]} color="#4d633f" position={[0, 0.72, 0.02]} />
    <SceneBox size={[0.07, 0.3, 0.07]} color="#2f3d2b" position={[-0.07, 0.18, 0]} />
    <SceneBox size={[0.07, 0.3, 0.07]} color="#2f3d2b" position={[0.07, 0.18, 0]} />
  </group>
);

const MlqtQuadrant = () => (
  <group>
    <Plane angle={1.82} radius={9.2} y={3.2} color="#8ca9b7" />
    <Plane angle={2.34} radius={10.4} y={4.15} color="#76909e" />
    <Plane angle={2.78} radius={8.8} y={2.75} color="#9fb4bc" />
    <MiniApartment angle={1.82} radius={10.7} height={1.7} color="#d7b08c" />
    <MiniApartment angle={2.08} radius={11.1} height={2.1} color="#cfa88e" />
    <MiniApartment angle={2.58} radius={10.85} height={1.9} color="#e0bd91" />
    {[1.9, 2.18, 2.46, 2.74].map((angle) => (
      <Marine key={angle} angle={angle} radius={8.95} />
    ))}
  </group>
);

const ScanBeam = ({ y }: { y: number }) => (
  <mesh position={[0, -y / 2, 0]}>
    <coneGeometry args={[0.74, y, 24, 1, true]} />
    <meshStandardMaterial color="#8ed9ff" transparent opacity={0.24} side={DoubleSide} />
  </mesh>
);

const Drone = ({ angle, radius, y }: { angle: number; radius: number; y: number }) => (
  <group position={polarPosition(radius, angle, y)} rotation={faceCenterRotation(angle)}>
    <SceneBox size={[0.38, 0.12, 0.28]} color="#45515a" position={[0, 0, 0]} />
    <SceneBox size={[1.1, 0.05, 0.05]} color="#303a42" position={[0, 0, 0]} />
    <SceneBox size={[0.05, 0.05, 1.1]} color="#303a42" position={[0, 0, 0]} />
    {[
      [-0.54, 0, -0.54],
      [0.54, 0, -0.54],
      [-0.54, 0, 0.54],
      [0.54, 0, 0.54],
    ].map(([x, py, z]) => (
      <mesh key={`${x}-${z}`} position={[x, py + 0.03, z]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.025, 20]} />
        <meshStandardMaterial color="#d7edf3" roughness={0.6} transparent opacity={0.75} />
      </mesh>
    ))}
    <ScanBeam y={y - 0.18} />
  </group>
);

const RoadStrip = ({
  angle,
  radius,
  length,
  rotationOffset = 0,
}: {
  angle: number;
  radius: number;
  length: number;
  rotationOffset?: number;
}) => (
  <SceneBox
    size={[0.62, 0.035, length]}
    color="#696966"
    position={polarPosition(radius, angle, 0.08)}
    rotation={[0, -angle - Math.PI / 2 + rotationOffset, 0]}
  />
);

const Car = ({ angle, radius, color }: { angle: number; radius: number; color: string }) => (
  <group position={polarPosition(radius, angle, 0.16)} rotation={faceCenterRotation(angle)}>
    <SceneBox size={[0.28, 0.16, 0.48]} color={color} position={[0, 0.12, 0]} />
    <SceneBox size={[0.18, 0.1, 0.24]} color="#cfe6ef" position={[0, 0.25, 0.02]} />
    <SceneBox size={[0.08, 0.08, 0.06]} color="#2d2c2b" position={[-0.17, 0.08, -0.16]} />
    <SceneBox size={[0.08, 0.08, 0.06]} color="#2d2c2b" position={[0.17, 0.08, -0.16]} />
    <SceneBox size={[0.08, 0.08, 0.06]} color="#2d2c2b" position={[-0.17, 0.08, 0.16]} />
    <SceneBox size={[0.08, 0.08, 0.06]} color="#2d2c2b" position={[0.17, 0.08, 0.16]} />
  </group>
);

const GasStation = ({ angle, radius }: { angle: number; radius: number }) => (
  <group position={polarPosition(radius, angle, 0.08)} rotation={faceCenterRotation(angle)}>
    <SceneBox size={[1.05, 0.58, 0.72]} color="#f2e1c0" position={[0, 0.29, 0]} />
    <SceneBox size={[1.32, 0.12, 0.92]} color="#d45c4d" position={[0, 0.68, 0]} />
    <SceneBox size={[1.55, 0.08, 0.96]} color="#f4d873" position={[0, 1.05, 0.2]} />
    <SceneBox size={[0.08, 0.72, 0.08]} color="#d45c4d" position={[-0.58, 0.7, 0.5]} />
    <SceneBox size={[0.08, 0.72, 0.08]} color="#d45c4d" position={[0.58, 0.7, 0.5]} />
    <SceneBox size={[0.18, 0.46, 0.16]} color="#5b6f7a" position={[-0.28, 0.23, 0.56]} />
    <SceneBox size={[0.18, 0.46, 0.16]} color="#5b6f7a" position={[0.28, 0.23, 0.56]} />
  </group>
);

const DigitalTwinQuadrant = () => (
  <group>
    <RoadStrip angle={3.42} radius={9.9} length={4.7} />
    <RoadStrip angle={4.1} radius={9.8} length={4.1} rotationOffset={Math.PI / 2} />
    <MiniApartment angle={3.28} radius={10.75} height={1.8} color="#b9c0bd" />
    <MiniApartment angle={3.58} radius={11.15} height={2.25} color="#c6b19a" />
    <MiniApartment angle={4.38} radius={10.9} height={1.95} color="#abb9c3" />
    <GasStation angle={3.92} radius={10.55} />
    <Car angle={3.48} radius={8.95} color="#d65b55" />
    <Car angle={3.84} radius={9.2} color="#e5bd4c" />
    <Car angle={4.24} radius={8.9} color="#4f8eb5" />
    <Drone angle={3.45} radius={8.9} y={3.2} />
    <Drone angle={4.02} radius={9.6} y={3.8} />
    <Drone angle={4.42} radius={8.7} y={3.35} />
  </group>
);

/** Native papercraft sphere: a sparse procedural stage for the scroll-follow scene. */
export const SphericalWorld = () => {
  const quadrantLength = Math.PI / 2;

  return (
    <group>
      <PaperDisk
        radius={WORLD.floorRadius}
        height={WORLD.floorThickness}
        y={WORLD.floorY - WORLD.floorThickness / 2}
        color={COLORS.floor}
      />
      <PaperDisk
        radius={WORLD.floorRadius + 0.22}
        height={0.05}
        y={WORLD.floorY - 0.12}
        color={COLORS.floorEdge}
      />

      {QUADRANTS.map(({ key, label, start, color, floor, horizon }) => (
        <group key={key}>
          <FloorQuadrant
            thetaStart={start}
            thetaLength={quadrantLength}
            color={floor}
          />
          <CurvedPanel
            radius={WORLD.radius}
            height={WORLD.wallHeight}
            y={WORLD.wallY}
            thetaStart={start}
            thetaLength={quadrantLength}
            color={color}
          />
          <CurvedPanel
            radius={WORLD.radius - WORLD.paperThickness}
            height={0.72}
            y={1.42}
            thetaStart={start + 0.04}
            thetaLength={quadrantLength - 0.08}
            color={horizon}
            opacity={0.86}
          />
          <QuadrantLabel label={label} angle={start + quadrantLength / 2} />
        </group>
      ))}

      {QUADRANTS.map(({ key, start }) => (
        <group key={`${key}-seam`}>
          <DividerSeam angle={start} />
          <WallSeam angle={start} />
        </group>
      ))}

      <CurvedPanel
        radius={WORLD.floorRadius - 0.1}
        height={0.18}
        y={0.1}
        thetaStart={-Math.PI}
        thetaLength={Math.PI * 2}
        color={COLORS.shadow}
        opacity={0.72}
      />

      <Cloud position={[8.3, 4.2, -10.4]} rotation={[0.05, -0.68, 0.02]} />
      <Cloud position={[-9.6, 4.8, -7.7]} rotation={[0.02, 0.9, -0.04]} />
      <Cloud position={[-8.7, 5.1, 9.4]} rotation={[-0.03, 2.34, 0.03]} />
      <Star position={[10.9, 5.5, 6.1]} rotation={[0, -1.08, 0.2]} />
      <Star position={[-11.2, 4.2, 3.6]} rotation={[0.15, 1.26, -0.15]} />
      <Star position={[2.2, 5.8, -13.3]} rotation={[0, -0.15, 0.4]} />
      <TomokoQuadrant />
      <MlqtQuadrant />
      <DigitalTwinQuadrant />
    </group>
  );
};
