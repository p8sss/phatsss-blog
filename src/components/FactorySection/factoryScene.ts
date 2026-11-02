import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  BEAM_LOW_Y,
  BEAM_REST_Y,
  CAMERA_POSES,
  FINGER_CLOSED,
  FINGER_OPEN,
  STAGE_COLOR,
  buildBelt,
  buildBlock,
  buildBlockMaterials,
  buildChain,
  buildFloor,
  buildGate,
  buildPallet,
  buildRobot,
  disposeTree,
} from "./factoryModels";
import {
  JOB_DURATION,
  LASER_POLISH_AT,
  LAYOUT,
  PALLET_TOP,
  ROBOT_RELEASE_AT,
  STACK_CAPACITY,
  STAGE_ORDER,
  armPose,
  beltSpeed,
  blockBeltX,
  laserSweep,
  solveArm,
  stackSlotOffset,
  stageAt,
  stageMidpoint,
  type StageId,
} from "./factoryTimeline";

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}

export interface FactoryEvents {
  /** Fires when a new station takes the block; `shipped` counts finished jobs. */
  onStage?: (stage: StageId, shipped: number) => void;
  /** Per frame while playing: progress (0→1) of the active stage. */
  onProgress?: (stage: StageId, progress: number) => void;
}

export interface FactoryHandle {
  setPaused(paused: boolean): void;
  /** Glide the camera to a station, or back to the overview with `null`. */
  focus(stage: StageId | null): void;
  dispose(): void;
}

const MAX_DT = 0.05;
const BELT_SCROLL = 0.18;
const FOCUS_EASE = 3.2;
/** Below this aspect the frame is too narrow for the poses; pull back proportionally. */
const NARROW_ASPECT = 1.4;
const NARROW_ZOOM_BOOST = 1.05;

