import * as THREE from 'three';
import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect.js';
import { LABS } from './labs.js';
import { componentsForLab } from './data/components.js';

const DWELL_MS = 1500;   // look at a button this long to select it
const PX = 300;          // canvas pixels per world unit (text sharpness)
const ACCENT = '#f36f21', SELECT = '#8cbcd8';   // colors taken from the ENET’Com logos
const FONT = '"Inter Variable", system-ui, sans-serif';
const font = (weight, px) => `${weight} ${px}px ${FONT}`;
const VISIBLE = 3, PITCH = 0.86;   // the component strip shows 3 tiles at a time

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
  let line = '', lines = [];
  for (const word of text.split(' ')) {
    const t = line ? line + ' ' + word : word;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = word; } else line = t;
  }
  lines.push(line);
  lines.slice(0, maxLines).forEach((l, i) =>
    ctx.fillText(i === maxLines - 1 && lines.length > maxLines ? l + '…' : l, x, y + i * lineH));
}

// Frosted-glass look drawn on a canvas, used as the texture of a floating panel.
function drawGlass(ctx, w, h, o) {
  ctx.save(); ctx.globalAlpha = o.dim ? 0.35 : 1;
  paint(ctx, w, h, o);
  ctx.restore();
}
function paint(ctx, w, h, o) {
  const { title, sub, ref, img, progress = 0, hot = false, selected = false, tile = false, arrow, count = 0 } = o;
  const pad = arrow ? 20 : tile ? 24 : 50;
  ctx.clearRect(0, 0, w, h);
  roundRectPath(ctx, 6, 6, w - 12, h - 12, tile || arrow ? 28 : 44);
  ctx.fillStyle = 'rgba(8,24,60,0.26)'; ctx.fill();
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, hot ? 'rgba(255,255,255,0.34)' : selected ? 'rgba(130,190,255,0.30)' : 'rgba(255,255,255,0.16)');
  g.addColorStop(1, 'rgba(255,255,255,0.06)');
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = selected ? 3 : 1.5; ctx.strokeStyle = selected ? SELECT : 'rgba(255,255,255,0.4)'; ctx.stroke();
  if (progress > 0) { ctx.fillStyle = ACCENT; ctx.fillRect(pad, h - pad * 0.6, (w - pad * 2) * progress, 5); }

  if (arrow) {   // chevron button of the horizontal strip
    const cx = w / 2, cy = h / 2, d = arrow === 'left' ? 1 : -1;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(cx + 10 * d, cy - 28); ctx.lineTo(cx - 10 * d, cy); ctx.lineTo(cx + 10 * d, cy + 28); ctx.stroke();
    return;
  }
  if (tile) {   // component tile: photo (or placeholder) + name + tick when selected
    const s = h * 0.5, x = (w - s) / 2, y = 22, f = Math.round(w * 0.075);
    roundRectPath(ctx, x, y, s, s, 18);
    if (img) { ctx.save(); ctx.clip(); ctx.drawImage(img, x, y, s, s); ctx.restore(); }
    else { ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fill(); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = font(400, f);
    if (!img) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(ref, w / 2, y + s / 2); }
    ctx.fillStyle = '#fff';
    wrapText(ctx, title, w / 2, y + s + f * 1.3, w - 28, f * 1.2, 2);
    if (count > 0) {   // how many times this component was taken
      ctx.fillStyle = SELECT; ctx.beginPath(); ctx.arc(w - 38, 38, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0b1b3a'; ctx.font = font(500, 22); ctx.fillText('×' + count, w - 38, 39);
    }
    ctx.textAlign = 'left';
    return;
  }
  const tp = Math.min(h * (sub ? 0.26 : 0.3), 44), sp = tp * 0.66;   // lighter, smaller text
  const cx = o.center ? w / 2 : 50;
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = o.center ? 'center' : 'left';
  ctx.font = font(300, tp);
  ctx.fillText(title, cx, sub ? h * 0.36 : h / 2);
  if (sub) { ctx.font = font(300, sp); ctx.fillStyle = 'rgba(255,255,255,0.78)'; ctx.fillText(sub, cx, h * 0.66); }
}

function makePanel(wu, hu, content, data = {}, px = PX) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(wu * px); canvas.height = Math.round(hu * px);
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(wu, hu),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  mesh.userData = { ctx, tex, w: canvas.width, h: canvas.height, content, ...data };
  redraw(mesh, 0, false);
  return mesh;
}
function redraw(mesh, progress, hot) {
  const d = mesh.userData;
  drawGlass(d.ctx, d.w, d.h, { ...d.content, progress, hot });
  d.tex.needsUpdate = true;
}
function disposePanel(mesh) { mesh.geometry.dispose(); mesh.material.map.dispose(); mesh.material.dispose(); }

