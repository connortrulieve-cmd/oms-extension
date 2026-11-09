/* ============================================================
   Mock data for the OMS+ Dispensary POS prototype.
   Stands in for OMS+/SAP backend services so the UI is
   fully clickable without a backend.
   ============================================================ */

// Logged-in employee / register session (shown in sidebar profile)
const SESSION = {
  name: "Casey Stone",
  role: "Budtender · FFID",
  store: "Store 1002 · Lutherville",
  terminal: "SHO 2",
  status: "Open",
};

// Primary app navigation (moved from the old bottom tab bar).
// `icon` references a name in js/icons.js.
const NAV = [
  { id: "dashboard", label: "Home", icon: "home" },
  { id: "queue", label: "Waitlist", icon: "queue" },
  { id: "customers", label: "Customers", icon: "user" },
  { id: "orders", label: "Orders", icon: "receipt" },
  { id: "inventory", label: "Inventory", icon: "package" },
];

// Category browse rail. `icon` references a name in js/icons.js.
const CATEGORIES = [
  { id: "Flower", label: "Flower", icon: "leaf" },
  { id: "Vapes", label: "Vapes", icon: "wind" },
  { id: "Pre-Rolls", label: "Pre-Rolls", icon: "flame" },
  { id: "Concentrates", label: "Concentrates", icon: "droplet" },
  { id: "Edibles", label: "Edibles", icon: "cookie" },
  { id: "Topicals", label: "Topicals", icon: "sparkles" },
  { id: "Accessories", label: "Accessories", icon: "bag" },
];

// Map a product category to its placeholder icon (for thumbnails)
const CAT_ICON = { Flower: "leaf", Vapes: "wind", "Pre-Rolls": "flame", Concentrates: "droplet", Edibles: "cookie", Topicals: "sparkles", Accessories: "bag" };

// Strain filter chips (contextual to Flower-type categories)
const STRAINS = ["All", "Hybrid", "Indica", "Sativa", "CBD"];
const SIZES = ["All Sizes", "3.5g", "7g", "14g", "28g"];
const PRICE_BANDS = ["All Prices", "$0–25", "$25–50", "$50–75", "$75+"];

