import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { MemoryEntity, MemoryEntityId, MemorySnapshot } from '../../simulations/memory-lab';

export interface MemorySceneController {
  update: (snapshot: MemorySnapshot, selectedId: MemoryEntityId | null) => void;
  resetCamera: () => void;
  dispose: () => void;
}

function release(object: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  object.traverse((child) => {
    const drawable = child as THREE.Mesh;
    if (drawable.geometry) geometries.add(drawable.geometry);
    const childMaterials = Array.isArray(drawable.material) ? drawable.material : drawable.material ? [drawable.material] : [];
    for (const material of childMaterials) {
      materials.add(material);
      const map = (material as THREE.MeshBasicMaterial).map;
      if (map) textures.add(map);
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

function label(text: string, width: number, color: string, background?: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas text is unavailable');
  context.font = '500 64px ui-monospace, SFMono-Regular, monospace';
  canvas.width = Math.ceil(context.measureText(text).width) + 32;
  canvas.height = 96;
  if (background) { context.fillStyle = background; context.fillRect(0, 0, canvas.width, canvas.height); }
  context.fillStyle = color;
  context.font = '500 64px ui-monospace, SFMono-Regular, monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  const naturalWidth = 0.4 * canvas.width / canvas.height;
  const fittedWidth = Math.min(width, naturalWidth);
  sprite.scale.set(fittedWidth, 0.4 * fittedWidth / naturalWidth, 1);
  sprite.renderOrder = 2;
  return sprite;
}

export function createMemoryScene(container: HTMLElement, onSelect: (id: MemoryEntityId) => void, onUnavailable: () => void): MemorySceneController {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Interactive 3D stack and heap. Drag to orbit, or use arrow keys to rotate and plus or minus to zoom. Use the Inspect buttons below to select memory objects.');
  container.appendChild(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-6, 6, 4, -4, 0.1, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0.8, 0);
  controls.enablePan = false;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.minZoom = 0.65;
  controls.maxZoom = 1.8;
  controls.enableDamping = false;
  const ambient = new THREE.HemisphereLight(0xddefff, 0x334155, 2.5);
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 8, 5);
  scene.add(ambient, light);

  let lightTheme = document.documentElement.dataset.theme === 'light';
  let ground = new THREE.Group();
  let nodes = new Map<MemoryEntityId, THREE.Group>();
  let exiting: THREE.Group[] = [];
  let latest: { snapshot: MemorySnapshot; selectedId: MemoryEntityId | null } | null = null;
  let animation: Array<{ node: THREE.Group; from: THREE.Vector3; to: THREE.Vector3; startScale: number; endScale: number }> = [];
  let animationStarted = 0;
  let frame = 0;
  let disposed = false;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let pointerDown: { x: number; y: number } | null = null;

  const pointerGeometry = new THREE.BufferGeometry();
  pointerGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(33 * 3), 3));
  const pointerMaterial = new THREE.LineBasicMaterial({ color: 0xf4c16c });
  const pointer = new THREE.Line(pointerGeometry, pointerMaterial);
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.3, 0xf4c16c, 0.22, 0.14);
  pointer.frustumCulled = false;
  scene.add(pointer, arrow);

  function box(size: [number, number, number], color: string, opacity = 1) {
    const geometry = new THREE.BoxGeometry(...size);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.08, transparent: opacity < 1, opacity }));
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: lightTheme ? 0x245167 : 0x9dd4e4, transparent: true, opacity: 0.55 }));
    mesh.add(edges);
    return mesh;
  }

  function buildGround() {
    scene.remove(ground);
    release(ground);
    ground = new THREE.Group();
    scene.background = new THREE.Color(lightTheme ? '#edf4f8' : '#101e2b');
    const grid = new THREE.GridHelper(18, 36, lightTheme ? 0xc4d7e3 : 0x304757, lightTheme ? 0xd7e4ed : 0x1c3344);
    grid.position.y = -0.16;
    ground.add(grid);
    for (const [x, text, color] of [[-2.6, 'Stack', '#49c6d1'], [2.6, 'Heap', '#dba35e']] as const) {
      const base = box([4.5, 0.14, 3.1], lightTheme ? '#dae6ee' : '#203547');
      base.position.set(x, -0.04, 0);
      const heading = label(text, 2.7, lightTheme ? '#24465d' : color);
      heading.position.set(x, 0.08, 2);
      ground.add(base, heading);
    }
    scene.add(ground);
    pointerMaterial.color.set(lightTheme ? '#91611d' : '#f4c16c');
    arrow.setColor(lightTheme ? '#91611d' : '#f4c16c');
  }

  function makeEntity(entity: MemoryEntity, selected: boolean) {
    const group = new THREE.Group();
    group.userData.entityId = entity.id;
    const textColor = lightTheme ? '#173d53' : '#ddf7ff';
    if (entity.kind === 'frame') {
      group.add(box([4, 0.16, 2], selected ? '#4bafbd' : lightTheme ? '#9ecbd6' : '#2a6274', 0.7));
      const title = label(entity.label, 2.3, textColor, lightTheme ? '#e8f2f6' : '#132b3a');
      if (entity.id === 'show') title.position.set(1.7, 0.25, -1.7);
      else title.position.set(0, -0.03, 1.13);
      group.add(title);
    } else if (entity.kind === 'allocation') {
      ['S', 'u', 'd', 'i'].forEach((byte, index) => {
        const block = box([0.72, 0.75, 0.85], selected ? '#f4ce82' : '#d4a35f');
        block.position.x = (index - 1.5) * 0.79;
        const glyph = label(byte, 2.1, '#302515');
        glyph.position.set((index - 1.5) * 0.79, 0.28, 0.5);
        group.add(block, glyph);
      });
      const address = label('0xA120 · 4 bytes', 3.6, textColor, lightTheme ? '#e8f2f6' : '#132b3a');
      address.position.set(0, -0.14, 1.05);
      group.add(address);
    } else {
      const moved = entity.kind === 'moved';
      group.add(box([entity.id === 'count' ? 1 : 1.65, 0.65, 0.9], selected ? '#7be0e4' : moved ? '#718595' : '#40b9c4', moved ? 0.2 : 1));
      const title = label(entity.label, 2.5, textColor, lightTheme ? '#e8f2f6' : '#132b3a');
      title.position.set(0, 0.66, 0);
      const value = label(entity.value, entity.id === 'count' ? 0.7 : 1.45, moved ? textColor : '#102e3b');
      value.position.set(0, 0.15, 0.52);
      group.add(title, value);
    }
    return group;
  }

  function updatePointer() {
    const owner = nodes.get('string');
    pointer.visible = arrow.visible = Boolean(owner && latest?.snapshot.owner);
    if (!pointer.visible || !owner) return;
    const from = owner.position.clone().add(new THREE.Vector3(0.87, 0.08, 0));
    const to = new THREE.Vector3(0.98, 0.73, 0);
    const curve = new THREE.CubicBezierCurve3(from, from.clone().add(new THREE.Vector3(1, 0.5, 0)), to.clone().add(new THREE.Vector3(-0.7, 0.4, 0)), to);
    const positions = pointerGeometry.getAttribute('position') as THREE.BufferAttribute;
    curve.getPoints(32).forEach((point, index) => positions.setXYZ(index, point.x, point.y, point.z));
    positions.needsUpdate = true;
    const direction = curve.getTangent(1).normalize();
    arrow.position.copy(to.clone().addScaledVector(direction, -0.2));
    arrow.setDirection(direction);
  }

  function draw(now: number) {
    frame = 0;
    if (disposed) return;
    const t = motion.matches ? 1 : Math.min(1, (now - animationStarted) / 650);
    const eased = 1 - Math.pow(1 - t, 3);
    for (const item of animation) {
      item.node.position.lerpVectors(item.from, item.to, eased);
      item.node.scale.setScalar(THREE.MathUtils.lerp(item.startScale, item.endScale, eased));
    }
    updatePointer();
    renderer.render(scene, camera);
    if (t < 1 && animation.length) requestDraw();
    else if (animation.length) {
      animation = [];
      exiting.forEach((node) => { scene.remove(node); release(node); });
      exiting = [];
    }
  }

  function requestDraw() { if (!frame && !disposed) frame = requestAnimationFrame(draw); }

  function update(snapshot: MemorySnapshot, selectedId: MemoryEntityId | null) {
    const changedStep = latest?.snapshot.step !== snapshot.step;
    latest = { snapshot, selectedId };
    exiting.forEach((node) => { scene.remove(node); release(node); });
    exiting = [];
    animation = [];
    const previousNodes = nodes;
    nodes = new Map();
    for (const entity of snapshot.entities) {
      const node = makeEntity(entity, entity.id === selectedId);
      const previous = previousNodes.get(entity.id);
      const to = new THREE.Vector3(...entity.position);
      const from = previous?.position.clone() ?? to.clone().add(new THREE.Vector3(0, 0.55, 0));
      node.position.copy(changedStep ? from : to);
      node.scale.setScalar(changedStep && !previous ? 0.01 : 1);
      nodes.set(entity.id, node);
      scene.add(node);
      if (changedStep) animation.push({ node, from, to, startScale: previous ? 1 : 0.01, endScale: 1 });
    }
    for (const [id, node] of previousNodes) {
      if (!nodes.has(id) && changedStep) {
        exiting.push(node);
        animation.push({ node, from: node.position.clone(), to: node.position.clone().add(new THREE.Vector3(0, -0.35, 0)), startScale: node.scale.x, endScale: 0.001 });
      } else { scene.remove(node); release(node); }
    }
    animationStarted = performance.now();
    requestDraw();
  }

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    const aspect = width / height;
    const halfHeight = Math.max(3.1, 5.6 / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestDraw();
  }

  function resetCamera() {
    camera.position.set(4, 8, 11);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0.8, 0);
    controls.update();
    requestDraw();
  }

  function handleKey(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') { resetCamera(); return; }
    if (['+', '=', '-'].includes(event.key)) camera.zoom = THREE.MathUtils.clamp(camera.zoom * (event.key === '-' ? 0.9 : 1.1), controls.minZoom, controls.maxZoom);
    else {
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (event.key === 'ArrowLeft') spherical.theta -= 0.15;
      if (event.key === 'ArrowRight') spherical.theta += 0.15;
      if (event.key === 'ArrowUp') spherical.phi -= 0.12;
      if (event.key === 'ArrowDown') spherical.phi += 0.12;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
    }
    camera.updateProjectionMatrix();
    controls.update();
    requestDraw();
  }

  function startPointer(event: PointerEvent) { pointerDown = { x: event.clientX, y: event.clientY }; }
  function selectPointer(event: PointerEvent) {
    if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 6) { pointerDown = null; return; }
    pointerDown = null;
    const bounds = canvas.getBoundingClientRect();
    mouse.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    for (const hit of raycaster.intersectObjects([...nodes.values()], true)) {
      let object: THREE.Object3D | null = hit.object;
      while (object && !object.userData.entityId) object = object.parent;
      if (object?.userData.entityId) { onSelect(object.userData.entityId as MemoryEntityId); break; }
    }
  }

  function contextLost(event: Event) { event.preventDefault(); onUnavailable(); }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const themeObserver = new MutationObserver(() => {
    const nextLight = document.documentElement.dataset.theme === 'light';
    if (nextLight !== lightTheme) {
      lightTheme = nextLight;
      buildGround();
      if (latest) update(latest.snapshot, latest.selectedId);
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  canvas.addEventListener('pointerdown', startPointer);
  canvas.addEventListener('pointerup', selectPointer);
  canvas.addEventListener('keydown', handleKey);
  canvas.addEventListener('webglcontextlost', contextLost);
  controls.addEventListener('change', requestDraw);
  motion.addEventListener('change', requestDraw);
  buildGround();
  resetCamera();
  resize();

  return { update, resetCamera, dispose: () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    themeObserver.disconnect();
    controls.removeEventListener('change', requestDraw);
    controls.dispose();
    motion.removeEventListener('change', requestDraw);
    canvas.removeEventListener('pointerdown', startPointer);
    canvas.removeEventListener('pointerup', selectPointer);
    canvas.removeEventListener('keydown', handleKey);
    canvas.removeEventListener('webglcontextlost', contextLost);
    release(scene);
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  } };
}