export function createVR({ canvas, video, onSelectLab, onTakeComponent, onChangeLab }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const effect = new StereoEffect(renderer);   // draws the scene twice, one half per eye

  const scene = new THREE.Scene();
  scene.background = new THREE.VideoTexture(video);   // the camera image behind everything
  scene.background.colorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 50);
  scene.add(camera);

  // Small ring in the middle of the view = where the student is looking
  const reticle = new THREE.Mesh(new THREE.RingGeometry(0.018, 0.03, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true, opacity: 0.9 }));
  reticle.position.z = -1.5; reticle.renderOrder = 10; camera.add(reticle);

  // `world` holds all panels; rotating it puts them in front of the student at start
  const world = new THREE.Group(); scene.add(world);
  const listGroup = new THREE.Group(), compGroup = new THREE.Group();
  world.add(listGroup, compGroup);

  // Stage 1: choose the TP
  const title = makePanel(2.4, 0.45, { title: 'Choisis ton TP' });
  title.position.set(0, 0.95, -2.5); listGroup.add(title);
  const labButtons = LABS.map((lab, i) => {
    const b = makePanel(2.4, 0.55, { title: lab.title, sub: lab.sub }, { lab, action: 'select' });
    b.position.set(0, 0.35 - i * 0.65, -2.5); listGroup.add(b); return b;
  });

  // Stage 2: the component toolbox, a horizontal strip (3 tiles visible, swipe to scroll).
  // It stays open while the simulation runs; looking at a tile "takes" that component.
  const compTitle = makePanel(3.0, 0.5, { title: 'Tes composants', sub: '' });
  compTitle.position.set(0, 0.8, -2.5);
  const changeLab = makePanel(0.9, 0.28, { title: 'Changer de TP', center: true }, { action: 'back', dwell: 2000 });
  changeLab.position.set(1.1, 1.3, -2.5);   // small, in the top-right corner, longer look needed (no accidental exit)
  compGroup.add(compTitle, changeLab);
  let tiles = [], currentLab = null, offset = 0, target = 0;

  let hovered = null, hoverStart = 0, locked = null, lockedAny = false;
  function show(group) {
    listGroup.visible = group === listGroup; compGroup.visible = group === compGroup;
    hovered = null; lockedAny = true;   // gaze must leave the buttons before a new dwell starts
  }
  const interactive = () => listGroup.visible ? labButtons : [...tiles.filter((t) => t.visible), changeLab];

  function loadPhoto(mesh, c) {   // photo file: public/components/<ref>.jpg
    const img = new Image();
    img.onload = () => { mesh.userData.content.img = img; redraw(mesh, 0, false); };
    img.src = `${import.meta.env.BASE_URL}components/${c.ref}.jpg`;
  }
  // Slides the strip smoothly: tiles move with `offset` and fade out at the edges
  function animateRow() {
    if (!compGroup.visible) return;
    offset += (target - offset) * 0.18;
    if (Math.abs(target - offset) < 0.001) offset = target;
    tiles.forEach((t, i) => {
      const x = i - offset - (VISIBLE - 1) / 2;   // distance from the center, in tiles
      t.position.x = x * PITCH;
      const fade = THREE.MathUtils.clamp((1.75 - Math.abs(x)) / 0.75, 0, 1);
      t.material.opacity = fade; t.visible = fade > 0.02;
    });
  }
  function scrollBy(dir) {
    const max = Math.max(0, tiles.length - VISIBLE);
    target = THREE.MathUtils.clamp(target + dir, 0, max);
    const from = target + 1;
    compTitle.userData.content.sub = `${currentLab.title} · ${from}–${Math.min(from + VISIBLE - 1, tiles.length)} / ${tiles.length}`;
    redraw(compTitle, 0, false);
  }
  function swipe(dir) { if (compGroup.visible) scrollBy(dir * VISIBLE); }   // one swipe = one page of 3 tiles
  function openComponents(lab) {
    currentLab = lab; offset = target = 0;
    tiles.forEach((t) => { compGroup.remove(t); disposePanel(t); }); tiles = [];
    componentsForLab(lab.id).forEach((c) => {
      const m = makePanel(0.8, 0.72, { title: c.name, ref: c.ref, tile: true, count: 0 }, { action: 'take', comp: c }, 420);
      m.position.set(0, 0.1, -2.5);
      compGroup.add(m); tiles.push(m);
      if (c.photo) loadPhoto(m, c);
    });
    scrollBy(0); show(compGroup); animateRow();
  }
  function activate(mesh) {
    const d = mesh.userData;
    if (d.action === 'select') { openComponents(d.lab); onSelectLab?.(d.lab); }   // the simulation starts
    else if (d.action === 'take') {   // the student takes one more of this component
      d.content.count = (d.content.count || 0) + 1; redraw(mesh, 0, false);
      onTakeComponent?.(currentLab, d.comp, d.content.count);
    } else { show(listGroup); onChangeLab?.(currentLab); }   // 'back'
  }

  // ---- Looking around: phone gyroscope, or mouse drag on a laptop ---------------
  let hasMotion = false, yaw = 0, pitch = 0;
  const zee = new THREE.Vector3(0, 0, 1), q1 = new THREE.Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2);
  const euler = new THREE.Euler(), q0 = new THREE.Quaternion();
  function onOrient(e) {
    if (e.alpha == null) return;
    hasMotion = true;
    const r = THREE.MathUtils.degToRad, orient = r(screen.orientation?.angle ?? window.orientation ?? 0);
    euler.set(r(e.beta), r(e.alpha), -r(e.gamma), 'YXZ');
    camera.quaternion.setFromEuler(euler).multiply(q1).multiply(q0.setFromAxisAngle(zee, -orient));
  }
  async function enableMotion() {
    const D = window.DeviceOrientationEvent;
    if (D && typeof D.requestPermission === 'function') { try { await D.requestPermission(); } catch {} } // iPhone asks permission
    window.addEventListener('deviceorientation', onOrient);
  }
  let dragging = false;
  canvas.addEventListener('pointerdown', () => { dragging = true; });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointermove', (e) => {
    if (!dragging || hasMotion) return;
    yaw -= e.movementX * 0.005; pitch = THREE.MathUtils.clamp(pitch - e.movementY * 0.005, -1.2, 1.2);
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
  });
  // ---- Swiping the strip: finger swipe on the phone, trackpad / mouse wheel / arrow keys on a laptop.
  // Later, hand tracking can simply call swipe(1) or swipe(-1) (see the returned object below).
  let swipeX = null, wheelAcc = 0;
  canvas.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') swipeX = e.clientX; });
  window.addEventListener('pointerup', (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX; swipeX = null;
    if (Math.abs(dx) > 50) swipe(dx < 0 ? 1 : -1);   // swipe left = next tiles
    else if (Math.abs(dx) < 10) recenter();           // tap screen = re-center panels in front of student
  });
  window.addEventListener('wheel', (e) => {
    wheelAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(wheelAcc) > 60) { swipe(wheelAcc > 0 ? 1 : -1); wheelAcc = 0; }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') swipe(1);
    if (e.key === 'ArrowLeft') swipe(-1);
    if (e.key === ' ' || e.key.toLowerCase() === 'c') recenter();
  });
  function recenter() { world.rotation.y = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ').y; }

  // ---- Gaze selection: look at a button for DWELL_MS --------------------------
  const ray = new THREE.Raycaster(), center = new THREE.Vector2(0, 0);
  function updateGaze(now) {
    camera.updateMatrixWorld();
    ray.setFromCamera(center, camera);
    const raw = ray.intersectObjects(interactive(), false)[0]?.object ?? null;
    if (lockedAny) { if (raw) return; lockedAny = false; }   // wait until the gaze leaves
    if (raw !== locked) locked = null;                        // a toggled tile re-arms after the gaze leaves it
    const hit = raw === locked ? null : raw;
    if (hit !== hovered) { if (hovered) redraw(hovered, 0, false); hovered = hit; hoverStart = now; }
    if (!hovered) return;
    const p = Math.min((now - hoverStart) / (hovered.userData.dwell ?? DWELL_MS), 1);
    redraw(hovered, p, true);
    if (p >= 1) {
      const m = hovered;
      if (m.userData.repeat) { hoverStart = now; redraw(m, 0, true); activate(m); }   // arrows keep scrolling while looked at
      else { hovered = null; locked = m; redraw(m, 0, false); activate(m); }
    }
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    effect.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  return {
    enableMotion,
    swipe,   // hand tracking can call swipe(1) / swipe(-1)
    recenter,
    start() {
      resize(); show(listGroup);
      setTimeout(recenter, 700);   // wait for the first gyroscope reading
      renderer.setAnimationLoop((now) => { updateGaze(now); animateRow(); effect.render(scene, camera); });
    },
  };
}
