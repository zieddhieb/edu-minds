// Sends what the student does to Supabase.
// It never blocks the app: events go into a queue (kept in localStorage), are sent in order,
// and are retried later if the network fails.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;   // no keys in .env = the app works, nothing is sent
const QUEUE_KEY = 'edu_queue';

// crypto.randomUUID() requires HTTPS on mobile devices; provide a safe fallback for local HTTP testing
const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }));

let userId = null, current = null, ready = Promise.resolve(), sending = false, queue = [];
try { queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch {}
const save = () => { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); } catch {} };

function enqueue(table, row, update = false) { queue.push({ table, row, update }); save(); flush(); }

async function flush() {
  if (!supabase || !userId || sending) return;
  sending = true;
  try {
    while (queue.length) {
      const { table, row, update } = queue[0];
      // upsert on the id we created: retrying the same row never makes a duplicate
      const { error } = await supabase.from(table).upsert(row, { onConflict: 'id', ignoreDuplicates: !update });
      if (error && !error.code) break;   // network problem: keep the queue and retry later
      if (error) console.error('[EduMinds] row rejected by the database', table, error.message);
      queue.shift(); save();
    }
  } finally {
    sending = false;
  }
}
setInterval(flush, 15000);
window.addEventListener('online', flush);

// Anonymous account (no password) + the student's profile row
export function signIn({ nickname, className }) {
  if (!supabase) return;
  ready = (async () => {
    try {
      let session = (await supabase.auth.getSession()).data.session;
      if (!session) session = (await supabase.auth.signInAnonymously()).data.session;
      if (!session) throw new Error('No session: are anonymous sign-ins enabled in Supabase?');
      userId = session.user.id;
      const { error } = await supabase.from('students').upsert({ id: userId, nickname, class_name: className || null });
      if (error) throw error;
      flush();
    } catch (err) { console.warn('[EduMinds] sign-in failed', err); }
  })();
}

export async function startSession(lab) {
  await ready;
  if (!supabase || !userId) return;
  current = { id: uuid(), student_id: userId, lab_id: lab.id,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'phone' : 'laptop', started_at: new Date().toISOString() };
  enqueue('sessions', current);
  logEvent('lab_started');
}

// types: 'lab_started' | 'component_taken' | 'failure_caused' | 'hint_used' | 'lab_ended'
// The simulation team calls, for example: logEvent('failure_caused', { failureCode: 'led_overcurrent' })
export function logEvent(type, { componentRef = null, failureCode = null, payload = {} } = {}) {
  if (!current) return;
  enqueue('events', { id: uuid(), session_id: current.id, event_type: type,
    component_ref: componentRef, failure_code: failureCode, payload, occurred_at: new Date().toISOString() });
}

export function endSession() {
  if (!current) return;
  logEvent('lab_ended');
  enqueue('sessions', { ...current, ended_at: new Date().toISOString() }, true);
  current = null;
}
window.addEventListener('pagehide', endSession);
