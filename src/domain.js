export const STAGES = [
  { id: 'new', label: 'New inquiry', tone: 'neutral' },
  { id: 'qualified', label: 'Qualified', tone: 'blue' },
  { id: 'proposal', label: 'Proposal sent', tone: 'orange' },
  { id: 'won', label: 'Won', tone: 'green' },
];
export const JOB_STAGES = [
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'progress', label: 'In progress' },
  { id: 'done', label: 'Completed' },
];
export const QUOTE_STATUSES = ['draft', 'sent', 'accepted', 'declined'];
export const currency = (cents) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
export const dateLabel = (date, options = { month: 'short', day: 'numeric' }) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...options }).format(new Date(`${date}T12:00:00Z`));
export const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const initials = (text) => String(text || '?').trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const addDays = (days, base = todayISO()) => {
  const date = new Date(`${base}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
export const normalizeText = (value, max = 140) => String(value ?? '').trim().slice(0, max);
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
export const isValidDealStage = (stage) => STAGES.some(item => item.id === stage);
export const isValidJobStage = (stage) => JOB_STAGES.some(item => item.id === stage);
export const safeNumber = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
export function quoteTotals(items, taxPercent = 0) {
  if (!Array.isArray(items)) throw Error('Quote items must be an array');
  const subtotal = items.reduce((sum, item) => {
    const qty = Math.max(0, Math.min(10000, Math.floor(safeNumber(item.quantity))));
    const unitCents = Math.max(0, Math.min(100000000, Math.round(safeNumber(item.unitCents))));
    return sum + qty * unitCents;
  }, 0);
  const taxRate = Math.max(0, Math.min(100, safeNumber(taxPercent)));
  const tax = Math.round(subtotal * taxRate / 100);
  return { subtotal, tax, total: subtotal + tax };
}
export function getMetrics(state) {
  const openDeals = state.deals.filter(item => item.stage !== 'won');
  const pipelineValue = openDeals.reduce((sum, item) => sum + item.valueCents, 0);
  const wonValue = state.deals.filter(item => item.stage === 'won').reduce((sum, item) => sum + item.valueCents, 0);
  const activeJobs = state.jobs.filter(item => item.status !== 'done').length;
  const overdue = state.deals.filter(item => item.stage !== 'won' && item.followUpDate && item.followUpDate < todayISO()).length;
  const closeRate = state.deals.length ? Math.round(state.deals.filter(item => item.stage === 'won').length / state.deals.length * 100) : 0;
  return { pipelineValue, wonValue, activeJobs, overdue, closeRate, customers: state.customers.length };
}
export function selectCustomer(state, id) { return state.customers.find(item => item.id === id) || null; }
export function requiredString(value, label, max = 120) {
  const result = normalizeText(value, max);
  if (!result) throw Error(`${label} is required`);
  return result;
}
export function createCustomer(input, id = crypto.randomUUID()) {
  const name = requiredString(input.name, 'Name');
  const email = requiredString(input.email, 'Email', 160);
  if (!isValidEmail(email)) throw Error('Enter a valid email address');
  return {
    id, name, email,
    company: normalizeText(input.company, 120),
    phone: normalizeText(input.phone, 35),
    city: normalizeText(input.city, 80),
    addedAt: todayISO(),
    avatar: initials(name),
  };
}
export function createDeal(input, id = crypto.randomUUID()) {
  const title = requiredString(input.title, 'Opportunity title', 140);
  const customerId = requiredString(input.customerId, 'Customer', 100);
  const valueDollars = safeNumber(input.valueDollars);
  if (valueDollars <= 0 || valueDollars > 10000000) throw Error('Enter a valid estimated value');
  return {
    id, title, customerId, valueCents: Math.round(valueDollars * 100),
    stage: 'new', priority: input.priority === 'high' ? 'high' : 'normal',
    followUpDate: input.followUpDate || addDays(2),
    createdAt: todayISO(),
  };
}
export function createQuote(input, id = crypto.randomUUID()) {
  const customerId = requiredString(input.customerId, 'Customer', 100);
  const title = requiredString(input.title, 'Quote title', 140);
  const items = (input.items || []).filter(item => normalizeText(item.description));
  if (!items.length) throw Error('Add at least one item');
  // Unlike safeNumber(), invalid form values must not silently become free items.
  const parseQuoteNumber = value => (
    value == null || (typeof value === 'string' && !value.trim()) ? NaN : Number(value)
  );
  const normalized = items.map(item => ({
    id: crypto.randomUUID(),
    description: requiredString(item.description, 'Line item', 140),
    quantity: parseQuoteNumber(item.quantity),
    unitCents: Math.round(parseQuoteNumber(item.unitDollars) * 100),
  }));
  if (normalized.some(item =>
    !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10000 ||
    !Number.isFinite(item.unitCents) || item.unitCents < 0 || item.unitCents > 100000000
  )) throw Error('Check quantity and price');
  const taxPercent = input.taxPercent === undefined ? 0 : parseQuoteNumber(input.taxPercent);
  if (!Number.isFinite(taxPercent) || taxPercent < 0 || taxPercent > 100) throw Error('Tax rate must be between 0 and 100');
  return { id, number: `EST-${Date.now().toString().slice(-6)}`, customerId, title, items: normalized, taxPercent, status: 'draft', createdAt: todayISO(), dueAt: addDays(14) };
}
export function createJob(input, id = crypto.randomUUID()) {
  return {
    id, title: requiredString(input.title, 'Job name', 140),
    customerId: requiredString(input.customerId, 'Customer'),
    service: normalizeText(input.service, 90) || 'General service',
    date: requiredString(input.date || addDays(2), 'Date', 20),
    status: 'scheduled',
    checklist: [
      { id: `${id}-1`, label: 'Confirm scope with client', checked: false },
      { id: `${id}-2`, label: 'Assign resources', checked: false },
      { id: `${id}-3`, label: 'Complete work and review', checked: false },
    ],
  };
}
export function getUpcoming(state) {
  return state.jobs.filter(item => item.status !== 'done').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
}
export function isDemoState(obj) {
  return Boolean(obj && typeof obj === 'object' && obj.version === 1 && Array.isArray(obj.customers) && Array.isArray(obj.deals) && Array.isArray(obj.jobs) && Array.isArray(obj.quotes));
}
