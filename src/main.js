import '@fontsource-variable/inter';
import { createVR } from './vr.js';
import { signIn, startSession, logEvent, endSession } from './db.js';

const $ = (id) => document.getElementById(id);
const video = $('cam');
const student = { nickname: '', className: '' };

// ---- HANDOFF: the VR team starts the simulation from here --------------------
// Called when the student chooses a TP inside the headset: the simulation starts here.
export function startLab(lab, student) {
  console.log('[EduMinds] startLab', lab.code, student);
  startSession(lab);
  // TODO (simulation + vision teams): load the lab `lab.code` here.
}

// Called when the student takes a component from the panel: it must appear in his hand.
// `component` = { ref:'CMP018', name:'LED rouge', price:0.5, ... }, `count` = how many he took so far.
export function takeComponent(lab, component, count) {
  console.log('[EduMinds] takeComponent', component.ref, component.name, count);
  logEvent('component_taken', { componentRef: component.ref });
  // TODO (simulation + vision teams): create the real component in the student's hand.
}

// Called when the student leaves the current TP to choose another one.
export function stopLab(lab) {
  console.log('[EduMinds] stopLab', lab?.code);
  endSession();
  // TODO (simulation team): stop the simulation.
}

// ---- Camera (opened once, kept running behind every screen) -------------------
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } }, audio: false });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    console.warn('Caméra indisponible', err);
    $('cam-msg').classList.remove('hidden');
  }
}

const vr = createVR({ canvas: $('gl'), video, onSelectLab: (lab) => startLab(lab, student),
  onTakeComponent: (lab, component, count) => takeComponent(lab, component, count),
  onChangeLab: (lab) => stopLab(lab) });

function enterVR() {
  $('handoff').classList.add('hidden');
  $('gl').classList.add('on');
  vr.start();
}

let timer;
function startCountdown(seconds) {
  let left = seconds;
  $('count').textContent = left;
  timer = setInterval(() => {
    left -= 1; $('count').textContent = left;
    if (left <= 0) { clearInterval(timer); enterVR(); }
  }, 1000);
}

// Pre-fill nickname if previously saved in this browser
$('nickname').value = localStorage.getItem('edu_nickname') || '';
$('class').value = localStorage.getItem('edu_class') || '';

// Login is done with the phone in the hand (normal keyboard).
$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  student.nickname = $('nickname').value.trim();
  student.className = $('class').value.trim();
  if (!student.nickname) return;
  try {
    localStorage.setItem('edu_nickname', student.nickname);
    if (student.className) localStorage.setItem('edu_class', student.className);
  } catch {}
  signIn(student);   // anonymous account + profile, in the background
  // These need a tap from the user, so they live inside this handler.
  await vr.enableMotion();
  try { await document.documentElement.requestFullscreen(); await screen.orientation.lock('landscape'); } catch {}
  $('login').classList.add('hidden');
  $('handoff').classList.remove('hidden');
  startCountdown(8);
});

$('ready').addEventListener('click', async () => {
  clearInterval(timer);
  try { await document.documentElement.requestFullscreen(); await screen.orientation.lock('landscape'); } catch {}
  enterVR();
});

startCamera();