// weightG = flower-equivalent grams counted against purchase limits.
// strain = dominance (Indica/Sativa/Hybrid/CBD); strainName = cultivar; pkgId = METRC-style package tag.
const PRODUCTS = [
  { id: "FL-001", name: "Blue Dream", cat: "Flower", subcat: "Whole Flower", strain: "Hybrid", strainName: "Blue Dream", size: "3.5g", brand: "Cascade Farms", price: 35.0, thc: 24.1, weightG: 3.5, batch: "BD-2411-A", pkgId: "1A4FF0100000A0012", stock: 42 },
  { id: "FL-005", name: "Pineapple Express", cat: "Flower", subcat: "Whole Flower", strain: "Sativa", strainName: "Pineapple Express", size: "3.5g", brand: "Emerald Co.", price: 40.0, thc: 22.0, weightG: 3.5, batch: "PE-2410-C", pkgId: "1A4FF0100000A0056", stock: 18 },
  { id: "FL-002", name: "Wedding Cake", cat: "Flower", subcat: "Whole Flower", strain: "Hybrid", strainName: "Wedding Cake", size: "3.5g", brand: "Emerald Co.", price: 42.0, thc: 27.4, weightG: 3.5, batch: "WC-2410-C", pkgId: "1A4FF0100000A0071", stock: 11 },
  { id: "FL-006", name: "Gelato", cat: "Flower", subcat: "Whole Flower", strain: "Hybrid", strainName: "Gelato", size: "3.5g", brand: "Cascade Farms", price: 45.0, thc: 25.0, weightG: 3.5, batch: "GL-2409-B", pkgId: "1A4FF0100000A0094", stock: 7 },
  { id: "FL-007", name: "Cookie Kush", cat: "Flower", subcat: "Whole Flower", strain: "Indica", strainName: "Cookie Kush", size: "3.5g", brand: "RollHouse", price: 38.0, thc: 23.2, weightG: 3.5, batch: "CK-2412-A", pkgId: "1A4FF0100000A0108", stock: 26 },
  { id: "FL-008", name: "GMO", cat: "Flower", subcat: "Whole Flower", strain: "Indica", strainName: "GMO", size: "3.5g", brand: "Glass Co.", price: 42.0, thc: 28.1, weightG: 3.5, batch: "GMO-2411-D", pkgId: "1A4FF0100000A0122", stock: 12 },
  { id: "FL-009", name: "Zkittlez", cat: "Flower", subcat: "Whole Flower", strain: "Hybrid", strainName: "Zkittlez", size: "3.5g", brand: "Emerald Co.", price: 40.0, thc: 21.4, weightG: 3.5, batch: "ZK-2410-A", pkgId: "1A4FF0100000A0137", stock: 9 },
  { id: "FL-010", name: "Runtz", cat: "Flower", subcat: "Smalls", strain: "Hybrid", strainName: "Runtz", size: "3.5g", brand: "Cascade Farms", price: 42.0, thc: 26.3, weightG: 3.5, batch: "RZ-2409-C", pkgId: "1A4FF0100000A0155", stock: 15 },
  { id: "PR-001", name: "GSC Pre-Roll", cat: "Pre-Rolls", subcat: "Single", strain: "Hybrid", strainName: "GSC", size: "1g", brand: "RollHouse", price: 12.0, thc: 25.8, weightG: 1.0, batch: "GSC-2412-A", pkgId: "1A4FF0100000B0201", stock: 64 },
  { id: "PR-002", name: "Infused 5pk", cat: "Pre-Rolls", subcat: "Infused", strain: "Indica", strainName: "Blue Dream", size: "5g", brand: "RollHouse", price: 45.0, thc: 31.2, weightG: 5.0, batch: "INF-2412-D", pkgId: "1A4FF0100000B0233", stock: 9 },
  { id: "VP-001", name: "Live Resin Cart", cat: "Vapes", subcat: "Cartridge", strain: "Sativa", strainName: "Pineapple Express", size: "1g", brand: "Pure Extracts", price: 55.0, thc: 84.5, weightG: 1.0, batch: "LR-2411-F", pkgId: "1A4FF0100000C0311", stock: 27 },
  { id: "VP-002", name: "Disposable Vape", cat: "Vapes", subcat: "Disposable", strain: "Hybrid", strainName: "Gelato", size: "0.5g", brand: "Puff Labs", price: 34.0, thc: 88.0, weightG: 0.5, batch: "DV-2410-A", pkgId: "1A4FF0100000C0344", stock: 3 },
  { id: "ED-001", name: "Gummies 10mg x10", cat: "Edibles", subcat: "Gummies", strain: "Hybrid", strainName: null, size: "100mg", brand: "Sweet Leaf", price: 22.0, thc: 100, weightG: 0.0, batch: "GM-2412-B", pkgId: "1A4FF0100000D0402", stock: 51 },
  { id: "ED-002", name: "Dark Chocolate", cat: "Edibles", subcat: "Chocolate", strain: "Indica", strainName: null, size: "100mg", brand: "Cocoa Verde", price: 24.0, thc: 100, weightG: 0.0, batch: "CH-2411-A", pkgId: "1A4FF0100000D0428", stock: 0 },
  { id: "CO-001", name: "Live Rosin", cat: "Concentrates", subcat: "Rosin", strain: "Hybrid", strainName: "Wedding Cake", size: "1g", brand: "Pure Extracts", price: 65.0, thc: 78.2, weightG: 1.0, batch: "RS-2409-C", pkgId: "1A4FF0100000E0511", stock: 14 },
  { id: "CO-002", name: "Shatter", cat: "Concentrates", subcat: "Shatter", strain: "Sativa", strainName: "GMO", size: "1g", brand: "Glass Co.", price: 40.0, thc: 81.0, weightG: 1.0, batch: "SH-2410-E", pkgId: "1A4FF0100000E0537", stock: 6 },
  { id: "TP-001", name: "Relief Balm", cat: "Topicals", subcat: "Balm", strain: "CBD", strainName: null, size: "200mg", brand: "Botanica", price: 38.0, thc: 0.0, weightG: 0.0, batch: "BM-2411-A", pkgId: "1A4FF0100000F0603", stock: 33 },
  { id: "AC-001", name: "4-Piece Grinder", cat: "Accessories", subcat: "Grinders", strain: null, strainName: null, size: "—", brand: "Keystone", price: 25.0, thc: 0.0, cbd: 0.0, weightG: 0.0, batch: "AC-2412-A", pkgId: "1A4FF0100000G0701", stock: 40 },
  { id: "AC-002", name: "Rolling Papers (1¼)", cat: "Accessories", subcat: "Papers", strain: null, strainName: null, size: "32 ct", brand: "Elements", price: 4.0, thc: 0.0, cbd: 0.0, weightG: 0.0, batch: "AC-2412-B", pkgId: "1A4FF0100000G0702", stock: 120 },
  { id: "AC-003", name: "510 Battery", cat: "Accessories", subcat: "Batteries", strain: null, strainName: null, size: "—", brand: "Puff Labs", price: 18.0, thc: 0.0, cbd: 0.0, weightG: 0.0, batch: "AC-2411-C", pkgId: "1A4FF0100000G0703", stock: 33 },
  { id: "AC-004", name: "Glass Storage Jar", cat: "Accessories", subcat: "Storage", strain: null, strainName: null, size: "—", brand: "Keystone", price: 12.0, thc: 0.0, cbd: 0.0, weightG: 0.0, batch: "AC-2410-D", pkgId: "1A4FF0100000G0704", stock: 27 },
];

