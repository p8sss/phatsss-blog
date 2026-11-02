import * as THREE from "three";
import { ARM, LAYOUT, PALLET_TOP, STAGE_ORDER, type StageId } from "./factoryTimeline";

/** Station accent colours, shared with the stepper UI so the 3D chain and the cards match. */
export const STAGE_COLOR: Readonly<Record<StageId, number>> = {
  conveyor: 0x818cf8,
  laser: 0x22d3ee,
  robot: 0xe879f9,
};

/** Where each station's floor marker sits (on the walkway in front of the belt). */
const WALKWAY_Z = 2.5;
const MARKER_X: Readonly<Record<StageId, number>> = {
  conveyor: 2.6,
  laser: LAYOUT.gateX,
  robot: LAYOUT.robot.x,
};

/** Camera framing per station, plus the overview. */
export const CAMERA_POSES: Readonly<Record<StageId | "overview", { position: THREE.Vector3; target: THREE.Vector3 }>> = {
  overview: { position: new THREE.Vector3(6, 5.4, 8.6), target: new THREE.Vector3(0.2, 0.8, -0.2) },
  conveyor: { position: new THREE.Vector3(6.8, 4, 6.2), target: new THREE.Vector3(2.6, 0.8, 0) },
  laser: { position: new THREE.Vector3(1.8, 3.2, 5), target: new THREE.Vector3(LAYOUT.gateX, 1.1, 0) },
  robot: { position: new THREE.Vector3(-0.6, 4.6, 4.4), target: new THREE.Vector3(-4, 1.2, -0.9) },
};

/** Frees every geometry, material and texture under `root` (call once on teardown). */
export function disposeTree(root: THREE.Object3D): void {
  const materials = new Set<THREE.Material>();
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((m) => materials.add(m));
    else if (material) materials.add(material);
  });
  materials.forEach((m) => {
    (m as THREE.MeshStandardMaterial).map?.dispose();
    m.dispose();
  });
}

function metal(color: number, roughness = 0.45, metalness = 0.65): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function glow(color: number, intensity = 0.6): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.35, metalness: 0.3 });
}

function box(w: number, h: number, d: number, material: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}

function cylinder(rTop: number, rBottom: number, h: number, material: THREE.Material, segments = 20): THREE.Mesh {
  return new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), material);
}

export function buildFloor(): THREE.Group {
  const group = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 48), metal(0x0d1426, 0.85, 0.1));
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);
  const grid = new THREE.GridHelper(34, 34, 0x2a3a63, 0x1a2640);
  const gridMat = grid.material as THREE.Material;
  gridMat.transparent = true;
  gridMat.opacity = 0.45;
  grid.position.y = 0.01;
  group.add(grid);
  return group;
}

function createBeltTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#182136";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#232f4d";
  for (let x = 0; x < size; x += 16) ctx.fillRect(x, 0, 8, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 1);
  return texture;
}

export interface BeltModel {
  group: THREE.Group;
  texture: THREE.CanvasTexture;
  rollers: THREE.Mesh[];
}

export function buildBelt(): BeltModel {
  const group = new THREE.Group();
  const length = LAYOUT.beltStartX - LAYOUT.beltEndX;
  const centerX = (LAYOUT.beltStartX + LAYOUT.beltEndX) / 2;

  const frame = box(length, 0.28, LAYOUT.beltDepth + 0.3, metal(0x141c30, 0.6, 0.5));
  frame.position.set(centerX, 0.24, 0);
  group.add(frame);

  const texture = createBeltTexture();
  const top = new THREE.Mesh(new THREE.PlaneGeometry(length, LAYOUT.beltDepth), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9, color: 0x9aa7c2 }));
  top.rotation.x = -Math.PI / 2;
  top.position.set(centerX, LAYOUT.beltY, 0);
  group.add(top);

  const rollerMat = metal(0x2c3a5c, 0.4, 0.8);
  const rollers: THREE.Mesh[] = [];
  for (let x = LAYOUT.beltEndX + 0.4; x <= LAYOUT.beltStartX - 0.3; x += 1.1) {
    const roller = cylinder(0.14, 0.14, LAYOUT.beltDepth + 0.3, rollerMat, 16);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(x, 0.38, 0);
    group.add(roller);
    rollers.push(roller);
  }
  return { group, texture, rollers };
}

