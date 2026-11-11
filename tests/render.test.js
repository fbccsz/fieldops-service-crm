import test from 'node:test';
import assert from 'node:assert/strict';

const events = new Map();
const storage = new Map();
const root = { innerHTML: '', addEventListener(type, cb) { events.set(type, cb); } };

globalThis.localStorage = {
  getItem(key) { return storage.get(key) || null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); },
};
globalThis.document = {
  querySelector(selector) { return selector === '#app' ? root : null; },
  querySelectorAll() { return []; },
  getElementById() { return null; },
};
globalThis.window = { addEventListener() {}, scrollTo() {}, print() {} };

await import('../src/app.js');
function clickNav(key) {
  events.get('click')({ target: { closest(selector) {
    return selector === '[data-nav]' ? { dataset: { nav: key } } : null;
  } } });
}

test('renders a complete overview without runtime errors', () => {
  assert.match(root.innerHTML, /Operations at a glance/);
  assert.match(root.innerHTML, /Business performance/);
  assert.match(root.innerHTML, /Pipeline breakdown/);
  assert.match(root.innerHTML, /fictional/i);
});

test('every workspace section can render with demo data', () => {
  for (const [key, marker] of [
    ['pipeline', 'Sales pipeline'],
    ['customers', 'Customer directory'],
    ['quotes', 'Estimates'],
    ['jobs', 'Jobs &amp; scheduling'],
    ['settings', 'Reset demo workspace'],
  ]) {
    clickNav(key);
    assert.ok(root.innerHTML.includes(marker), `${key} page missing ${marker}`);
  }
});

test('dashboard supports opening record dialogs and detail drawers', () => {
  clickNav('customers');
  events.get('click')({ target: { closest(selector) {
    if (selector === '[data-action]') return { dataset: { action: 'new-customer' } };
    return null;
  } } });
  assert.match(root.innerHTML, /Add a customer/);
  assert.match(root.innerHTML, /record-form/);
});
