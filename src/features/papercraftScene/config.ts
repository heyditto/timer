/**
 * Tunable constants for the scene rig. Keeping them here avoids magic numbers
 * scattered through the components.
 */

export const CAMERA = {
  /**
   * Field of view of the active perspective camera. Lower = more zoomed in,
   * higher = more zoomed out / wider. The original uses 50.
   */
  fov: 50,
  /** Fixed camera position at the center of the spherical world. */
  centerPosition: [0, 1.9, 0] as const,
  /** Looks at the character's upper body instead of its feet. */
  characterLookAtOffsetY: 0.9,
  /** Exponential smoothing factor applied to position and look-at each frame. */
  lerpFactor: 0.1,
  /** Multiplier for subtle mouse-parallax offset on the look-at target. */
  parallaxStrength: 0.45,
} as const;

export const CHARACTER = {
  /** Smoothing factor for the character following its curve. */
  lerpFactor: 0.1,
  /** Subtle idle bob amplitude (world units). */
  bobAmplitude: 0.06,
  /** Idle bob speed. */
  bobSpeed: 2,
} as const;

/**
 * Scroll-driven "walking" behavior for the central character: while scrolling it
 * swaps to a side-facing walking pose with swinging limbs and a smiling face,
 * then settles back to the front idle pose once scrolling stops.
 */
export const CHARACTER_WALK = {
  /** Ms after the last scroll event before the character is considered idle. */
  idleDelay: 250,
  /** Local Y a pose drops to when hidden, so the inactive pose slides out of view. */
  hiddenOffsetY: -5,
  /** Smoothing for the front/side pose swap slide. */
  poseLerp: 0.18,
  /** Peak limb rotation (radians) at the top of a walk stride. */
  swingAmplitude: 0.7,
  /** How quickly limbs swing relative to scroll progress (0..1 → cycles). */
  swingFrequency: 100,
} as const;

export const ZOOM = {
  initial: 1,
  min: 1,
  max: 3,
  step: 0.01,
} as const;

/** Total scroll distance of the invisible scroll surface (one full loop). */
export const SCROLL_HEIGHT = "1000vh";