// Prototype padding: generate additional catalog rows so the inventory table
// has enough data (~60+) to demonstrate pagination. Deterministic, not random.
(function seedInventory() {
  const specs = [
    { cat: "Flower", prefix: "FL", subs: ["Whole Flower", "Smalls"], sizes: ["3.5g", "7g", "14g", "28g"], names: ["OG Kush", "Sour Diesel", "Northern Lights", "Jack Herer", "Durban Poison", "Granddaddy Purple", "Green Crack", "Do-Si-Dos"], brands: ["Cascade Farms", "Emerald Co.", "RollHouse", "Glass Co."], thc: [18, 30], price: [30, 60], w: 3.5 },
    { cat: "Vapes", prefix: "VP", subs: ["Cartridge", "Disposable", "Pod"], sizes: ["0.5g", "1g"], names: ["Blue Dream", "Gelato", "Sour Diesel", "Jack Herer", "Wedding Cake"], brands: ["Pure Extracts", "Puff Labs", "Glass Co."], thc: [70, 92], price: [30, 60], w: 1 },
    { cat: "Pre-Rolls", prefix: "PR", subs: ["Single", "Infused", "5-Pack"], sizes: ["0.5g", "1g", "2.5g", "5g"], names: ["GSC", "OG Kush", "Runtz", "Gelato"], brands: ["RollHouse", "Cascade Farms"], thc: [22, 34], price: [10, 50], w: 1 },
    { cat: "Concentrates", prefix: "CO", subs: ["Rosin", "Shatter", "Live Resin", "Budder"], sizes: ["0.5g", "1g"], names: ["Wedding Cake", "GMO", "Sour Diesel", "Gelato"], brands: ["Pure Extracts", "Glass Co."], thc: [70, 88], price: [35, 80], w: 1 },
    { cat: "Edibles", prefix: "ED", subs: ["Gummies", "Chocolate", "Beverage"], sizes: ["100mg", "200mg"], names: [null], brands: ["Sweet Leaf", "Cocoa Verde"], thc: [100, 200], price: [15, 30], w: 0 },
  ];
  const doms = ["Hybrid", "Indica", "Sativa"];
  const pick = (arr, i) => arr[i % arr.length];
  let n = 0;
  let seq = 200;
  for (let round = 0; round < 3; round++) {
    for (const s of specs) {
      for (let j = 0; j < 4; j++, n++, seq++) {
        const idNum = 100 + round * 40 + j + specs.indexOf(s) * 8;
        const name = pick(s.names, n) || pick(["Gummies 10mg x10", "Dark Chocolate", "Sparkling Tonic"], n);
        const price = s.price[0] + ((n * 7) % (s.price[1] - s.price[0]));
        const thc = +(s.thc[0] + ((n * 5.3) % (s.thc[1] - s.thc[0]))).toFixed(1);
        const stock = (n * 13) % 60;
        PRODUCTS.push({
          id: `${s.prefix}-${idNum}`,
          name,
          cat: s.cat,
          subcat: pick(s.subs, n),
          strain: s.cat === "Topicals" ? "CBD" : pick(doms, n),
          strainName: name && !name.includes("mg") && name !== "Dark Chocolate" && name !== "Sparkling Tonic" ? name : null,
          size: pick(s.sizes, n),
          brand: pick(s.brands, n),
          price: +price.toFixed(2),
          thc,
          weightG: s.w,
          batch: `${s.prefix}-24${(10 + (n % 3))}-${String.fromCharCode(65 + (n % 6))}`,
          pkgId: `1A4FF0100000${String.fromCharCode(71 + (n % 6))}${String(1000 + seq)}`,
          stock,
        });
      }
    }
  }
})();

