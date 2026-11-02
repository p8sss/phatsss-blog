/**
 * Pure timing + kinematics for the factory chain. One "job" carries a draft block
 * through every station in order: conveyor → laser sensor → robot arm.
 * Everything here is a function of job time, so any moment can be rendered on demand.
 */

export type StageId = "conveyor" | "laser" | "robot";

export const STAGE_ORDER: readonly StageId[] = ["conveyor", "laser", "robot"];

/** Seconds each station owns the block. */
export const STAGE_DURATION: Readonly<Record<StageId, number>> = {
  conveyor: 2.8,
  laser: 2.4,
  robot: 3.4,
};

export const JOB_DURATION = STAGE_ORDER.reduce((sum, id) => sum + STAGE_DURATION[id], 0);

// World layout (x runs along the belt, block travels toward −x).
export const LAYOUT = {
  beltStartX: 6,
  beltEndX: -3,
  beltY: 0.55,
  beltDepth: 3.1,
  spawnX: 5.6,
  gateX: -0.9,
  pickX: -2.5,
  robot: { x: -4.4, z: 0 },
  pallet: { x: -4.4, z: -2 },
  blockSize: 0.5,
} as const;

export const STACK_COLUMNS = 3;
export const STACK_LAYERS = 2;
export const STACK_CAPACITY = STACK_COLUMNS * STACK_LAYERS;

export interface StageSample {
  stage: StageId;
  /** 0→1 within the current stage. */
  progress: number;
}

