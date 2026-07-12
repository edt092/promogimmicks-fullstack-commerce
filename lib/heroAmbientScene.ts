// Ambient WebGL depth layer for the homepage hero (Section 1 — Z1 "plano visual lejano").
// Renders a small group of soft glow planes that drift with the pointer and retreat on scroll.
// Intentionally decorative only: aria-hidden host canvas, torn down on unmount, and never the
// primary visual (real <img> plates in the DOM carry the actual product imagery/LCP/a11y).
import * as THREE from 'three';

function makeGlowTexture(hexColor: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, hexColor);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface SetupOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
}

export function setupHeroAmbientScene({ canvas, container }: SetupOptions) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const group = new THREE.Group();
  scene.add(group);

  const glowSpecs = [
    { color: 'rgba(21,101,255,0.55)', x: -1.6, y: 0.6, z: -1.2, scale: 2.6 },
    { color: 'rgba(0,191,255,0.5)', x: 1.8, y: -0.4, z: -0.6, scale: 2.1 },
    { color: 'rgba(255,45,45,0.28)', x: 0.4, y: 1.1, z: -1.6, scale: 1.6 },
    { color: 'rgba(21,101,255,0.35)', x: -0.6, y: -1.2, z: -0.9, scale: 1.9 },
  ];

  glowSpecs.forEach((spec) => {
    const texture = makeGlowTexture(spec.color);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(spec.x, spec.y, spec.z);
    sprite.scale.set(spec.scale, spec.scale, 1);
    group.add(sprite);
  });

  let width = 0;
  let height = 0;
  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
  const onPointerMove = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerTarget.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointerMove);

  let scrollProgress = 0;
  let rafId = 0;
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsed = clock.getElapsedTime();
    pointer.x += (pointerTarget.x - pointer.x) * 0.03;
    pointer.y += (pointerTarget.y - pointer.y) * 0.03;

    // Deriva lenta y orgánica de cada haz de luz, independiente del puntero.
    group.children.forEach((child, i) => {
      const sprite = child as THREE.Sprite;
      const spec = glowSpecs[i];
      sprite.position.x = spec.x + Math.sin(elapsed * 0.055 + i * 1.7) * 0.16;
      sprite.position.y = spec.y + Math.cos(elapsed * 0.045 + i * 2.3) * 0.12;
    });

    group.rotation.y = pointer.x * 0.018 + Math.sin(elapsed * 0.08) * 0.012;
    group.rotation.x = -pointer.y * 0.012;
    group.position.x = pointer.x * 0.1;
    group.position.y = -pointer.y * 0.07;

    camera.position.z = 5 - scrollProgress * 0.2;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  return {
    setScrollProgress(value: number) {
      scrollProgress = value;
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      glowSpecs.forEach((_, i) => {
        const sprite = group.children[i] as THREE.Sprite;
        sprite.material.map?.dispose();
        sprite.material.dispose();
      });
      renderer.dispose();
    },
  };
}