// Assign a CBD % to every product (deterministic). CBD-forward items (topicals,
// CBD-dominant strains) carry higher CBD; THC-forward flower/vape carry trace CBD.
PRODUCTS.forEach((p, i) => {
  if (p.cbd == null) {
    if (p.strain === "CBD" || p.cat === "Topicals") p.cbd = +(8 + ((i * 3.7) % 12)).toFixed(1);
    else p.cbd = +(((i * 1.3) % 15) / 10).toFixed(1); // 0.0–1.4%
  }
});

// Active customer at the register
const CUSTOMER = {
  id: "CUST-88213",
  name: "Jordan Alvarez",
  type: "recreational",
  dob: "1994-06-12",
  idVerified: true,
  idExpires: "2029-06-12",
  loyaltyPoints: 1240,
  limitG: 28.35,       // adult-use daily flower-equivalent (illustrative)
  usedTodayG: 5.0,
};

const CUSTOMERS = [
  { id: "CUST-88213", first: "Jordan", last: "Alvarez", name: "Jordan Alvarez", type: "recreational", dob: "1994-06-12", medId: null, street: "418 Ridgely Rd", city: "Lutherville", state: "MD", zip: "21093", lastTx: "Jul 24, 2026", phone: "(410) 555-0182", email: "jordan.alvarez@gmail.com" },
  { id: "CUST-77104", first: "Priya", last: "Nair", name: "Priya Nair", type: "medical", dob: "1990-09-22", medId: "P22-08332", street: "77 Seminary Ave", city: "Timonium", state: "MD", zip: "21093", lastTx: "Jul 28, 2026", phone: "(443) 555-0114", email: "priya.nair@outlook.com" },
  { id: "CUST-66590", first: "Marcus", last: "Webb", name: "Marcus Webb", type: "recreational", dob: "2001-02-14", medId: null, street: "1230 York Rd", city: "Towson", state: "MD", zip: "21204", lastTx: "Jun 30, 2026", phone: "(410) 555-0937", email: "mwebb@yahoo.com" },
  { id: "CUST-55231", first: "Dana", last: "Lee", name: "Dana Lee", type: "medical", dob: "1979-11-03", medId: "P20-33914", street: "9 Bosley Ave", city: "Towson", state: "MD", zip: "21204", lastTx: "Jul 27, 2026", phone: "(667) 555-0421", email: "dana.lee@gmail.com" },
  { id: "CUST-90012", first: "Sofia", last: "Ramos", name: "Sofia Ramos", type: "recreational", dob: "1998-07-19", medId: null, street: "512 Kenilworth Dr", city: "Towson", state: "MD", zip: "21204", lastTx: "Jul 29, 2026", phone: "(410) 555-0765", email: "sofia.ramos@icloud.com" },
  { id: "CUST-71230", first: "Emily", last: "Carter", name: "Emily Carter", type: "recreational", dob: "1996-03-30", medId: null, street: "88 Aylesbury Rd", city: "Timonium", state: "MD", zip: "21093", lastTx: "Jul 15, 2026", phone: "(240) 555-0308", email: "emily.carter@gmail.com" },
  { id: "CUST-64120", first: "Robert", last: "Kim", name: "Robert Kim", type: "medical", dob: "1985-12-05", medId: "P21-77410", street: "301 Fairmount Ave", city: "Baltimore", state: "MD", zip: "21286", lastTx: "Jul 22, 2026", phone: "(301) 555-0199", email: "robert.kim@proton.me" },
  { id: "CUST-55980", first: "Lena", last: "Ortiz", name: "Lena Ortiz", type: "recreational", dob: "1992-08-08", medId: null, street: "45 Chestnut Ave", city: "Lutherville", state: "MD", zip: "21093", lastTx: "Jul 26, 2026", phone: "(410) 555-0654", email: "lena.ortiz@gmail.com" },
  { id: "CUST-40021", first: "Nina", last: "Patel", name: "Nina Patel", type: "medical", dob: "1983-01-27", medId: "P19-55120", street: "1701 Pot Spring Rd", city: "Timonium", state: "MD", zip: "21093", lastTx: "Jul 29, 2026", phone: "(443) 555-0872", email: "nina.patel@outlook.com" },
  { id: "CUST-33915", first: "Andre", last: "Thompson", name: "Andre Thompson", type: "recreational", dob: "1988-10-16", medId: null, street: "620 Gilroy Rd", city: "Cockeysville", state: "MD", zip: "21030", lastTx: "May 18, 2026", phone: "(667) 555-0290", email: "andre.t@gmail.com" },
  { id: "CUST-29840", first: "Grace", last: "Chen", name: "Grace Chen", type: "medical", dob: "1975-05-09", medId: "P18-22087", street: "14 Galloway Dr", city: "Lutherville", state: "MD", zip: "21093", lastTx: "Jul 11, 2026", phone: "(410) 555-0517", email: "grace.chen@yahoo.com" },
  { id: "CUST-21077", first: "Miguel", last: "Santos", name: "Miguel Santos", type: "recreational", dob: "1999-12-01", medId: null, street: "233 Ware Ave", city: "Towson", state: "MD", zip: "21204", lastTx: "Jul 03, 2026", phone: "(240) 555-0645", email: "msantos@icloud.com" },
  { id: "CUST-19003", first: "Hannah", last: "Brooks", name: "Hannah Brooks", type: "recreational", dob: "1997-04-25", medId: null, street: "5 Overbrook Rd", city: "Catonsville", state: "MD", zip: "21228", lastTx: "Jun 12, 2026", phone: "(301) 555-0788", email: "hannah.brooks@gmail.com" },
  { id: "CUST-10442", first: "David", last: "O'Neill", name: "David O'Neill", type: "medical", dob: "1968-08-30", medId: "P17-90114", street: "902 Dulaney Valley Rd", city: "Towson", state: "MD", zip: "21204", lastTx: "Jul 25, 2026", phone: "(410) 555-0233", email: "david.oneill@gmail.com" },
];