export function clamp01(v: number): number {
  return Math.min(Math.max(v, 0), 1);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Which station owns the block at `jobTime` (seconds since the job started). */
export function stageAt(jobTime: number): StageSample {
  let start = 0;
  for (const stage of STAGE_ORDER) {
    const end = start + STAGE_DURATION[stage];
    if (jobTime < end) return { stage, progress: clamp01((jobTime - start) / STAGE_DURATION[stage]) };
    start = end;
  }
  return { stage: "robot", progress: 1 };
}

/** Job time at the middle of a stage — the pose shown for a still frame. */
export function stageMidpoint(stage: StageId): number {
  let start = 0;
  for (const id of STAGE_ORDER) {
    if (id === stage) return start + STAGE_DURATION[id] * 0.5;
    start += STAGE_DURATION[id];
  }
  return 0;
}

// Laser sub-phases, as fractions of the laser stage.
const LASER_SCAN_START = 0.15;
const LASER_SCAN_END = 0.65;
export const LASER_POLISH_AT = 0.42;

/** Beam height offset 0→1→0 while scanning; 0 when idle. */
export function laserSweep(progress: number): number {
  if (progress < LASER_SCAN_START || progress > LASER_SCAN_END) return 0;
  const t = (progress - LASER_SCAN_START) / (LASER_SCAN_END - LASER_SCAN_START);
  return Math.sin(t * Math.PI);
}

/** Block x on the belt while the conveyor and laser stages own it. */
export function blockBeltX({ stage, progress }: StageSample): number {
  if (stage === "conveyor") {
    return LAYOUT.spawnX + (LAYOUT.gateX - LAYOUT.spawnX) * easeInOutCubic(progress);
  }
  if (stage === "laser") {
    const exit = clamp01((progress - LASER_SCAN_END) / (1 - LASER_SCAN_END));
    return LAYOUT.gateX + (LAYOUT.pickX - LAYOUT.gateX) * easeInOutCubic(exit);
  }
  return LAYOUT.pickX;
}

/** Belt surface speed factor (0 = stopped) — the belt halts under the scanner. */
export function beltSpeed({ stage, progress }: StageSample): number {
  if (stage === "conveyor") return 1;
  if (stage === "laser") return progress > LASER_SCAN_END ? 1 : 0;
  return 0;
}

// ── Robot arm ────────────────────────────────────────────────────────

/** Arm target in cylindrical coords around the robot base: yaw (rad), reach, height. */
export interface ArmTarget {
  yaw: number;
  reach: number;
  height: number;
}

const PICK_TARGET = toCylindrical(LAYOUT.pickX, 0);
const HOVER_HEIGHT = 1.9;
const GRAB_HEIGHT = LAYOUT.beltY + LAYOUT.blockSize * 0.5;

function toCylindrical(x: number, z: number): { yaw: number; reach: number } {
  const dx = x - LAYOUT.robot.x;
  const dz = z - LAYOUT.robot.z;
  // keep yaw in [0, 2π) so the swing from belt to pallet never takes the long way round
  const yaw = Math.atan2(dx, dz);
  return { yaw: yaw < 0 ? yaw + Math.PI * 2 : yaw, reach: Math.hypot(dx, dz) };
}

/** World position of a stack slot's block centre, relative to the pallet centre. */
export function stackSlotOffset(slot: number): { x: number; y: number; z: number } {
  const column = slot % STACK_COLUMNS;
  const layer = Math.floor(slot / STACK_COLUMNS);
  const gap = LAYOUT.blockSize * 1.1;
  return { x: (column - (STACK_COLUMNS - 1) / 2) * gap, y: layer * LAYOUT.blockSize, z: 0 };
}

export const PALLET_TOP = 0.22;

/** Arm waypoints [fraction of robot stage, target, gripClosed]. Place height depends on the slot. */
function robotWaypoints(slot: number): [number, ArmTarget, boolean][] {
  const offset = stackSlotOffset(slot);
  const place = toCylindrical(LAYOUT.pallet.x + offset.x, LAYOUT.pallet.z + offset.z);
  const placeHeight = PALLET_TOP + offset.y + LAYOUT.blockSize * 0.5;
  const abovePick = { ...PICK_TARGET, height: HOVER_HEIGHT };
  const atPick = { ...PICK_TARGET, height: GRAB_HEIGHT };
  const abovePlace = { ...place, height: HOVER_HEIGHT + 0.2 };
  const atPlace = { ...place, height: placeHeight };
  return [
    [0, abovePick, false],
    [0.16, atPick, false],
    [0.24, atPick, true],
    [0.38, abovePick, true],
    [0.62, abovePlace, true],
    [0.76, atPlace, true],
    [0.82, atPlace, false],
    [0.92, abovePlace, false],
    [1, abovePick, false],
  ];
}

export interface ArmPose {
  target: ArmTarget;
  gripClosed: boolean;
  /** True while the block rides in the gripper. */
  carrying: boolean;
}

/** Arm pose during the robot stage; idles above the pick point otherwise. */
export function armPose({ stage, progress }: StageSample, slot: number): ArmPose {
  const waypoints = robotWaypoints(slot);
  if (stage !== "robot") return { target: waypoints[0][1], gripClosed: false, carrying: false };
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [t0, a, gripA] = waypoints[i];
    const [t1, b] = waypoints[i + 1];
    if (progress <= t1) {
      const t = easeInOutCubic(clamp01((progress - t0) / (t1 - t0)));
      return {
        target: { yaw: a.yaw + (b.yaw - a.yaw) * t, reach: a.reach + (b.reach - a.reach) * t, height: a.height + (b.height - a.height) * t },
        gripClosed: gripA,
        carrying: gripA,
      };
    }
  }
  return { target: waypoints[waypoints.length - 1][1], gripClosed: false, carrying: false };
}

/** Placement is done once the gripper opens over the pallet. */
export const ROBOT_RELEASE_AT = 0.82;

// Arm geometry shared with the model builder.
export const ARM = {
  shoulderHeight: 0.9,
  upper: 1.5,
  fore: 1.35,
  /** Wrist pivot to the centre of a gripped block. */
  hand: 0.42,
} as const;

/**
 * Two-link planar IK, elbow up. Returns shoulder pitch, elbow pitch, and the wrist pitch
 * that keeps the gripper pointing straight down. Unreachable targets are clamped.
 */
export function solveArm(target: ArmTarget): { shoulder: number; elbow: number; wrist: number } {
  const r = target.reach;
  const h = target.height + ARM.hand - ARM.shoulderHeight;
  const { upper: l1, fore: l2 } = ARM;
  const cosElbow = Math.min(Math.max((r * r + h * h - l1 * l1 - l2 * l2) / (2 * l1 * l2), -1), 1);
  const elbow = Math.acos(cosElbow);
  const shoulder = Math.atan2(r, h) - Math.atan2(l2 * Math.sin(elbow), l1 + l2 * Math.cos(elbow));
  return { shoulder, elbow, wrist: Math.PI - (shoulder + elbow) };
}
