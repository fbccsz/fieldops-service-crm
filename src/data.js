import { addDays } from './domain.js';

const customers = [
  ['c1', 'Olivia Bennett', 'Northline Interiors', 'olivia@northline.example', '+1 (555) 010-2918', 'Austin, TX'],
  ['c2', 'Daniel Kim', 'Evergreen Living', 'daniel@evergreen.example', '+1 (555) 010-4815', 'Denver, CO'],
  ['c3', 'Maya Thompson', 'Maya Thompson', 'maya@thompson.example', '+1 (555) 010-8441', 'Portland, OR'],
  ['c4', 'James Mitchell', 'Mitchell & Co.', 'james@mitchell.example', '+1 (555) 010-9944', 'Seattle, WA'],
  ['c5', 'Ava Martinez', 'Studio A Collective', 'ava@studioa.example', '+1 (555) 010-7732', 'Austin, TX'],
  ['c6', 'Noah Wilson', 'Horizon Works', 'noah@horizon.example', '+1 (555) 010-0197', 'Dallas, TX'],
  ['c7', 'Sophia Parker', 'Parkside Group', 'sophia@parkside.example', '+1 (555) 010-4482', 'Phoenix, AZ'],
  ['c8', 'Ethan Brooks', 'Briarfield Properties', 'ethan@briarfield.example', '+1 (555) 010-2610', 'Denver, CO'],
  ['c9', 'Chloe Reed', 'Dwell Studio', 'chloe@dwell.example', '+1 (555) 010-5603', 'San Diego, CA'],
  ['c10', 'Liam Foster', 'Foster & Sons', 'liam@foster.example', '+1 (555) 010-8172', 'Austin, TX'],
].map(([id, name, company, email, phone, city]) => ({ id, name, company, email, phone, city, avatar: name.split(' ').map(x => x[0]).slice(0,2).join(''), addedAt: addDays(-20) }));

const deals = [
  ['d1', 'Full kitchen renovation', 'c1', 1850000, 'proposal', 'high', 1],
  ['d2', 'Commercial HVAC service', 'c2', 920000, 'qualified', 'normal', 3],
  ['d3', 'Living room remodel', 'c3', 1275000, 'new', 'normal', -1],
  ['d4', 'Property maintenance contract', 'c4', 640000, 'proposal', 'normal', 5],
  ['d5', 'Office electrical overhaul', 'c5', 2400000, 'qualified', 'high', 2],
  ['d6', 'Residential painting', 'c6', 480000, 'won', 'normal', -8],
  ['d7', 'Bathroom installation', 'c7', 860000, 'new', 'normal', 0],
  ['d8', 'Exterior deck rebuild', 'c8', 1540000, 'proposal', 'high', -2],
  ['d9', 'Lighting & fixtures', 'c9', 340000, 'won', 'normal', -14],
  ['d10', 'Annual service agreement', 'c10', 1050000, 'qualified', 'normal', 4],
  ['d11', 'Roof inspection and repairs', 'c2', 220000, 'new', 'normal', 1],
].map(([id, title, customerId, valueCents, stage, priority, offset]) => ({ id, title, customerId, valueCents, stage, priority, followUpDate: addDays(offset), createdAt: addDays(offset - 8) }));

const quote = (id, number, customerId, title, items, status, days, taxPercent=8) => ({ id, number, customerId, title, items: items.map(([description,quantity,unitCents],i)=>({id:`${id}-${i}`,description,quantity,unitCents})), taxPercent, status, createdAt:addDays(days-10),dueAt:addDays(days) });
const quotes = [
  quote('q1','EST-1042','c1','Kitchen renovation', [['Site preparation',1,250000],['Cabinet installation',1,680000],['Materials',1,420000]], 'sent',5),
  quote('q2','EST-1043','c4','Maintenance contract', [['Quarterly inspections',4,95000],['Routine maintenance',1,220000]], 'accepted',12),
  quote('q3','EST-1044','c5','Office electrical overhaul', [['Wiring upgrades',1,980000],['Lighting fixtures',14,32500]], 'draft',14),
  quote('q4','EST-1045','c8','Deck rebuild', [['Structure and framing',1,880000],['Finishing',1,410000]], 'sent',3),
  quote('q5','EST-1046','c6','Residential painting', [['Interior painting',1,350000],['Surface preparation',1,80000]], 'accepted',-2),
];

const makeJob = (id,title,customerId,service,date,status,completed=0) => ({
  id,title,customerId,service,date:addDays(date),status,checklist:[
    {id:`${id}-a`,label:'Confirm scope with client',checked:completed>=1},
    {id:`${id}-b`,label:'Assign resources',checked:completed>=2},
    {id:`${id}-c`,label:'Complete work and review',checked:completed>=3},
  ]
});
const jobs = [
  makeJob('j1','Kitchen installation / phase 2','c1','Remodeling',2,'progress',2),
  makeJob('j2','HVAC inspection','c2','HVAC',1,'scheduled',1),
  makeJob('j3','Maintenance visit','c4','Property care',4,'scheduled',0),
  makeJob('j4','Bathroom plumbing','c7','Plumbing',6,'scheduled',1),
  makeJob('j5','Painting handover','c6','Painting',-1,'done',3),
  makeJob('j6','Lighting installation','c9','Electrical',-4,'done',3),
  makeJob('j7','Exterior inspection','c8','Inspection',3,'progress',2),
];

export const seedData = () => ({ version: 1, customers: structuredClone(customers), deals: structuredClone(deals), quotes: structuredClone(quotes), jobs: structuredClone(jobs), activity: [
  { id:'a1', type:'quote', text:'Estimate EST-1042 sent to Olivia Bennett', date:addDays(0) },
  { id:'a2', type:'job', text:'Kitchen installation moved to In progress', date:addDays(-1) },
  { id:'a3', type:'client', text:'New inquiry from Maya Thompson', date:addDays(-2) },
  { id:'a4', type:'quote', text:'Estimate EST-1043 accepted', date:addDays(-3) },
  { id:'a5', type:'client', text:'Horizon Works added as a customer', date:addDays(-5) },
] });