// Enrich each customer with loyalty, contact preferences, and recent purchase
// history so the profile drawer has something meaningful to show (prototype data).
const CUST_TIERS = [null, "Tru-Member", "Tru-Insider", "Tru-Elite", "Tru-Icon"];
const PURCHASE_DATES = ["Jul 24, 2026", "Jun 30, 2026", "Jun 02, 2026", "May 18, 2026", "Apr 27, 2026", "Mar 09, 2026"];
CUSTOMERS.forEach((c, i) => {
  c.tier = CUST_TIERS[i % CUST_TIERS.length];
  c.points = [0, 640, 1240, 3300, 9600][i % 5];
  c.emailOptIn = i % 2 === 0;
  c.smsOptIn = i % 3 === 0;
  const n = 2 + (i % 3); // 2–4 recent orders
  c.purchases = Array.from({ length: n }, (_, k) => ({
    id: "ORD-" + (5490 - i * 4 - k),
    date: k === 0 && c.lastTx ? c.lastTx : PURCHASE_DATES[(i + k) % PURCHASE_DATES.length],
    items: 1 + ((i + k) % 5),
    total: 38 + ((i * 17 + k * 29) % 214),
  }));
});

// Backwards-compatible alias (older references expected RECENT_CUSTOMERS)
const RECENT_CUSTOMERS = CUSTOMERS;