export function buildFactoryScene(
  container: HTMLDivElement,
  events: FactoryEvents,
  options: { reducedMotion?: boolean } = {},
): FactoryHandle {
  const reduced = options.reducedMotion ?? false;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.touchAction = "pan-y"; // vertical swipes still scroll the page on touch
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0e1c, 20, 36);

  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 80);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false; // wheel keeps scrolling the page
  controls.maxPolarAngle = Math.PI * 0.46;
  controls.autoRotateSpeed = 0.5;

  // ── Lights ──────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x3b4a77, 0.9));
  const key = new THREE.DirectionalLight(0xfff2e0, 2.2);
  key.position.set(8, 12, 6);
  const fill = new THREE.DirectionalLight(0x8fb3ff, 0.7);
  fill.position.set(-6, 5, -8);
  const laserLight = new THREE.PointLight(STAGE_COLOR.laser, 20, 10, 2);
  laserLight.position.set(LAYOUT.gateX, 2.2, 0);
  const robotLight = new THREE.PointLight(STAGE_COLOR.robot, 20, 10, 2);
  robotLight.position.set(LAYOUT.robot.x, 3, -0.6);
  scene.add(key, fill, laserLight, robotLight);

  // ── Models ──────────────────────────────────────────────────
  const belt = buildBelt();
  const gate = buildGate();
  const robot = buildRobot();
  const chain = buildChain();
  scene.add(buildFloor(), belt.group, gate.group, robot.group, buildPallet(), chain.group);

  const blockMaterials = buildBlockMaterials();
  const active = buildBlock(blockMaterials);
  scene.add(active);
  const stack: THREE.Mesh[] = [];

  // Laser spark burst when the block is polished.
  const SPARKS = 40;
  const sparkPos = new Float32Array(SPARKS * 3);
  const sparkVel = Array.from({ length: SPARKS }, () => new THREE.Vector3());
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.08, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparks);
  let sparkLife = 0;

  function burst(at: THREE.Vector3) {
    sparkLife = 1;
    for (let i = 0; i < SPARKS; i++) {
      sparkPos.set([at.x, at.y + 0.3, at.z + (Math.random() - 0.5) * 0.4], i * 3);
      sparkVel[i].set((Math.random() - 0.5) * 2.4, 1.2 + Math.random() * 2, (Math.random() - 0.5) * 2.4);
    }
  }

  // ── Job state ───────────────────────────────────────────────
  let jobTime = 0;
  let shipped = 0;
  let polished = false;
  let placed = false;
  /** Pallet slot for the current block, fixed for the whole job so the arm path never jumps. */
  let jobSlot = 0;
  let lastStage: StageId | null = null;
  const blockPos = new THREE.Vector3();

  function resetBlock() {
    polished = false;
    placed = false;
    jobSlot = stack.length;
    active.visible = true;
    active.material = blockMaterials.draft;
    active.getObjectByName("edges")!.visible = true;
    active.scale.setScalar(1);
    active.rotation.set(0, 0, 0);
    if (active.parent !== scene) scene.attach(active);
  }

  function placeOnPallet() {
    const slot = jobSlot;
    const settled = buildBlock(blockMaterials);
    settled.material = active.material;
    settled.getObjectByName("edges")!.visible = false;
    const offset = stackSlotOffset(slot);
    settled.position.set(LAYOUT.pallet.x + offset.x, PALLET_TOP + offset.y + LAYOUT.blockSize / 2, LAYOUT.pallet.z + offset.z);
    scene.add(settled);
    stack.push(settled);
  }

  /** Starts the next block: empties a full pallet first so the new slot is free. */
  function startJob() {
    if (stack.length >= STACK_CAPACITY) clearPallet();
    resetBlock();
  }

  function removeSettled(block: THREE.Mesh) {
    scene.remove(block);
    block.geometry.dispose();
    (block.getObjectByName("edges") as THREE.LineSegments).geometry.dispose();
  }

  function clearPallet() {
    stack.splice(0).forEach(removeSettled);
  }

  /** Poses every moving part for the current `jobTime`. */
  function applyJob(dt: number) {
    const sample = stageAt(jobTime);
    const { stage, progress } = sample;

    if (stage !== lastStage) {
      lastStage = stage;
      events.onStage?.(stage, shipped);
    }
    events.onProgress?.(stage, progress);

    // Belt + rollers
    const speed = beltSpeed(sample);
    belt.texture.offset.x -= dt * BELT_SCROLL * speed;
    belt.rollers.forEach((r) => (r.rotation.y += dt * 4 * speed));

    // Laser: beam sweeps down over the block, then the block turns polished
    const sweep = stage === "laser" ? laserSweep(progress) : 0;
    gate.beam.position.y = BEAM_REST_Y + (BEAM_LOW_Y - BEAM_REST_Y) * sweep;
    gate.beamMaterial.opacity = stage === "laser" ? 0.45 + sweep * 0.5 : 0.25;
    gate.beam.scale.set(1 + sweep * 2, 1 + sweep * 2, 1);
    const pastScanner = stage === "robot" || (stage === "laser" && progress >= LASER_POLISH_AT);
    if (pastScanner && !polished) {
      polished = true;
      active.material = blockMaterials.polished[shipped % blockMaterials.polished.length];
      active.getObjectByName("edges")!.visible = false;
      if (stage === "laser") burst(active.position);
    }

    // Robot arm
    const pose = armPose(sample, jobSlot);
    const joints = solveArm(pose.target);
    robot.turret.rotation.y = pose.target.yaw;
    robot.upper.rotation.x = joints.shoulder;
    robot.fore.rotation.x = joints.elbow;
    robot.wrist.rotation.x = joints.wrist;
    const finger = pose.gripClosed ? FINGER_CLOSED : FINGER_OPEN;
    robot.fingers[0].position.x = -finger;
    robot.fingers[1].position.x = finger;

    // Block: rides the belt, then the gripper, then lands on the pallet
    if (pose.carrying) {
      if (active.parent !== robot.grip) {
        robot.grip.attach(active);
        active.position.set(0, 0, 0);
        active.rotation.set(0, 0, 0);
      }
    } else if (stage === "robot" && progress >= ROBOT_RELEASE_AT) {
      if (!placed) {
        placed = true;
        placeOnPallet();
        scene.attach(active);
        active.visible = false;
      }
    } else {
      active.visible = true;
      if (active.parent !== scene) scene.attach(active);
      blockPos.set(blockBeltX(sample), LAYOUT.beltY + LAYOUT.blockSize / 2, 0);
      active.position.copy(blockPos);
      // a small "pop" right as the block is polished
      const pop = stage === "laser" ? Math.max(0, 1 - Math.abs(progress - LASER_POLISH_AT) * 12) : 0;
      active.scale.setScalar(1 + pop * 0.18);
    }

    // Chain: active station ring glows, links fill as the block moves downstream
    STAGE_ORDER.forEach((id, i) => {
      const current = STAGE_ORDER.indexOf(stage);
      const ring = chain.rings[id];
      ring.opacity = id === stage ? 0.75 + Math.sin(clockTime * 5) * 0.2 : i < current ? 0.45 : 0.18;
    });
    chain.links.forEach((link, i) => {
      const current = STAGE_ORDER.indexOf(stage);
      link.scale.x = i < current ? 1 : i === current ? Math.max(progress, 0.0001) : 0.0001;
    });
    robot.accent.emissiveIntensity = stage === "robot" ? 0.8 : 0.3;
    gate.caps.emissiveIntensity = stage === "laser" ? 2 : 0.8;
    laserLight.intensity = stage === "laser" ? 30 + sweep * 30 : 10;
    robotLight.intensity = stage === "robot" ? 30 : 10;

    // Sparks
    if (sparkLife > 0) {
      sparkLife = Math.max(0, sparkLife - dt * 1.3);
      for (let i = 0; i < SPARKS; i++) {
        sparkVel[i].y -= 3.2 * dt;
        sparkPos[i * 3] += sparkVel[i].x * dt;
        sparkPos[i * 3 + 1] += sparkVel[i].y * dt;
        sparkPos[i * 3 + 2] += sparkVel[i].z * dt;
      }
      sparkGeo.attributes.position.needsUpdate = true;
    }
    sparkMat.opacity = sparkLife;
  }

  // ── Camera focus ────────────────────────────────────────────
  let focusStage: StageId | "overview" = "overview";
  let focusing = true;
  const desiredPos = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();

  function framing(stage: StageId | "overview") {
    const pose = CAMERA_POSES[stage];
    desiredTarget.copy(pose.target);
    desiredPos.copy(pose.position);
    if (camera.aspect < NARROW_ASPECT) {
      const zoom = (NARROW_ASPECT / camera.aspect) * NARROW_ZOOM_BOOST;
      desiredPos.sub(pose.target).multiplyScalar(zoom).add(pose.target);
    }
  }

  function snapCamera() {
    framing(focusStage);
    camera.position.copy(desiredPos);
    controls.target.copy(desiredTarget);
    focusing = false;
  }

  function stepCamera(dt: number) {
    if (!focusing) return;
    framing(focusStage);
    const k = 1 - Math.exp(-FOCUS_EASE * dt);
    camera.position.lerp(desiredPos, k);
    controls.target.lerp(desiredTarget, k);
    if (camera.position.distanceTo(desiredPos) < 0.02) focusing = false;
  }

  // Dragging hands the camera to the user; keep rendering while damping settles.
  const DAMPING_TAIL_MS = 1200;
  let interactUntil = 0;
  let userMoved = false;
  controls.addEventListener("start", () => {
    focusing = false;
    userMoved = true;
    interactUntil = Infinity;
    start();
  });
  controls.addEventListener("end", () => {
    interactUntil = performance.now() + DAMPING_TAIL_MS;
  });

  // ── Loop ────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  let clockTime = 0;
  let paused = reduced;
  let visible = true;
  let pageVisible = !document.hidden;
  let disposed = false;
  let frameId = 0;

  function syncAutoRotate() {
    controls.autoRotate = !paused && !reduced && focusStage === "overview";
  }

  function render() {
    controls.update();
    renderer.render(scene, camera);
  }

  function tick() {
    frameId = 0;
    if (disposed || !visible || !pageVisible) return;
    const dt = Math.min(clock.getDelta(), MAX_DT);
    if (!paused) {
      clockTime += dt;
      const next = jobTime + dt;
      if (next >= JOB_DURATION) {
        shipped += 1;
        jobTime = next - JOB_DURATION;
        lastStage = null;
        startJob();
      } else {
        jobTime = next;
      }
      applyJob(dt);
    }
    stepCamera(dt);
    render();
    // Keep looping while playing, gliding, or easing out a drag; idle paused scenes stop.
    if (!paused || focusing || performance.now() < interactUntil) frameId = requestAnimationFrame(tick);
  }

  function start() {
    if (frameId || disposed) return;
    clock.getDelta(); // drop the time spent stopped
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(container);

  const onVisibility = () => {
    pageVisible = !document.hidden;
    if (pageVisible) start();
    else stop();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (!focusing && focusStage === "overview" && !userMoved) snapCamera();
    render();
  });
  resizeObserver.observe(container);

  // First frame: posed and framed, even when starting paused.
  snapCamera();
  syncAutoRotate();
  applyJob(0);
  render();
  start();

  return {
    setPaused(next) {
      paused = next;
      syncAutoRotate();
      if (!paused) start();
    },
    focus(stage) {
      focusStage = stage ?? "overview";
      userMoved = false;
      syncAutoRotate();
      if (paused && stage) {
        // Still frame of that station's work, so the click still shows something.
        // Undo this job's placement first, or resuming would stack the block twice.
        if (placed) {
          const settled = stack.pop();
          if (settled) removeSettled(settled);
        }
        startJob();
        jobTime = stageMidpoint(stage);
        applyJob(0);
      }
      if (reduced) {
        snapCamera();
        render();
      } else {
        focusing = true;
        start();
      }
    },
    dispose() {
      disposed = true;
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      controls.dispose();
      clearPallet();
      disposeTree(scene);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
