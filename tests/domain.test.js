import test from 'node:test';
import assert from 'node:assert/strict';
import {
  currency, escapeHTML, quoteTotals, createCustomer, createDeal, createQuote, createJob,
  getMetrics, STAGES, isDemoState, addDays, isValidDealStage
} from '../src/domain.js';
import { seedData } from '../src/data.js';

test('financial math uses integer cents and clamps invalid rates', () => {
  const v = quoteTotals([{ quantity: 2, unitCents: 12950 }, { quantity: 1, unitCents: 99 }], 8.5);
  assert.deepEqual(v, { subtotal: 25999, tax: 2210, total: 28209 });
  assert.equal(currency(v.total), '$282');
  assert.equal(quoteTotals([{ quantity: -4, unitCents: -2 }], 200).total, 0);
});

test('HTML content is escaped to avoid unsafe content injection', () => {
  assert.equal(escapeHTML('<img src="x" onerror=\'alert(1)\'>'), '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;');
});

test('customer data requires a real format email and a name', () => {
  assert.throws(() => createCustomer({ name: 'J', email: 'invalid' }, 'id-1'));
  assert.throws(() => createCustomer({ name: 'Jordan Doe', email: 'invalid' }, 'id-1'));
  const c = createCustomer({ name: 'Jordan Doe', email: 'jordan@example.com' }, 'id-1');
  assert.equal(c.avatar, 'JD');
  assert.equal(c.id, 'id-1');
});

test('deals validate values and pipeline stage allowlist', () => {
  assert.throws(() => createDeal({ title: 'Project', customerId: 'c1', valueDollars: -2 }, 'd'));
  const d = createDeal({ title: 'Project', customerId: 'c1', valueDollars: 1200.45 }, 'd');
  assert.equal(d.valueCents, 120045);
  assert.equal(d.stage, 'new');
  assert.equal(isValidDealStage('won'), true);
  assert.equal(isValidDealStage('admin'), false);
  assert.equal(STAGES.length, 4);
});

test('quote builder rejects invalid line item values', () => {
  const base = { customerId: 'c1', title: 'Repair service', taxPercent: 8 };
  assert.throws(() => createQuote({ ...base, items: [] }, 'q1'));
  assert.throws(() => createQuote({ ...base, items: [{ description:'Test', quantity:0, unitDollars:100 }] }, 'q1'));
  const quote = createQuote({ ...base, items: [{ description:'Testing', quantity:2, unitDollars:120.50 }] }, 'q1');
  assert.equal(quoteTotals(quote.items, quote.taxPercent).total, 26028);
});

test('jobs begin scheduled with trackable tasks', () => {
  const job = createJob({ title:'Install ventilation', customerId:'c1', date:addDays(1) }, 'job-1');
  assert.equal(job.status, 'scheduled');
  assert.equal(job.checklist.length, 3);
  assert.equal(job.checklist.filter(t => t.checked).length, 0);
});

test('seed has cross-linked fictional business records and reports them', () => {
  const s = seedData();
  assert.equal(isDemoState(s), true);
  assert.ok(s.customers.length >= 8);
  assert.ok(s.deals.every(d => s.customers.some(c => c.id === d.customerId)));
  assert.ok(s.jobs.every(j => s.customers.some(c => c.id === j.customerId)));
  const m = getMetrics(s);
  assert.ok(m.pipelineValue > 0);
  assert.ok(m.wonValue > 0);
  assert.ok(m.overdue >= 1);
});

test('quote inputs reject malformed amounts, non-finite values and fractional quantities', () => {
  const base = { customerId: 'c1', title: 'On-site service', taxPercent: '8' };
  const validLine = { description: 'Inspection', quantity: '2', unitDollars: '25.50' };
  for (const invalid of ['', 'not-a-number', 'Infinity', Infinity, null]) {
    assert.throws(() => createQuote({ ...base, items: [{ ...validLine, unitDollars: invalid }] }, 'bad-price'), /Check quantity and price/);
    assert.throws(() => createQuote({ ...base, items: [{ ...validLine, quantity: invalid }] }, 'bad-quantity'), /Check quantity and price/);
    assert.throws(() => createQuote({ ...base, items: [validLine], taxPercent: invalid }, 'bad-tax'), /Tax rate/);
  }
  assert.throws(() => createQuote({ ...base, items: [{ ...validLine, quantity: '1.5' }] }, 'fractional'), /Check quantity and price/);
  const quote = createQuote({ ...base, items: [{ ...validLine, unitDollars: '0' }], taxPercent: '0' }, 'free');
  assert.equal(quote.items[0].unitCents, 0);
  assert.equal(quote.items[0].quantity, 2);
  assert.equal(quote.taxPercent, 0);
});