// In-store patient queue shown on the Queue page. Tapping a row opens its cart.
// patient: New | Existing   use: MED | REC   orderType: Walk-in | Pickup
// status: Waiting | Building | Awaiting Payment | Ready
// register: assigned register id, or null when unassigned
const OPEN_ORDERS = [
  { id: "ORD-5521", customer: "Ashley Sullivan", points: 2347, dob: "1988-04-10", customerId: "CUST-84455", patient: "Existing", use: "MED", tier: "Tru-Elite", orderType: "Walk-in", status: "Building", register: "SHO 2", items: 3, total: 159.0, waitingMin: 5, verified: true, mmjId: "P24-01159", mmjExp: "03/2027", note: "Prefers pre-rolls up front. Allergic to peanuts — avoid infused edibles with nut oils." },
  { id: "ORD-5522", customer: "Priya Nair", points: 5120, dob: "1990-09-22", customerId: "CUST-77104", patient: "Existing", use: "MED", tier: "Tru-Insider", orderType: "Pickup", status: "Waiting", register: null, fulfillment: "Preparing", items: 0, total: 0.0, waitingMin: 2, verified: true, mmjId: "P22-08332", mmjExp: "11/2026" },
  { id: "ORD-5523", customer: "Marcus Webb", points: 0, dob: "2001-02-14", customerId: "CUST-66590", patient: "New", use: "REC", tier: null, orderType: "Walk-in", status: "Waiting", register: null, items: 1, total: 34.0, waitingMin: 1, verified: false, mmjId: null, mmjExp: null },
  { id: "ORD-5524", customer: "Dana Lee", points: 8890, dob: "1979-11-03", customerId: "CUST-55231", patient: "Existing", use: "MED", tier: "Tru-Icon", orderType: "Walk-in", status: "Awaiting Payment", register: "SHO 1", items: 5, total: 288.5, waitingMin: 6, verified: true, mmjId: "P20-33914", mmjExp: "07/2026", note: "VIP — comp a pre-roll on next visit." },
  { id: "ORD-5525", customer: "Sofia Ramos", points: 0, dob: "1998-07-19", customerId: "CUST-90012", patient: "New", use: "REC", tier: null, orderType: "Walk-in", status: "Ready", register: "SHO 3", items: 2, total: 96.0, waitingMin: 9, verified: false, mmjId: null, mmjExp: null },
  { id: "ORD-5526", customer: "Jordan Alvarez", points: 1240, dob: "1994-06-12", customerId: "CUST-88213", patient: "Existing", use: "REC", tier: "Tru-Member", orderType: "Pickup", status: "Building", register: "SHO 2", fulfillment: "Fulfilled", items: 4, total: 172.0, waitingMin: 4, verified: true, mmjId: null, mmjExp: null },
];

// Checked-in staging area: walk-ins checked in from the Customers page and pickup
// customers who have arrived. "Start Order" opens the cart and moves them to In Progress.
const CHECKED_IN = [
  { id: "ORD-5610", customer: "Grace Chen", points: 3300, dob: "1975-05-09", customerId: "CUST-29840", patient: "Existing", use: "MED", tier: "Tru-Icon", orderType: "Walk-in", status: "Checked In", register: null, items: 0, total: 0.0, waitingMin: 3, verified: true, mmjId: "P18-22087", mmjExp: "08/2027" },
  { id: "ORD-5611", customer: "Miguel Santos", points: 640, dob: "1999-12-01", customerId: "CUST-21077", patient: "Existing", use: "REC", tier: "Tru-Member", orderType: "Pickup", status: "Checked In", register: null, fulfillment: "Preparing", items: 2, total: 72.0, waitingMin: 1, verified: true, mmjId: null, mmjExp: null },
];

// Online orders still being prepared in back-of-house — not ready for pickup yet.
// They can still be checked in early, but the card notes they aren't ready.
const PICKUP_ORDERS = [
  { id: "ORD-6102", customer: "Robert Kim", points: 180, dob: "1985-12-05", customerId: "CUST-64120", patient: "Existing", use: "MED", tier: null, orderType: "Pickup", status: "Preparing", fulfillment: "Preparing", items: 4, total: 210.0, placedAgo: "25m ago", verified: true, mmjId: "P21-77410", mmjExp: "05/2027" },
  { id: "ORD-6104", customer: "Hannah Brooks", points: 0, dob: "1997-04-25", customerId: "CUST-19003", patient: "New", use: "REC", tier: null, orderType: "Pickup", status: "Preparing", fulfillment: "Not Fulfilled", items: 3, total: 88.0, placedAgo: "6m ago", verified: true, mmjId: null, mmjExp: null },
];

