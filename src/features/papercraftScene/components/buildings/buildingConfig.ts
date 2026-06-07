import type { Vector3Tuple } from "three";

/** Flat pastel colors for the papercraft winter buildings. */
export const BUILDING_COLORS = {
  apartmentWall: "#e7d9bf",
  apartmentWallAlt: "#dcc7a6",
  apartmentWallAlt2: "#e9cdb0",
  apartmentRoof: "#b56a4f",
  apartmentRoofAlt: "#8a8f6b",
  apartmentTrim: "#d3bd9b",
  concrete: "#c9c3b8",
  concreteDark: "#a89f90",
  warehouseWall: "#cf9f78",
  warehouseRoof: "#7f8d96",
  door: "#8a6a4f",
  warmWindow: "#f4d27a",
  coolWindow: "#7d96ad",
  sign: "#5f87a8",
  snow: "#f4f5f7",

  schoolWall: "#d7b08c",
  schoolWallTrim: "#efe6d4",
  schoolRoof: "#9a4f43",
  schoolDoor: "#6f4a36",
  road: "#6c6a68",
  roadLine: "#efe9da",
  lampPole: "#4a4640",
  lampGlow: "#ffd97a",
  flag: "#c0573f",
} as const;

/**
 * Layout for the apartment / parking / warehouse cluster. Instead of a straight
 * row (which pokes into the curved backdrop), each building is placed on an arc
 * at a fixed radius and turned to face the center, so the block wraps around the
 * ring just inside the backdrop wall and behind the character path (radius ~11).
 */
export const WINTER_BUILDINGS_ARC = {
  /** Distance of each building from the diorama center. */
  radius: 12,
  /** Ground/snow height the cluster sits on. */
  groundY: 0.3,
  /** Uniform scale applied to every building. */
  scale: 0.85,
};

/**
 * World transform for the school + looping road + streetlights. Dropped onto the
 * pond/ground plane of the area so the block reads as part of the floor rather
 * than floating above it.
 */
export const WINTER_SCHOOL_TRANSFORM = {
  position: [5, -1.18, -4] as Vector3Tuple,
  rotation: [0, -1.17, 0] as Vector3Tuple,
  scale: 0.7,
};

/**
 * Geometry of the looping road around the school. Built as a rounded rectangular
 * ring of four straight road bands with dashed center lines on each side.
 */
export const ROAD_LOOP = {
  /** Width of the paved band. */
  width: 0.95,
  /** Thickness of the road slab and how far the dashes sit above it. */
  slabHeight: 0.04,
  /** Half-extents (to the band centerline) of the loop in group space. */
  halfX: 2.5,
  halfZ: 2.7,
  /** Loop center in the school group's local space. */
  center: [0, 0.02, 1.8] as Vector3Tuple,
  /** Approximate spacing between dashes along a side. */
  dashSpacing: 0.7,
  /** Dash footprint (length along the road, width across). */
  dashLength: 0.34,
  dashWidth: 0.1,
} as const;