export interface GateModel {
  group: THREE.Group;
  beam: THREE.Mesh;
  beamMaterial: THREE.MeshBasicMaterial;
  caps: THREE.MeshStandardMaterial;
}

export const BEAM_REST_Y = LAYOUT.beltY + 1.05;
export const BEAM_LOW_Y = LAYOUT.beltY + 0.12;

export function buildGate(): GateModel {
  const group = new THREE.Group();
  const postMat = metal(0x1c2740, 0.4, 0.7);
  const caps = glow(STAGE_COLOR.laser, 1.2);
  const halfSpan = LAYOUT.beltDepth / 2 + 0.25;
  for (const z of [-halfSpan, halfSpan]) {
    const post = box(0.18, 1.9, 0.18, postMat);
    post.position.set(LAYOUT.gateX, 0.95, z);
    group.add(post);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), caps);
    cap.position.set(LAYOUT.gateX, 1.92, z);
    group.add(cap);
  }
  const lintel = box(0.16, 0.16, halfSpan * 2 + 0.18, postMat);
  lintel.position.set(LAYOUT.gateX, 1.92, 0);
  group.add(lintel);

  const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  const beam = box(0.06, 0.06, halfSpan * 2, beamMaterial);
  beam.position.set(LAYOUT.gateX, BEAM_REST_Y, 0);
  group.add(beam);
  return { group, beam, beamMaterial, caps };
}

export interface RobotModel {
  group: THREE.Group;
  turret: THREE.Group;
  upper: THREE.Group;
  fore: THREE.Group;
  wrist: THREE.Group;
  /** Block attachment point at the centre between the fingers. */
  grip: THREE.Object3D;
  fingers: [THREE.Mesh, THREE.Mesh];
  accent: THREE.MeshStandardMaterial;
}

export const FINGER_OPEN = 0.34;
export const FINGER_CLOSED = 0.27;

export function buildRobot(): RobotModel {
  const group = new THREE.Group();
  group.position.set(LAYOUT.robot.x, 0, LAYOUT.robot.z);
  const baseMat = metal(0x2a3a63, 0.4, 0.7);
  const armMat = metal(0x3b4a77, 0.45, 0.6);
  const accent = glow(STAGE_COLOR.robot, 0.35);

  const base = cylinder(0.5, 0.65, 0.5, baseMat, 28);
  base.position.y = 0.25;
  group.add(base);

  const turret = new THREE.Group();
  turret.position.y = 0.5;
  group.add(turret);
  const shoulderJoint = cylinder(0.26, 0.26, 0.4, accent);
  shoulderJoint.position.y = 0.2;
  turret.add(shoulderJoint);

  const upper = new THREE.Group();
  upper.position.y = ARM.shoulderHeight - 0.5;
  turret.add(upper);
  const upperLink = box(0.24, ARM.upper, 0.24, armMat);
  upperLink.position.y = ARM.upper / 2;
  upper.add(upperLink);
  const elbowJoint = cylinder(0.18, 0.18, 0.34, accent);
  elbowJoint.rotation.z = Math.PI / 2;
  elbowJoint.position.y = ARM.upper;
  upper.add(elbowJoint);

  const fore = new THREE.Group();
  fore.position.y = ARM.upper;
  upper.add(fore);
  const foreLink = box(0.2, ARM.fore, 0.2, armMat);
  foreLink.position.y = ARM.fore / 2;
  fore.add(foreLink);

  // Wrist frame: after IK its +y points straight down toward the block.
  const wrist = new THREE.Group();
  wrist.position.y = ARM.fore;
  fore.add(wrist);
  const wristJoint = cylinder(0.14, 0.14, 0.26, accent, 16);
  wristJoint.rotation.z = Math.PI / 2;
  wrist.add(wristJoint);
  const palm = box(0.42, 0.08, 0.24, armMat);
  palm.position.y = 0.12;
  wrist.add(palm);

  const fingerMat = glow(0x67e8f9, 0.5);
  const fingerA = box(0.06, 0.36, 0.22, fingerMat);
  const fingerB = box(0.06, 0.36, 0.22, fingerMat);
  fingerA.position.set(-FINGER_OPEN, 0.3, 0);
  fingerB.position.set(FINGER_OPEN, 0.3, 0);
  wrist.add(fingerA, fingerB);

  const grip = new THREE.Object3D();
  grip.position.y = ARM.hand;
  wrist.add(grip);

  return { group, turret, upper, fore, wrist, grip, fingers: [fingerA, fingerB], accent };
}