// Online orders that have been fulfilled in back-of-house and are ready for pickup.
// "Check In" moves them onto the Checked-in tab; their cart shows a Fulfilled status.
const FULFILLED = [
  { id: "ORD-6101", customer: "Emily Carter", points: 640, dob: "1996-03-30", customerId: "CUST-71230", patient: "New", use: "REC", tier: "Tru-Member", orderType: "Pickup", status: "Ready", fulfillment: "Fulfilled", items: 2, total: 78.0, placedAgo: "12m ago", readyAgo: "4m ago", verified: true, mmjId: null, mmjExp: null },
  { id: "ORD-6103", customer: "Lena Ortiz", points: 3300, dob: "1992-08-08", customerId: "CUST-55980", patient: "Existing", use: "REC", tier: "Tru-Insider", orderType: "Pickup", status: "Ready", fulfillment: "Fulfilled", items: 1, total: 45.0, placedAgo: "3m ago", readyAgo: "1m ago", verified: true, mmjId: null, mmjExp: null },
  { id: "ORD-6106", customer: "David O'Neill", points: 9600, dob: "1968-08-30", customerId: "CUST-10442", patient: "Existing", use: "MED", tier: "Tru-Icon", orderType: "Pickup", status: "Ready", fulfillment: "Fulfilled", items: 5, total: 240.0, placedAgo: "30m ago", readyAgo: "8m ago", verified: true, mmjId: "P17-90114", mmjExp: "09/2027" },
];

// Patients served today. "Restore" puts them back on the waitlist and restarts the timer.
const HISTORY = [
  { id: "ORD-6001", customer: "Nina Patel", points: 4210, dob: "1983-01-27", customerId: "CUST-40021", patient: "Existing", use: "MED", tier: "Tru-Elite", orderType: "Walk-in", register: "SHO 1", waitMin: 7, servedAt: "10:42 AM", items: 3, total: 132.0, verified: true, mmjId: "P19-55120", mmjExp: "02/2027" },
  { id: "ORD-6002", customer: "Chris Doyle", points: 0, dob: "2000-05-16", customerId: "CUST-40088", patient: "New", use: "REC", tier: null, orderType: "Pickup", register: "SHO 2", waitMin: 12, servedAt: "10:20 AM", items: 2, total: 64.0, verified: true, mmjId: null, mmjExp: null },
  { id: "ORD-6003", customer: "Amara Okafor", points: 9600, dob: "1987-10-11", customerId: "CUST-40190", patient: "Existing", use: "MED", tier: "Tru-Icon", orderType: "Walk-in", register: "SHO 3", waitMin: 4, servedAt: "9:58 AM", items: 5, total: 240.0, verified: true, mmjId: "P23-11876", mmjExp: "09/2028" },
];

// Rolling daily counters shown in the KPI boxes
const QUEUE_STATS = { served: 164, noShows: 2 };

// Registers available for assignment (used by the row menu)
const REGISTERS = ["SHO 1", "SHO 2", "SHO 3"];

const ORDERS = [
  { id: "ORD-5521", customer: "Jordan Alvarez", items: 3, total: 159.0, status: "Ready", when: "2 min ago" },
  { id: "ORD-5520", customer: "Priya Nair", items: 5, total: 288.5, status: "Fulfilling", when: "8 min ago" },
  { id: "ORD-5519", customer: "Walk-in", items: 1, total: 34.0, status: "Completed", when: "22 min ago" },
  { id: "ORD-5518", customer: "Dana Lee", items: 2, total: 96.0, status: "Completed", when: "37 min ago" },
];

const KPIS = [
  { label: "Sales today", value: "$8,412", trend: "+12.4%", dir: "up" },
  { label: "Transactions", value: "134", trend: "+6.1%", dir: "up" },
  { label: "Avg. basket", value: "$62.78", trend: "-1.8%", dir: "down" },
  { label: "Compliance flags", value: "2", trend: "needs review", dir: "down" },
];

// Cannabis tax model (illustrative rates for the prototype)
const TAX = { excise: 0.15, sales: 0.0825 };
