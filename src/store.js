import { isDemoState, todayISO } from './domain.js';
import { seedData } from './data.js';

export const STORAGE_KEY = 'fieldops.demo.v1';
let state = null;
const listeners = new Set();

export function getState() {
  if (state) return state;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isDemoState(parsed)) return state = parsed;
    }
  } catch { /* unavailable or malformed local storage → seed */ }
  state = seedData();
  return state;
}
export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function notify() { for (const callback of listeners) callback(getState()); }
export function transact(callback, activity=null) {
  const next = structuredClone(getState());
  callback(next);
  if (activity) next.activity.unshift({ id:crypto.randomUUID(), type:activity.type||'client', text:activity.text, date:todayISO() });
  next.activity = next.activity.slice(0, 25);
  state = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { /* application remains functional this session */ }
  notify();
}
export function resetState() {
  state = seedData();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
  notify();
}
export function exportState() {
  return JSON.stringify({ ...getState(), exportedAt:new Date().toISOString() }, null, 2);
}
