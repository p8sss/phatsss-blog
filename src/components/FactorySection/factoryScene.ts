import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

type FactoryHandle = { dispose: () => void };

const CYCLE = 9; // seconds for one full robot pick-and-place loop
const GATE_X = 0;
const BELT_HALF = 5.5;
const BELT_Y = 0.55;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
  for (let x = 0; x < size; x += 16) {
    ctx.fillRect(x, 0, 8, size);
  }
  ctx.strokeStyle = "#31405f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.5);
  ctx.lineTo(size, size * 0.5);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 1);
  return texture;
}

export function buildFactoryScene(
  container: HTMLDivElement,
  options: { reducedMotion?: boolean } = {},
): FactoryHandle {
  const reduced = options.reducedMotion ?? false;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e1c);
  scene.fog = new THREE.Fog(0x0a0e1c, 22, 38);

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    80,
  );
  camera.position.set(11, 9.5, 13);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.minDistance = 6;
  controls.maxDistance = 24;
  controls.maxPolarAngle = Math.PI * 0.46;
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = 0.6;
  controls.target.set(0, 1, 0);

  // ── Lighting ────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0x3b4a77, 0.9);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff2e0, 2.2);
  keyLight.position.set(8, 12, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8fb3ff, 0.7);
  fillLight.position.set(-6, 5, -8);
  scene.add(fillLight);

  const cyanPoint = new THREE.PointLight(0x22d3ee, 40, 18, 2);
  cyanPoint.position.set(GATE_X, 2.4, 0);
  scene.add(cyanPoint);

  const purplePoint = new THREE.PointLight(0xa78bfa, 40, 18, 2);
  purplePoint.position.set(-4.5, 2.8, -0.5);
  scene.add(purplePoint);

  // ── Floor ──────────────────────────────────────────────────
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(16, 48),
    new THREE.MeshStandardMaterial({
      color: 0x0d1426,
      roughness: 0.85,
      metalness: 0.1,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  const grid = new THREE.GridHelper(34, 34, 0x2a3a63, 0x1a2640);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.55;
  grid.position.y = 0.01;
  scene.add(grid);

  // ── Conveyor belt ──────────────────────────────────────────
  const beltGroup = new THREE.Group();
  const beltFrame = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.28, 3.4),
    new THREE.MeshStandardMaterial({
      color: 0x141c30,
      roughness: 0.6,
      metalness: 0.5,
    }),
  );
  beltFrame.position.set(0, 0.24, 0);
  beltGroup.add(beltFrame);

  const beltTop = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 3.1),
    new THREE.MeshStandardMaterial({
      map: createBeltTexture(),
      roughness: 0.9,
      color: 0x9aa7c2,
    }),
  );
  beltTop.rotation.x = -Math.PI / 2;
  beltTop.position.set(0, BELT_Y, 0);
  beltGroup.add(beltTop);

  const rollerGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.4, 16);
  const rollerMat = new THREE.MeshStandardMaterial({
    color: 0x2c3a5c,
    roughness: 0.4,
    metalness: 0.8,
  });
  for (let x = -5.5; x <= 5.5; x += 1.1) {
    const roller = new THREE.Mesh(rollerGeo, rollerMat);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(x, 0.38, 0);
    beltGroup.add(roller);
  }
  beltGroup.position.y = 0;
  scene.add(beltGroup);

  const beltTexture = (beltTop.material as THREE.MeshStandardMaterial)
    .map as THREE.CanvasTexture;

  // ── Conveyor items ─────────────────────────────────────────
  const ITEM_COUNT = 9;
  const itemGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const itemMats = [
    new THREE.MeshStandardMaterial({ color: 0x818cf8, roughness: 0.35, metalness: 0.3, emissive: 0x4338ca, emissiveIntensity: 0.25 }),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.35, metalness: 0.3, emissive: 0x0891b2, emissiveIntensity: 0.25 }),
    new THREE.MeshStandardMaterial({ color: 0xe879f9, roughness: 0.35, metalness: 0.3, emissive: 0xa21caf, emissiveIntensity: 0.25 }),
  ];
  const items: THREE.Mesh[] = [];
  for (let i = 0; i < ITEM_COUNT; i++) {
    const item = new THREE.Mesh(itemGeo, itemMats[i % itemMats.length]);
    item.position.set(BELT_HALF - i * (12 / ITEM_COUNT), BELT_Y + 0.26, 0);
    item.rotation.y = (i * Math.PI) / 5;
    beltGroup.add(item);
    items.push(item);
  }

  // ── Laser gate ─────────────────────────────────────────────
  const gateGroup = new THREE.Group();
  const postMat = new THREE.MeshStandardMaterial({
    color: 0x1c2740,
    roughness: 0.4,
    metalness: 0.7,
  });
  for (const z of [-1.7, 1.7]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.7, 0.16), postMat);
    post.position.set(GATE_X, 0.85, z);
    gateGroup.add(post);
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x22d3ee,
        emissiveIntensity: 1.6,
      }),
    );
    cap.position.set(GATE_X, 1.72, z);
    gateGroup.add(cap);
  }
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.09, 3.3),
    new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  beam.position.set(GATE_X, BELT_Y + 0.75, 0);
  gateGroup.add(beam);
  scene.add(gateGroup);

  // ── Particles (laser pulse) ────────────────────────────────
  const PARTICLE_COUNT = 48;
  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  const particleVelocities: THREE.Vector3[] = [];
  const particleLifetimes = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particleVelocities.push(new THREE.Vector3());
    particleLifetimes[i] = 0;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );
  const particleMat = new THREE.PointsMaterial({
    color: 0x7dd3fc,
    size: 0.09,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  particles.visible = false;
  scene.add(particles);

  function triggerPulse() {
    particles.visible = true;
    particleMat.opacity = 0.95;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions[i * 3] = GATE_X + (Math.random() - 0.5) * 0.1;
      particlePositions[i * 3 + 1] = BELT_Y + 0.75;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
      particleVelocities[i].set(
        (Math.random() - 0.5) * 3,
        1.6 + Math.random() * 2.4,
        (Math.random() - 0.5) * 2.5,
      );
      particleLifetimes[i] = 1;
    }
    particleGeo.attributes.position.needsUpdate = true;
  }

  // ── Ambient floating dust ──────────────────────────────────
  const DUST_COUNT = 90;
  const dustPositions = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 18;
    dustPositions[i * 3 + 1] = Math.random() * 5;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0x7d8db8,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ── Robot arm ──────────────────────────────────────────────
  const robot = new THREE.Group();
  robot.position.set(-4.6, 0, 0);

  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x2a3a63,
    roughness: 0.4,
    metalness: 0.7,
  });
  const armMat = new THREE.MeshStandardMaterial({
    color: 0x3b4a77,
    roughness: 0.45,
    metalness: 0.6,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.4,
    roughness: 0.35,
    metalness: 0.4,
  });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 0.5, 24), baseMat);
  base.position.y = 0.25;
  robot.add(base);

  const turret = new THREE.Group();
  turret.position.y = 0.5;
  robot.add(turret);

  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.4, 20), accentMat);
  shoulder.position.y = 0.2;
  turret.add(shoulder);

  const upperArmGroup = new THREE.Group();
  upperArmGroup.position.set(0, 0.4, 0);
  turret.add(upperArmGroup);

  const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.2, 0.22), armMat);
  upperArm.position.y = 0.6;
  upperArmGroup.add(upperArm);

  const elbow = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 16), accentMat);
  elbow.position.y = 1.2;
  upperArmGroup.add(elbow);

  const foreArmGroup = new THREE.Group();
  foreArmGroup.position.set(0, 1.2, 0);
  upperArmGroup.add(foreArmGroup);

  const foreArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.05, 0.18), armMat);
  foreArm.position.y = 0.52;
  foreArmGroup.add(foreArm);

  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.24, 16), accentMat);
  wrist.position.y = 1.05;
  foreArmGroup.add(wrist);

  const gripper = new THREE.Group();
  gripper.position.y = 1.12;
  foreArmGroup.add(gripper);

  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    emissive: 0x22d3ee,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.4,
  });
  const gripA = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.2), gripMat);
  gripA.position.set(-0.09, 0.15, 0);
  const gripB = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.2), gripMat);
  gripB.position.set(0.09, 0.15, 0);
  gripper.add(gripA, gripB);

  scene.add(robot);

  // Keyframe timeline: [t, turretYaw, shoulderPitch, elbowPitch, gripOpen]
  // Angles in radians; gripper open = spread (positive), closed = 0.
  const KEYFRAMES: [number, number, number, number, number][] = [
    [0.0, -0.35, -0.2, 0.5, 0.09],
    [0.18, -0.35, -0.25, 0.55, 0.09],
    [0.3, -0.55, 0.35, 0.9, 0.09],
    [0.42, -0.55, 0.75, 1.15, 0.09],
    [0.52, -0.55, 0.75, 1.15, 0.0],
    [0.64, -0.55, 0.35, 0.9, 0.0],
    [0.78, 0.85, 0.2, 0.7, 0.0],
    [0.9, 0.85, 0.6, 1.1, 0.0],
    [0.98, 0.85, 0.6, 1.1, 0.09],
    [1.0, -0.35, -0.2, 0.5, 0.09],
  ];

  function sampleKeyframes(phase: number) {
    let a = KEYFRAMES[0];
    let b = KEYFRAMES[KEYFRAMES.length - 1];
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (phase >= KEYFRAMES[i][0] && phase <= KEYFRAMES[i + 1][0]) {
        a = KEYFRAMES[i];
        b = KEYFRAMES[i + 1];
        break;
      }
    }
    const span = Math.max(b[0] - a[0], 1e-6);
    const t = easeInOutCubic(Math.min(Math.max((phase - a[0]) / span, 0), 1));
    return [
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
      a[3] + (b[3] - a[3]) * t,
      a[4] + (b[4] - a[4]) * t,
    ];
  }

  // ── Animation loop ─────────────────────────────────────────
  const clock = new THREE.Clock();
  let frame = 0;
  let disposed = false;
  let running = !reduced;

  function animate() {
    if (disposed) return;
    if (!running) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    frame += 1;

    // Belt texture scroll
    beltTexture.offset.x -= dt * 0.22;

    // Move items; recycle at edges; trigger laser pulse
    let beamPulse = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.position.x -= dt * 1.15;
      item.rotation.y += dt * 0.6;
      if (item.position.x < -BELT_HALF) {
        item.position.x = BELT_HALF;
      }
      if (!item.userData.passed && item.position.x < GATE_X) {
        item.userData.passed = true;
        triggerPulse();
      }
      if (item.position.x >= GATE_X) {
        item.userData.passed = false;
      }
    }

    // Laser beam pulse
    beamPulse = 1.6 + Math.sin(time * 6) * 0.7;
    (beam.material as THREE.MeshBasicMaterial).opacity =
      0.55 + Math.abs(Math.sin(time * 6)) * 0.35;

    // Particles update
    if (particles.visible) {
      let anyAlive = false;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (particleLifetimes[i] <= 0) {
          particlePositions[i * 3 + 1] = -5;
          continue;
        }
        anyAlive = true;
        particleLifetimes[i] -= dt * 1.4;
        particlePositions[i * 3] += particleVelocities[i].x * dt;
        particlePositions[i * 3 + 1] += particleVelocities[i].y * dt;
        particlePositions[i * 3 + 2] += particleVelocities[i].z * dt;
        particleVelocities[i].y -= 3.2 * dt;
        particleVelocities[i].x *= 0.99;
        particleVelocities[i].z *= 0.99;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleMat.opacity = Math.max(
        particles.visible ? 0 : 0,
        Math.min(...Array.from(particleLifetimes)) * 0.95,
      );
      if (!anyAlive) {
        particles.visible = false;
        particleMat.opacity = 0;
      }
    }

    // Robot arm keyframe animation
    const phase = (time % CYCLE) / CYCLE;
    const [yaw, shoulderPitch, elbowPitch, gripOpen] = sampleKeyframes(phase);
    turret.rotation.y = yaw;
    upperArmGroup.rotation.x = shoulderPitch;
    foreArmGroup.rotation.x = elbowPitch;
    gripA.position.x = -0.09 - gripOpen;
    gripB.position.x = 0.09 + gripOpen;

    // Neon light flicker
    cyanPoint.intensity = 34 + Math.sin(time * 3.1) * 8;
    purplePoint.intensity = 34 + Math.sin(time * 2.3 + 1) * 8;

    // Dust drift
    const dustAttr = dustGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < DUST_COUNT; i++) {
      dustAttr.array[i * 3] += Math.sin(time * 0.4 + i) * 0.0015;
      dustAttr.array[i * 3 + 1] += 0.002;
      if (dustAttr.array[i * 3 + 1] > 5) dustAttr.array[i * 3 + 1] = 0;
    }
    dustAttr.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  const handleVisibility = () => {
    if (document.hidden) {
      running = false;
      clock.stop();
    } else if (!running) {
      running = !reduced;
      clock.start();
      if (running) {
        requestAnimationFrame(animate);
      }
    }
  };
  document.addEventListener("visibilitychange", handleVisibility);

  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  if (running) {
    requestAnimationFrame(animate);
  } else {
    // render a single static frame for reduced-motion users
    renderer.render(scene, camera);
  }

  return {
    dispose() {
      disposed = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();
      controls.dispose();
      [itemGeo, particleGeo, dustGeo, floor.geometry, grid.geometry, beltFrame.geometry, beltTop.geometry, rollerGeo]
        .forEach((g) => g.dispose());
      itemMats.forEach((m) => m.dispose());
      beltTexture.dispose();
      particleMat.dispose();
      dustMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