export function buildPallet(): THREE.Group {
  const group = new THREE.Group();
  group.position.set(LAYOUT.pallet.x, 0, LAYOUT.pallet.z);
  const deck = box(2, PALLET_TOP - 0.04, 0.9, metal(0x3a2f4f, 0.8, 0.2));
  deck.position.y = (PALLET_TOP - 0.04) / 2;
  group.add(deck);
  const rim = box(2.04, 0.04, 0.94, glow(STAGE_COLOR.robot, 0.25));
  rim.position.y = PALLET_TOP - 0.02;
  group.add(rim);
  return group;
}

export interface ChainModel {
  group: THREE.Group;
  rings: Record<StageId, THREE.MeshBasicMaterial>;
  /** Link bars between consecutive stations; scale.x is the fill (0→1). */
  links: THREE.Mesh[];
}

/** Floor "chain": a glowing marker per station joined by links that fill as the block moves on. */
export function buildChain(): ChainModel {
  const group = new THREE.Group();
  const ringGeo = new THREE.RingGeometry(0.34, 0.46, 40);
  const rings = {} as Record<StageId, THREE.MeshBasicMaterial>;
  for (const stage of STAGE_ORDER) {
    const material = new THREE.MeshBasicMaterial({ color: STAGE_COLOR[stage], transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(ringGeo, material);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(MARKER_X[stage], 0.03, WALKWAY_Z);
    group.add(ring);
    rings[stage] = material;
  }

  const trackMat = new THREE.MeshBasicMaterial({ color: 0x2a3a63, transparent: true, opacity: 0.6, depthWrite: false });
  const links: THREE.Mesh[] = [];
  for (let i = 0; i < STAGE_ORDER.length - 1; i++) {
    const from = MARKER_X[STAGE_ORDER[i]] - 0.5;
    const to = MARKER_X[STAGE_ORDER[i + 1]] + 0.5;
    const length = from - to;
    const rail = new THREE.Mesh(new THREE.PlaneGeometry(length, 0.06), trackMat);
    rail.rotation.x = -Math.PI / 2;
    rail.position.set((from + to) / 2, 0.025, WALKWAY_Z);
    group.add(rail);

    // Fill bar grows from the upstream station toward the next one.
    const fillGeo = new THREE.PlaneGeometry(length, 0.08);
    fillGeo.translate(-length / 2, 0, 0);
    const fillMat = new THREE.MeshBasicMaterial({ color: STAGE_COLOR[STAGE_ORDER[i + 1]], transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const fill = new THREE.Mesh(fillGeo, fillMat);
    fill.rotation.x = -Math.PI / 2;
    fill.position.set(from, 0.035, WALKWAY_Z);
    fill.scale.x = 0.0001;
    group.add(fill);
    links.push(fill);
  }
  return { group, rings, links };
}

export interface BlockMaterials {
  draft: THREE.MeshStandardMaterial;
  polished: THREE.MeshStandardMaterial[];
  edges: THREE.LineBasicMaterial;
}

export function buildBlockMaterials(): BlockMaterials {
  return {
    draft: new THREE.MeshStandardMaterial({ color: 0x475069, roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0.85 }),
    polished: [0x818cf8, 0x22d3ee, 0xe879f9].map((c) => glow(c, 0.45)),
    edges: new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.9 }),
  };
}

export function buildBlock(materials: BlockMaterials): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(LAYOUT.blockSize, LAYOUT.blockSize, LAYOUT.blockSize);
  const block = new THREE.Mesh(geometry, materials.draft);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), materials.edges);
  edges.name = "edges";
  block.add(edges);
  return block;
}
