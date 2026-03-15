/**
 * hero.js — Layer Zero Labs
 *
 * Three.js voxel cube field for the hero section.
 *
 * What it does:
 *   - Spawns 60 colored cubes (matching the brand palette) with
 *     individual rotation velocities and float phases
 *   - Each cube has a wireframe edge overlay for a technical feel
 *   - The entire field responds to mouse parallax — move the mouse
 *     and the cubes shift in 3D space
 *   - Camera also slightly pans toward the mouse position
 *
 * Dependencies:
 *   - Three.js r128 loaded before this script (via CDN in index.html)
 */

(function initHero() {
  'use strict';

  const canvas = document.getElementById('hero-canvas');

  // Bail cleanly if Three.js didn't load or canvas is missing
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('hero.js: Three.js not available or canvas not found.');
    return;
  }

  /* ── Renderer ─────────────────────────────────────────────── */

  const renderer = new THREE.WebGLRenderer({
    canvas:    canvas,
    antialias: true,
    alpha:     true   // transparent background — page bg shows through
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // fully transparent

  /* ── Scene + Camera ───────────────────────────────────────── */

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 0, 24);

  /* ── Resize handler ───────────────────────────────────────── */

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Brand color palette (matches CSS variables) ──────────── */

  const palette = [
    0x00C8FF, // --accent-blue
    0xFF6B00, // --accent-orange
    0x8B4FCC, // --accent-purple
    0xFF3333, // red
    0xFF9900, // amber
    0x3366FF, // royal blue
    0xFF4488, // pink
    0x00FFAA, // mint
    0xFFCC00, // gold
    0x00FF88  // lime
  ];

  /* ── Shared box geometry ──────────────────────────────────── */

  // One geometry instance reused for all cubes (memory efficient)
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  /* ── Spawn cubes ──────────────────────────────────────────── */

  const cubes = [];
  const CUBE_COUNT = 60;
  const SPREAD     = 20; // world-space spread on X/Y
  const Z_SPREAD   = 8;  // depth variation

  for (let i = 0; i < CUBE_COUNT; i++) {
    const color = palette[i % palette.length];

    // Filled face mesh — slightly transparent
    const meshMat = new THREE.MeshBasicMaterial({
      color:       color,
      transparent: true,
      opacity:     0.6 + Math.random() * 0.35
    });

    // Wireframe edges — gives the technical/blueprint layered look
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color:       color,
      transparent: true,
      opacity:     0.35
    });

    const mesh = new THREE.Mesh(boxGeo, meshMat);
    const edge = new THREE.LineSegments(edgeGeo, edgeMat);

    // Random scale
    const scale = 0.25 + Math.random() * 0.85;
    mesh.scale.setScalar(scale);
    edge.scale.setScalar(scale * 1.01); // slightly larger so edges don't z-fight

    // Random starting position
    const basePos = new THREE.Vector3(
      (Math.random() - 0.5) * SPREAD,
      (Math.random() - 0.5) * SPREAD,
      (Math.random() - 0.5) * Z_SPREAD
    );
    mesh.position.copy(basePos);
    edge.position.copy(basePos);

    // Random starting rotation
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    edge.rotation.copy(mesh.rotation);

    // Per-cube rotation velocity
    const rotVel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.007,
      (Math.random() - 0.5) * 0.007,
      (Math.random() - 0.5) * 0.004
    );

    scene.add(mesh);
    scene.add(edge);

    cubes.push({
      mesh,
      edge,
      rotVel,
      basePos:  basePos.clone(),
      phase:    Math.random() * Math.PI * 2,
      floatSpd: 0.3 + Math.random() * 0.25
    });
  }

  /* ── Mouse parallax ───────────────────────────────────────── */

  // Normalized -1 to +1 relative to window center
  let mouseNX = 0;
  let mouseNY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseNX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Animation loop ───────────────────────────────────────── */

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    cubes.forEach(function(c) {
      // Float each cube in a sine/cosine Lissajous path
      // offset by mouse position for parallax
      c.mesh.position.x = c.basePos.x + Math.sin(t * c.floatSpd + c.phase) * 0.9  - mouseNX * 1.8;
      c.mesh.position.y = c.basePos.y + Math.cos(t * c.floatSpd * 0.85 + c.phase) * 0.7 + mouseNY * 1.4;

      // Spin
      c.mesh.rotation.x += c.rotVel.x;
      c.mesh.rotation.y += c.rotVel.y;

      // Sync edge overlay
      c.edge.position.copy(c.mesh.position);
      c.edge.rotation.copy(c.mesh.rotation);
    });

    // Camera gently follows mouse
    camera.position.x =  mouseNX * 0.6;
    camera.position.y = -mouseNY * 0.4;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

})();
