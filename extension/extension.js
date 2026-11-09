/* ============================================================
   OMS+ Extension skin — Med Sale Cart logic (iPad 1024×768)
   Reuses shared ../js/icons.js (icon()) and ../js/data.js (PRODUCTS).
   ============================================================ */
(function () {
  "use strict";

  var APP_VERSION = "0.1.0"; // bump on every shared release; see CHANGELOG.md
  var TAX_RATE = 0; // medical flower is tax-exempt in many markets; kept editable

  // ---------- seeded demo data (mirrors the OMS Med Sale screenshot) ----------
  var MED = {
    patient: {
      name: "Michael Farese",
      tier: "Tru-Elite",
      dob: "04/18/1986",
      medId: "P30-4417-2290",
      phone: "(850) 555-0147",
      email: "m.farese@example.com",
      address: "214 Mabry St, Tallahassee FL",
      credits: 12.0,
      rewards: 240,
      enroll: { rewards: true, email: true, sms: false, app: false },
      notes: [
        { author: "Jordan Reyes", time: "Nov 2, 2026 · 2:14 PM", text: "Patient prefers indica-dominant flower for evenings. Mentioned mild citrus allergy." },
        { author: "Casey Stone", time: "Oct 28, 2026 · 11:02 AM", text: "Verified Med ID and renewal date. Enrolled in SMS reminders per request." }
      ]
    },
    order: { number: "2032666409", type: "Walk-in", fulfillment: "Not Fulfilled", status: "In Progress" },
    items: [
      {
        id: "L1", brand: "Trulieve", name: "Strawberries & Cream TruPod 500mg",
        route: "INH", usage: "413 mg", strain: "Indica", subcat: "Vape Pod", size: "0.5g", status: "verified", batch: "0008971552",
        qty: 1, unit: 55.0, discount: { label: "$20 .5g BDT TruPods", amt: -37.0 }
      },
      {
        id: "L2", brand: "Trulieve", name: "Space Monkey Minis 7g",
        route: "SMO", usage: "0.24 oz", strain: "Sativa", subcat: "Flower Minis", size: "7g", status: "changed", batch: "0009031606",
        qty: 1, unit: 55.0, discount: { label: "Buy More Save More", amt: -37.0 }
      },
      {
        id: "L3", brand: "Modern Flower", name: "Papaya Punch Whole Flower 3.5g",
        route: "SMO", usage: "0.12 oz", strain: "Hybrid", subcat: "Whole Flower", size: "3.5g", status: "verified", batch: "0010293771",
        qty: 2, unit: 35.0, discount: null
      },
      {
        id: "L4", brand: "Roll One", name: "Lemon Royale Pre-Roll 1g",
        route: "SMO", usage: "0.035 oz", strain: "Sativa", subcat: "Pre-Roll", size: "1g", status: "notverified", batch: "0022910654",
        qty: 3, unit: 9.0, discount: { label: "3 for $21 Pre-Rolls", amt: -2.0 }
      },
      {
        id: "L5", brand: "Alchemy", name: "Blue Dream Live Resin Cart 0.5g",
        route: "INH", usage: "196 mg", strain: "Sativa", subcat: "Live Resin Cart", size: "0.5g", status: "verified", batch: "0033871902",
        qty: 1, unit: 40.0, discount: null
      },
      {
        id: "L6", brand: "Trulieve", name: "Grape Gelato Ground Flower 14g",
        route: "SMO", usage: "0.49 oz", strain: "Indica", subcat: "Ground Flower", size: "14g", status: "changed", batch: "0041290338",
        qty: 1, unit: 70.0, discount: { label: "BOGO 50% Flower", amt: -35.0 }
      },
      {
        id: "L7", brand: "Sunshine Cannabis", name: "Motorbreath Minis 7g",
        route: "SMO", usage: "0.24 oz", strain: "Indica", subcat: "Flower Minis", size: "7g", status: "notverified", batch: "0052901177",
        qty: 1, unit: 50.0, discount: null
      },
      {
        id: "L8", brand: "Trulieve", name: "Citrus Skunk Distillate Syringe 1g",
        route: "INH", usage: "392 mg", strain: "Hybrid", subcat: "Distillate Syringe", size: "1g", status: "verified", batch: "0061120394",
        qty: 1, unit: 30.0, discount: { label: "$10 Off Distillate", amt: -10.0 }
      }
    ],
    // headline allotment (single legal-limit bar shown in the rail)
    allotSummary: { limit: "28.00g", used: "2.34g", remaining: "25.66g", pct: 8 },
    // all forms (shown in the "Show all" drawer)
    allotments: [
      { key: "Smoking",    left: "2.50oz",   pct: 62, inOrder: "0.24oz" },
      { key: "Edibles",    left: "2,100mg",  pct: 54 },
      { key: "Inhalation", left: "14,563mg", pct: 73, inOrder: "837mg" },
      { key: "Oral",       left: "8,900mg",  pct: 81, inOrder: "120mg" },
      { key: "Topical",    left: "4.00oz",   pct: 90 },
      { key: "Sublingual", left: "6,400mg",  pct: 68, inOrder: "40mg" }
    ],
    suggested: [
      { brand: "Modern Flower", name: "Shipwreck Whole Flower 3.5g", route: "SMO", usage: "0.12 oz", strain: "Sativa", batch: "0010293", price: 15.0, was: 35.0 },
      { brand: "Roll One", name: "Kief 0.5g", route: "INH", usage: "196 mg", strain: "Indica", batch: "0022910", price: 10.0, was: 20.0 },
      { brand: "Modern Flower", name: "Riddler Minis 3.5g", route: "SMO", usage: "0.12 oz", strain: "Hybrid", batch: "0033871", price: 10.0, was: 30.0 }
    ],
    tenders: ["Cash", "Debit", "CanPay", "Store Credit"],
    adjustments: [],       // { id, kind: "discount"|"reward"|"donation", label, amt }  (amt<0 reduces, >0 adds)
    payments: []           // one line per method: { method, amount, tendered, change }
  };

  var TIER_CLASS = {
    "Tru-Member": "ext-tier--member",
    "Tru-Insider": "ext-tier--insider",
    "Tru-Elite": "ext-tier--elite",
    "Tru-Icon": "ext-tier--icon"
  };

  // store / session context (top bar)
  var STORE = { number: "1002", name: "Lutherville", pos: "SHO 2", status: "Open", user: "Casey Stone" };

  var ORDER_TYPES = ["Walk-in", "Pickup", "Curbside", "Delivery", "Return", "Delivery Return"];
  var ORDER_TYPE_ICON = { "Walk-in": "user", "Pickup": "paperBag", "Curbside": "carFront", "Delivery": "van", "Return": "undo2", "Delivery Return": "packageOpen" };
  var RETURN_TYPES = ["Return", "Delivery Return"];
  var ORDER_STATUS_CLASS = { "In Progress": "is-progress", "Fulfilled": "is-fulfilled", "Complete": "is-complete", "Voided": "is-voided" };
  var ORDER_SETTINGS = [
    { k: "dispense", label: "Perform Manual Dispensation", desc: "Record this dispensation manually instead of through the state system." },
    { k: "caregiver", label: "Caregiver Pickup", desc: "A registered caregiver is picking up on the patient's behalf." },
    { k: "rounding", label: "Enable Rounding", desc: "Round the order total to the nearest dollar." }
  ];

  // receipts / labels toolbar buttons
  var RECEIPTS = [
    { k: "packing", ic: "receiptText", t: "Packing Slip" },
    { k: "receipt", ic: "scrollText", t: "Receipt" },
    { k: "labels", ic: "squareText", t: "Labels" },
    { k: "boh", ic: "forward", t: "Print to Back of House" }
  ];

  // ----- Add-products (material lookup) config -----
  // Curated "AI suggested" catalog picks shown under the Suggested tile.
  var AI_SUGGESTED = ["FL-001", "VP-001", "PR-001", "ED-001", "CO-001", "FL-006", "VP-002", "CO-002"];

  // Browse-by-category tiles. `match` = PRODUCTS.cat to filter (omit = none yet).
  var LK_CATEGORIES = [
    { label: "Suggested", icon: "sparkles", cls: "sugg", suggest: true },
    { label: "Flower", icon: "leaf", cls: "green", match: "Flower" },
    { label: "Edibles", icon: "cookie", cls: "yellow", match: "Edibles" },
    { label: "Vapes", icon: "wind", cls: "blue", match: "Vapes" },
    { label: "Concentrates", icon: "droplet", cls: "tan", match: "Concentrates" },
    { label: "Batteries and Devices", icon: "card", cls: "gray" },
    { label: "Nebulizers", icon: "wind", cls: "teal" },
    { label: "Accessories", icon: "bag", cls: "purple", match: "Accessories" },
    { label: "Topicals", icon: "heart", cls: "pink", match: "Topicals" },
    { label: "Merchandise", icon: "gift", cls: "purple" },
    { label: "Live Plant", icon: "leaf", cls: "pink" },
    { label: "Sublinguals", icon: "droplet", cls: "blue" },
    { label: "Oral", icon: "heart", cls: "peach" },
    { label: "Pre Rolls", icon: "flame", cls: "tan", match: "Pre-Rolls" },
    { label: "Non Cannabis", icon: "tag", cls: "pink" },
    { label: "Gift with Purchase", icon: "gift", cls: "blue" },
    { label: "Infused Flower Products", icon: "sparkles", cls: "tan" },
    { label: "1.75G", icon: "leaf", cls: "green" },
    { label: "Infused Beverage", icon: "droplet", cls: "pink" }
  ];
  var LK_SHOW = ["All", "In stock", "Available", "Unavailable"];
  // route code derived from product category when a product is added to the cart
  var ROUTE_BY_CAT = { Flower: "SMO", "Pre-Rolls": "SMO", Vapes: "INH", Concentrates: "INH", Edibles: "ORAL", Topicals: "TOP", Accessories: "—" };

  // ----- Discounts / Rewards / Donation config -----
  var STD_DISCOUNTS = [
    { label: "Wisdom (Senior)", pct: 10 },
    { label: "Veteran", pct: 15 },
    { label: "Employee", pct: 20 },
    { label: "Compassionate Care", pct: 25 },
    { label: "Industry", pct: 10 }
  ];
  var REWARDS = [
    { label: "$2 Off", pts: 50, amt: 2 },
    { label: "$5 Off", pts: 100, amt: 5 },
    { label: "$10 Off", pts: 200, amt: 10 },
    { label: "$25 Off", pts: 400, amt: 25 },
    { label: "$50 Off", pts: 750, amt: 50 },
    { label: "$100 Off", pts: 1400, amt: 100 }
  ];
  var COUPONS = { "SAVE10": 10, "WELCOME15": 15, "20OFF": 20, "FIVE": 5 };
  var DONATION_PRESETS = [1, 2, 5, 10];

  // ----- Add-products sort + filter config -----
  var LK_SORTS = [
    { k: "popular", label: "Most popular" },
    { k: "newest", label: "Newest first" },
    { k: "oldest", label: "Newest last" },
    { k: "az", label: "A - Z" },
    { k: "za", label: "Z - A" },
    { k: "priceAsc", label: "Price low to high" },
    { k: "priceDesc", label: "Price high to low" },
    { k: "thcDesc", label: "THC % high to low" },
    { k: "thcAsc", label: "THC % low to high" }
  ];
  // multi = any of the chosen chips; single = one bucket at a time
  var LK_FILTERS = [
    { k: "strain", label: "Strain type", multi: true },
    { k: "brand", label: "Brand", multi: true },
    { k: "size", label: "Size", multi: true },
    { k: "thc", label: "THC", opts: [
      { k: "15", label: "15%+", min: 15 }, { k: "20", label: "20%+", min: 20 },
      { k: "25", label: "25%+", min: 25 }, { k: "30", label: "30%+", min: 30 }, { k: "70", label: "70%+", min: 70 }] },
    { k: "cbd", label: "CBD", opts: [
      { k: "1", label: "1%+", min: 1 }, { k: "5", label: "5%+", min: 5 }, { k: "10", label: "10%+", min: 10 }] },
    { k: "price", label: "Price", opts: [
      { k: "u20", label: "Under $20", min: 0, max: 20 }, { k: "20", label: "$20 – $40", min: 20, max: 40 },
      { k: "40", label: "$40 – $60", min: 40, max: 60 }, { k: "60", label: "$60+", min: 60, max: Infinity }] }
  ];
  function emptyLkFilters() { return { strain: [], brand: [], size: [], thc: "", cbd: "", price: "" }; }
  var adjSeq = 1;

  // ---------- running UI state ----------
  var state = {
    settings: { dispense: false, caregiver: false, rounding: false },
    creditIssued: 0,   // store credit issued on a Return order
    voidConfirm: false,
    overlay: null,     // null | "pay" | "allot" | "disc" | "mgr" | "menu" | "lookup" | "notes" | "enroll"
    payMethod: "Cash", // a tender in MED.tenders, or "Rewards" / "Donation"
    payBuffer: "",     // typed digits for the keypad (tender amount or donation)
    lookup: {
      q: "", cat: null, sub: null, suggest: false, show: "Available",
      sort: "popular", filters: emptyLkFilters(),
      sheet: null,     // null | "sort" | "filter"
      draft: null,     // filters being edited in the filter sheet
      open: { strain: true }
    },
    disc: { coupon: "", stdIdx: "" },
    mgr: { step: "auth", user: "", pin: "", mode: "amt", preset: null, custom: "" }
  };

  // ---------- helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function money(n) {
    var neg = n < 0;
    var s = "$" + Math.abs(n).toFixed(2);
    return neg ? "-" + s : s;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  // ---------- totals ----------
  function lineGross(it) { return it.unit * it.qty; }
  function lineDisc(it) { return it.discount ? it.discount.amt * it.qty : 0; }
  function lineNet(it) { return lineGross(it) + lineDisc(it); }

  function round2(n) { return Math.round(n * 100) / 100; }

  function calc() {
    var base = 0, disc = 0;
    MED.items.forEach(function (it) { base += lineGross(it); disc += lineDisc(it); });

    var adjDisc = 0, reward = 0, donation = 0;
    MED.adjustments.forEach(function (a) {
      if (a.kind === "reward") reward += a.amt;
      else if (a.kind === "donation") donation += a.amt;
      else adjDisc += a.amt;            // manual / coupon / standard discount
    });

    var discountTotal = disc + adjDisc;                    // shown in "Discounts" row
    var subtotal = base + discountTotal + reward;          // rewards reduce too
    var tax = subtotal * TAX_RATE;
    var total = subtotal + tax + donation;                 // donation adds on top
    var rounding = state.settings.rounding ? round2(Math.round(total) - total) : 0;
    total = round2(total + rounding);
    var paid = MED.payments.reduce(function (s, p) { return s + p.amount; }, 0);
    var due = Math.max(0, round2(total - paid));
    return {
      base: base, lineDisc: disc, adjDisc: adjDisc, reward: reward, donation: donation,
      discountTotal: discountTotal, subtotal: subtotal, tax: tax, rounding: rounding,
      total: total, paid: paid, due: due
    };
  }
  function isReturn() { return RETURN_TYPES.indexOf(MED.order.type) !== -1; }
  function isComplete() { return MED.order.status === "Complete"; }
  function isVoided() { return MED.order.status === "Voided"; }
  function roundingLabel(t) {
    if (!state.settings.rounding) return "—";
    return t.rounding === 0 ? money(0) : (t.rounding > 0 ? "+" : "") + money(t.rounding);
  }

  // batch pill colored by verification status (verified = green/check, changed = yellow/refresh, not verified = blue/scan)
  function statusPillHtml(st, batch) {
    var label = esc(batch);
    if (st === "verified") return '<span class="ext-chip ext-chip--verified">' + icon("check", 12) + label + '</span>';
    if (st === "changed") return '<span class="ext-chip ext-chip--changed">' + icon("arrowLeftRight", 12) + label + '</span>';
    return '<span class="ext-chip ext-chip--unverified">' + icon("scan", 12) + label + '</span>';
  }

  // batch status pill row for cart items
  function pillsHtml(it) {
    return '<div class="ext-pills">' + statusPillHtml(it.status, it.batch) + '</div>';
  }

  // meta text line: subcategory · size · strain (small dot dividers)
  function metaLineHtml(it) {
    var parts = [it.subcat, it.size, it.strain].filter(Boolean);
    if (!parts.length) return "";
    return '<div class="ext-line__meta">' +
      parts.map(function (p) { return '<span>' + esc(p) + '</span>'; }).join('<span class="ext-line__sep">·</span>') +
    '</div>';
  }

  // ======================================================
  // RENDER
  // ======================================================
  function render() {
    renderTopbar();
    renderCust();
    renderOrder();
    renderRail();
  }

  function renderTopbar() {
    var s = STORE;
    $("#extTopbar").innerHTML =
      '<button class="ext-topbar__icon" id="btnMenu" aria-label="Menu">' + icon("menu", 19) + '</button>' +
      '<span class="ext-topbar__spacer"></span>' +
      '<div class="ext-topbar__store">' +
        '<span class="st"><b>' + esc(s.number) + '</b> · ' + esc(s.name) + '</span><span class="sep"></span>' +
        '<span class="st">' + esc(s.pos) + '</span><span class="sep"></span>' +
        '<span class="st ext-regstatus is-' + esc(s.status.toLowerCase()) + '">' + esc(s.status) + '</span><span class="sep"></span>' +
        '<button class="st ext-topbar__user" id="btnLogout" title="Log out ' + esc(s.user) + '" aria-label="Log out">' +
          '<span>' + esc(s.user) + '</span>' + icon("logout", 14) + '</button>' +
      '</div>' +
      '<button class="ext-topbar__icon" id="btnClassic" aria-label="Classic View" title="Classic View">' + icon("refreshCcw", 18) + '</button>';
  }

  function renderCust() {
    var p = MED.patient;
    var tier = p.tier
      ? '<span class="ext-tier ' + (TIER_CLASS[p.tier] || "") + '">' + icon("star", 12) + " " + esc(p.tier) + "</span>"
      : "";
    var noteCount = (p.notes || []).length;
    var noteBadge = noteCount ? '<span class="ext-cust__count">' + noteCount + '</span>' : "";
    var settingsOn = ORDER_SETTINGS.filter(function (s) { return state.settings[s.k]; }).length;
    var settingsBadge = settingsOn ? '<span class="ext-cust__count">' + settingsOn + '</span>' : "";
    $("#extCust").innerHTML =
      '<div class="ext-cust__top">' +
        '<span class="ext-cust__name">' + esc(p.name) + '</span>' + tier +
        '<div class="ext-cust__actions">' +
          '<button class="ext-cust__btn" data-open="notes" aria-label="Customer notes" title="Notes">' + icon("note", 19) + noteBadge + '</button>' +
          '<button class="ext-cust__btn" data-open="enroll" aria-label="Manage enrollment &amp; preferences" title="Enrollment &amp; preferences">' + icon("userRoundCog", 19) + '</button>' +
          '<button class="ext-cust__btn" data-open="actions" aria-label="Order settings" title="Order settings">' + icon("settings", 19) + settingsBadge + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="ext-cust__meta ext-cust__metarow">' +
        '<span class="cm" title="Date of birth">' + icon("cake", 14) + '<b>' + esc(p.dob) + '</b></span><span class="sep"></span>' +
        '<span class="cm" title="Med ID">' + icon("idCard", 14) + '<b>' + esc(p.medId) + '</b></span><span class="sep"></span>' +
        '<span class="cm">' + icon("phone", 14) + esc(p.phone) + '</span><span class="sep"></span>' +
        '<span class="cm">' + icon("home", 14) + esc(p.address) + '</span><span class="sep"></span>' +
        '<span class="cm">Credits <b>' + money(p.credits) + '</b></span><span class="sep"></span>' +
        '<span class="cm">' + icon("star", 14) + '<b>' + p.rewards + '</b> pts</span>' +
      '</div>';
  }

  function lineHtml(it) {
    var hasDisc = lineDisc(it) < 0;
    var priceHtml = hasDisc
      ? '<div class="ext-line__price">' + money(lineNet(it)) + '</div><div class="ext-line__was">' + money(lineGross(it)) + '</div>'
      : '<div class="ext-line__price">' + money(lineGross(it)) + '</div>';
    var discHtml = it.discount
      ? '<div class="ext-linedisc">' + icon("tag", 13) +
          '<span class="amt">' + money(it.discount.amt * it.qty) + '</span>' +
          '<span class="lbl">' + esc(it.discount.label) + '</span>' +
        '</div>'
      : '<span class="ext-linedisc ext-linedisc--none"></span>';
    return '<div class="ext-line" data-line="' + it.id + '">' +
      '<div class="ext-line__top">' +
        '<div class="ext-line__main">' +
          '<div class="ext-line__brand">' + esc(it.brand) + '</div>' +
          '<div class="ext-line__name">' + esc(it.name) + '</div>' +
          metaLineHtml(it) +
          pillsHtml(it) +
        '</div>' +
        '<div class="ext-line__right">' +
          priceHtml +
          '<div class="ext-qty">' +
            '<button data-qty="dec" data-id="' + it.id + '">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button data-qty="inc" data-id="' + it.id + '">+</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ext-line__bottom">' +
        discHtml +
        '<button class="ext-line__x" data-remove="' + it.id + '" aria-label="Remove">' + icon("x", 16) + '</button>' +
      '</div>' +
    '</div>';
  }

  function renderOrder() {
    var itemsHtml = MED.items.length
      ? MED.items.map(lineHtml).join("")
      : '<div class="ext-empty">No items yet — tap <b>Add Item</b> to look up a product.</div>';

    var printBtns = isComplete()
      ? [{ k: "email", ic: "mail", t: "Email Receipt" }].concat(RECEIPTS)
      : RECEIPTS;
    var recBtns = printBtns.map(function (b) {
      return '<button class="ext-rbtn" data-receipt="' + b.k + '" title="' + b.t + '" aria-label="' + b.t + '">' + icon(b.ic, 18) + '</button>';
    }).join("");

    $("#extOrder").innerHTML =
      '<div class="ext-card">' +
        '<div class="ext-card__head">' +
          '<h3>Item Overview</h3><span class="count">(' + MED.items.length + ')</span>' +
          '<div class="right">' +
            '<span class="ext-ostatus ' + (ORDER_STATUS_CLASS[MED.order.status] || "is-progress") + '">' + esc(MED.order.status) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ext-carttools">' +
          '<button class="ext-btn ext-btn--primary" data-open="lookup">' + icon("plus", 16) + 'Add Item</button>' +
          '<span class="ext-carttools__spacer"></span>' +
          recBtns +
        '</div>' +
        '<div class="ext-items">' + itemsHtml + '</div>' +
      '</div>';
  }

  // ---- right rail: allotment summary, discounts bar, totals, anchored tender ----
  function renderRail() {
    var t = calc();
    var a = MED.allotSummary;

    var rows = [
      ["Subtotal", money(t.base), ""],
      ["Discounts", money(t.discountTotal), t.discountTotal ? "is-disc" : ""],
      ["Tax", money(t.tax), ""],
      ["Rounding", roundingLabel(t), ""]
    ];
    var totRows = rows.map(function (r) {
      return '<div class="ext-trow' + (r[2] ? " " + r[2] : "") + '"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>';
    }).join("");

    // tender button: sale vs return (issue store credit directly)
    var tenderBtn;
    if (isVoided()) {
      tenderBtn = '<button class="ext-tenderbtn" disabled><span>Order Voided</span></button>';
    } else if (isReturn()) {
      tenderBtn = state.creditIssued
        ? '<button class="ext-tenderbtn" disabled>' + icon("check", 18) + '<span>Store Credit Issued</span><span class="ext-tenderbtn__amt">' + money(state.creditIssued) + '</span></button>'
        : '<button class="ext-tenderbtn" id="issueCreditBtn"' + (t.total <= 0 ? " disabled" : "") + '><span>Issue Store Credit</span>' +
            '<span class="ext-tenderbtn__amt">' + money(t.total) + '</span></button>';
    } else {
      tenderBtn = '<button class="ext-tenderbtn" id="tenderBtn"' + (t.due <= 0 ? " disabled" : "") + '>' +
        '<span>' + (t.due <= 0 ? "Paid in Full" : "Tender Payment") + '</span>' +
        (t.due > 0 ? '<span class="ext-tenderbtn__amt">' + money(t.due) + '</span>' : '') +
      '</button>';
    }

    $("#extRail").innerHTML =
      '<div class="ext-rail__scroll">' +
        '<section class="ext-sec ext-ordertop">' +
          '<span class="ext-ordertop__num">Order #' + esc(MED.order.number) + '</span>' +
          '<button class="ext-ordertype" data-open="ordertype">' + icon(ORDER_TYPE_ICON[MED.order.type] || "user", 16) +
            '<span>' + esc(MED.order.type) + '</span>' + icon("chevronDown", 14) + '</button>' +
        '</section>' +
        '<section class="ext-sec ext-allot-sec">' +
          '<div class="ext-rcard__head"><h3>Allotment</h3>' +
            '<button class="ext-link" data-open="allot">Show all forms ' + icon("chevronRight", 14) + '</button></div>' +
          '<div class="ext-allot__bar"><div class="ext-allot__fill" style="width:' + a.pct + '%"></div></div>' +
          '<div class="ext-allot__stats"><span><b>' + esc(a.used) + '</b> used</span>' +
            '<span class="r"><b>' + esc(a.remaining) + '</b> remaining</span></div>' +
        '</section>' +
      '</div>' +

      '<div class="ext-rail__foot">' +
        '<div class="ext-discbar">' +
          '<button class="ext-discbar__main" data-open="disc">' +
            '<span class="ext-discbar__ic">' + icon("tag", 17) + '</span>' +
            '<span class="ext-discbar__label">Discounts</span>' +
            '<span class="ext-discbar__meta ext-discbar__meta--add">+</span>' +
          '</button>' +
          '<button class="ext-discbar__mgr" data-open="mgr" title="Manager discount" aria-label="Manager discount">' +
            icon("lock", 16) +
          '</button>' +
        '</div>' +
        '<div class="ext-foot-main">' +
          '<div class="ext-paydetails">' +
            '<div class="ext-totrows">' + totRows + '</div>' +
            '<div class="ext-trow ext-trow--total"><span>Order Total</span><b>' + money(t.total) + '</b></div>' +
          '</div>' +
          tenderBtn +
        '</div>' +
      '</div>';
  }

  // ======================================================
  // OVERLAYS (modals + drawers)
  // ======================================================
  function renderOverlay() {
    var ov = $("#extOverlay");
    if (!state.overlay) {
      ov.hidden = true;
      ov.className = "ext-ov";
      ov.innerHTML = "";
      document.body.classList.remove("ext-noscroll");
      return;
    }
    var kind, html;
    if (state.overlay === "pay") { kind = "modal"; html = payHtml(); }
    else if (state.overlay === "lookup") { kind = "modal"; html = lookupHtml(); }
    else if (state.overlay === "notes") { kind = "modal"; html = notesHtml(); }
    else if (state.overlay === "ordertype") { kind = "modal"; html = orderTypeHtml(); }
    else if (state.overlay === "actions") { kind = "modal"; html = orderActionsHtml(); }
    else if (state.overlay === "allot") { kind = "drawer"; html = allotDrawerHtml(); }
    else if (state.overlay === "enroll") { kind = "drawer"; html = enrollDrawerHtml(); }
    else if (state.overlay === "mgr") { kind = "modal"; html = mgrHtml(); }
    else if (state.overlay === "menu") { kind = "drawer-left"; html = menuHtml(); }
    else { kind = "drawer"; html = discDrawerHtml(); }
    ov.className = "ext-ov is-on ext-ov--" + kind;
    ov.innerHTML = html;
    ov.hidden = false;
    document.body.classList.add("ext-noscroll");
  }
  function openPay() {
    if (calc().due <= 0) { toast("Nothing due"); return; }
    state.overlay = "pay"; state.payMethod = "Cash"; state.payBuffer = "";
    renderOverlay();
  }
  function closeOverlay() { state.overlay = null; renderOverlay(); }
  // The shared demo site only publishes the extension, so Classic View may not exist there.
  function openClassic() {
    var url = "../classic/store-management.html";
    fetch(url, { method: "HEAD" })
      .then(function (r) { if (r.ok) window.location.href = url; else throw 0; })
      .catch(function () { toast("Classic View isn't included in this demo"); });
  }

  // ---- payment: full-page tender ----
  var PAY_ICONS = { Cash: "banknote", Debit: "card", CanPay: "badgeDollarSign", "Store Credit": "gift", Rewards: "star", Donation: "heart" };
  function isTender(m) { return MED.tenders.indexOf(m) !== -1; }
  function rewardPtsUsed() {
    return MED.adjustments.reduce(function (s, a) { return s + (a.kind === "reward" ? (a.pts || 0) : 0); }, 0);
  }
  function storeCreditLeft() {
    var used = MED.payments.reduce(function (s, p) { return s + (p.method === "Store Credit" ? p.amount : 0); }, 0);
    return round2(Math.max(0, MED.patient.credits - used));
  }
  function currentDonation() {
    return MED.adjustments.filter(function (a) { return a.kind === "donation"; })[0] || null;
  }
  function keypadHtml() {
    return ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"].map(function (k) {
      if (k === "back") return '<button class="ext-key ext-key--back" data-key="back" aria-label="Delete">&#9003;</button>';
      return '<button class="ext-key" data-key="' + k + '">' + k + '</button>';
    }).join("");
  }
  function amountHtml(label) {
    var typed = state.payBuffer;
    return '<div class="ext-payfull__amtwrap">' +
      '<div class="ext-payfull__amtlabel">' + label + '</div>' +
      '<div class="ext-payfull__amount ' + (typed !== "" ? "is-typed" : "") + '"><span class="cur">$</span><span id="payDisplay">' + esc(typed === "" ? "0.00" : typed) + '</span></div>' +
    '</div>';
  }

  // main column: tender keypad
  function payTenderMainHtml(t) {
    var amt = parseFloat(state.payBuffer || "0") || 0;
    var useVal = amt > 0 ? amt : t.due;
    var paidInFull = t.due <= 0;
    var presets = [
      { k: "exact", label: "Exact", sub: money(t.due), cls: "ext-preset--exact" },
      { k: "20", label: "$20" },
      { k: "50", label: "$50" },
      { k: "100", label: "$100" }
    ].map(function (p) {
      return '<button class="ext-preset ' + (p.cls || "") + '" data-preset="' + p.k + '">' +
        '<span class="v">' + p.label + '</span>' + (p.sub ? '<span class="s">' + p.sub + '</span>' : '') + '</button>';
    }).join("");
    return amountHtml("Amount to apply · " + esc(state.payMethod)) +
      '<div class="ext-presets ext-presets--row">' + presets + '</div>' +
      '<div class="ext-keypad ext-keypad--pay">' + keypadHtml() + '</div>' +
      '<button class="ext-payfull__apply" id="payApply"' + (paidInFull ? " disabled" : "") + '>' +
        (paidInFull ? 'Balance fully paid' : 'Apply ' + money(useVal) + ' · ' + esc(state.payMethod)) +
      '</button>';
  }

  // main column: loyalty rewards (all tiers visible, tap to apply / remove)
  function payRewardsMainHtml() {
    var bal = MED.patient.rewards;
    var used = rewardPtsUsed();
    var left = bal - used;
    var cards = REWARDS.map(function (r, i) {
      var applied = MED.adjustments.some(function (a) { return a.kind === "reward" && a.rewardIdx === i; });
      var afford = r.pts <= left;
      var cls = applied ? " is-on" : (afford ? "" : " is-locked");
      var status = applied
        ? icon("check", 14) + 'Applied · tap to remove'
        : (afford ? 'Tap to apply' : (r.pts - left).toLocaleString() + ' more pts needed');
      return '<button class="ext-rwd' + cls + '" data-reward="' + i + '"' + (!applied && !afford ? " disabled" : "") + '>' +
        '<span class="ext-rwd__amt">' + esc(r.label) + '</span>' +
        '<span class="ext-rwd__pts">' + r.pts.toLocaleString() + ' pts</span>' +
        '<span class="ext-rwd__state">' + status + '</span>' +
      '</button>';
    }).join("");
    return '<div class="ext-rwdbal">' +
        '<span class="ext-rwdbal__ic">' + icon("star", 22) + '</span>' +
        '<div class="ext-rwdbal__m"><span class="ext-rwdbal__lbl">Points available</span>' +
          '<b>' + left.toLocaleString() + ' <small>pts</small></b></div>' +
        '<div class="ext-rwdbal__r"><span>Balance ' + bal.toLocaleString() + ' pts</span>' +
          '<span>' + (used ? used.toLocaleString() + ' pts applied' : 'No rewards applied') + '</span></div>' +
      '</div>' +
      '<div class="ext-rwdgrid">' + cards + '</div>';
  }

  // main column: donation (presets or custom amount on the keypad)
  function payDonationMainHtml() {
    var cur = currentDonation();
    var amt = parseFloat(state.payBuffer || "0") || 0;
    var presets = DONATION_PRESETS.map(function (v) {
      var on = state.payBuffer !== "" && amt === v;
      return '<button class="ext-preset' + (on ? " is-on" : "") + '" data-donpreset="' + v + '"><span class="v">$' + v + '</span></button>';
    }).join("");
    var curRow = cur
      ? '<div class="ext-doncur"><span class="ext-doncur__ic">' + icon("heart", 15) + '</span>' +
          '<span class="ext-doncur__m">Donation on this order <b>' + money(cur.amt) + '</b></span>' +
          '<button class="ext-doncur__rm" data-donremove>Remove</button></div>'
      : '';
    var label = amt > 0 ? (cur ? 'Update donation to ' + money(amt) : 'Add ' + money(amt) + ' donation') : 'Choose or enter an amount';
    return curRow +
      amountHtml("Donation amount") +
      '<div class="ext-presets ext-presets--row">' + presets + '</div>' +
      '<div class="ext-keypad ext-keypad--pay">' + keypadHtml() + '</div>' +
      '<button class="ext-payfull__apply" id="donApply"' + (amt > 0 ? "" : " disabled") + '>' + label + '</button>';
  }

  function payHtml() {
    var t = calc();
    var paidInFull = t.due <= 0;
    var mode = state.payMethod;

    // tender tiles + rewards / donation tiles
    var tiles = MED.tenders.concat(["Rewards", "Donation"]).map(function (m) {
      var sub = "";
      if (m === "Rewards") sub = '<span class="ext-paytype__sub">' + (MED.patient.rewards - rewardPtsUsed()).toLocaleString() + ' pts</span>';
      else if (m === "Store Credit") sub = '<span class="ext-paytype__sub">' + money(storeCreditLeft()) + ' available</span>';
      else if (m === "Donation" && currentDonation()) sub = '<span class="ext-paytype__sub">' + money(currentDonation().amt) + '</span>';
      return '<button class="ext-paytype' + (mode === m ? " is-on" : "") + (isTender(m) ? "" : " ext-paytype--adj") + '" data-paytab="' + esc(m) + '">' +
        '<span class="ext-paytype__ic">' + icon(PAY_ICONS[m] || "card", 22) + '</span>' +
        '<span class="ext-paytype__label">' + esc(m) + '</span>' + sub +
      '</button>';
    }).join("");

    var main = mode === "Rewards" ? payRewardsMainHtml()
      : mode === "Donation" ? payDonationMainHtml()
      : payTenderMainHtml(t);

    // order breakdown
    var brk = [
      ["Subtotal", money(t.base), ""],
      ["Discounts", money(t.discountTotal), t.discountTotal ? "is-disc" : ""]
    ];
    if (t.reward < 0) brk.push(["Rewards", money(t.reward), "is-disc"]);
    brk.push(["Tax", money(t.tax), ""]);
    if (t.donation > 0) brk.push(["Donation", money(t.donation), ""]);
    if (state.settings.rounding) brk.push(["Rounding", roundingLabel(t), ""]);
    var brkRows = brk.map(function (r) {
      return '<div class="ext-paysum__row ' + r[2] + '"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>';
    }).join("");

    // applied payments — one line per tender type
    var ledger = MED.payments.length
      ? MED.payments.map(function (p, i) {
          return '<div class="ext-payrow">' +
            '<span class="ext-payrow__ic">' + icon(PAY_ICONS[p.method] || "card", 15) + '</span>' +
            '<span class="ext-payrow__m">' + esc(p.method) + '</span>' +
            '<span class="ext-payrow__amt">' + money(p.amount) + '</span>' +
            '<button class="ext-payrow__void" data-voidpay="' + i + '" aria-label="Void ' + esc(p.method) + ' payment">' + icon("x", 15) + '</button>' +
          '</div>';
        }).join("")
      : '<div class="ext-paysum__none">No payments applied yet.</div>';

    var change = MED.payments.reduce(function (s, p) { return s + (p.change || 0); }, 0);

    return '<div class="ext-modal ext-payfull" role="dialog" aria-modal="true" aria-label="Tender payment">' +
      '<div class="ext-payfull__head">' +
        '<button class="ext-payfull__back" data-ovclose>' + icon("arrowLeft", 18) + 'Back to cart</button>' +
        '<div class="ext-payfull__title">Tender Payment</div>' +
        '<div class="ext-payfull__hdue"><span>Balance due</span><b>' + money(t.due) + '</b></div>' +
      '</div>' +
      '<div class="ext-payfull__body">' +
        '<div class="ext-payfull__main">' +
          '<div class="ext-paytypes">' + tiles + '</div>' +
          main +
        '</div>' +
        '<aside class="ext-payfull__side">' +
          '<div class="ext-payfull__sidebody">' +
            '<div class="ext-paysum">' +
              '<h4>Order summary</h4>' +
              brkRows +
              '<div class="ext-paysum__row ext-paysum__row--total"><span>Order Total</span><b>' + money(t.total) + '</b></div>' +
            '</div>' +
            '<div class="ext-paysum__split">' +
              '<div class="ext-paysum__head"><span>Payments</span>' + (MED.payments.length ? '<span class="ext-paysum__cnt">' + MED.payments.length + '</span>' : '') + '</div>' +
              ledger +
            '</div>' +
            '<div class="ext-paysum__tallies">' +
              '<div class="ext-paysum__row"><span>Amount paid</span><b>' + money(t.paid) + '</b></div>' +
              (change > 0 ? '<div class="ext-paysum__row is-change"><span>Change due</span><b>' + money(change) + '</b></div>' : '') +
              '<div class="ext-paysum__row ext-paysum__row--due"><span>Balance due</span><b>' + money(t.due) + '</b></div>' +
            '</div>' +
          '</div>' +
          '<div class="ext-payfull__sidefoot">' +
            '<button class="ext-payfull__finish" id="payFinish"' + (paidInFull ? "" : " disabled") + '>' + icon("check", 17) + 'Complete sale</button>' +
          '</div>' +
        '</aside>' +
      '</div>' +
    '</div>';
  }
  function applyPayment() {
    var t = calc();
    if (!isTender(state.payMethod)) return;
    if (t.due <= 0) { toast("Nothing due"); return; }
    var method = state.payMethod;
    var amt = parseFloat(state.payBuffer || "0") || 0;
    var tendered = amt > 0 ? amt : t.due;
    if (tendered <= 0) { toast("Enter an amount"); return; }
    if (method === "Store Credit") {
      var credit = storeCreditLeft();
      if (credit <= 0) { toast("No store credit available"); return; }
      if (tendered > credit) { tendered = credit; toast("Limited to " + money(credit) + " store credit"); }
    }
    var applied = round2(Math.min(tendered, t.due));             // amount toward balance
    var change = (method === "Cash" && tendered > t.due) ? round2(tendered - t.due) : 0;
    var line = MED.payments.filter(function (p) { return p.method === method; })[0];
    if (line) {
      line.amount = round2(line.amount + applied);
      line.tendered = round2(line.tendered + tendered);
      line.change = round2(line.change + change);
    } else {
      MED.payments.push({ method: method, amount: applied, tendered: tendered, change: change });
    }
    state.payBuffer = "";
    render();          // keep cart rail totals in sync behind the page
    renderOverlay();   // refresh the tender page
    var nd = calc().due;
    if (nd <= 0) toast(change > 0 ? "Paid in full · Change " + money(change) : "Paid in full");
    else toast("Applied " + money(applied) + " · " + money(nd) + " remaining");
  }
  function editBuffer(k) {
    var b = state.payBuffer;
    if (k === "back") { state.payBuffer = b.slice(0, -1); return; }
    if (k === ".") {
      if (b.indexOf(".") !== -1) return;
      state.payBuffer = (b === "" ? "0" : b) + ".";
      return;
    }
    // digit
    if (b.indexOf(".") !== -1 && b.split(".")[1].length >= 2) return; // cap 2 decimals
    if (b === "0") b = ""; // no leading zero
    state.payBuffer = b + k;
  }
  function toggleReward(i) {
    var r = REWARDS[i];
    if (!r) return;
    var existing = MED.adjustments.filter(function (a) { return a.kind === "reward" && a.rewardIdx === i; })[0];
    if (existing) {
      MED.adjustments = MED.adjustments.filter(function (a) { return a !== existing; });
      toast(r.label + " reward removed");
    } else {
      if (r.pts > MED.patient.rewards - rewardPtsUsed()) { toast("Not enough points"); return; }
      if (r.amt > calc().due) { toast("Reward is more than the balance due"); return; }
      pushAdj("reward", r.label + " reward", -r.amt, { pts: r.pts, rewardIdx: i });
      toast(r.label + " reward applied");
    }
    render(); renderOverlay();
  }
  function applyDonation() {
    var v = round2(parseFloat(state.payBuffer || "0") || 0);
    if (v <= 0) { toast("Enter a donation amount"); return; }
    MED.adjustments = MED.adjustments.filter(function (a) { return a.kind !== "donation"; });
    pushAdj("donation", "Donation", v);
    state.payBuffer = "";
    render(); renderOverlay();
    toast("Donation of " + money(v) + " added");
  }
  function removeDonation() {
    MED.adjustments = MED.adjustments.filter(function (a) { return a.kind !== "donation"; });
    render(); renderOverlay();
    toast("Donation removed");
  }

  // ---- allotment "show all" drawer ----
  function allotRowHtml(a) {
    var label = esc(a.key) + (a.inOrder ? ' <span class="ext-allot__in">(' + esc(a.inOrder) + ' in order)</span>' : "");
    return '<div class="ext-allot__item">' +
      '<div class="ext-allot__row"><span class="lbl">' + label + '</span><span class="left">' + esc(a.left) + ' left</span></div>' +
      '<div class="ext-allot__bar"><div class="ext-allot__fill" style="width:' + a.pct + '%"></div></div>' +
    '</div>';
  }
  function allotDrawerHtml() {
    return '<div class="ext-drawer" role="dialog" aria-modal="true" aria-label="All allotment forms">' +
      '<div class="ext-drawer__head"><h3>Allotment — all forms</h3>' +
        '<button class="ext-drawer__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-drawer__body">' + MED.allotments.map(allotRowHtml).join("") + '</div>' +
    '</div>';
  }

  // ---- enrollment & preferences drawer ----
  function enrollDrawerHtml() {
    var p = MED.patient;
    var rows = [
      { k: "rewards", label: "Loyalty Rewards", desc: "Earn and redeem points on every purchase." },
      { k: "email", label: "Email Receipts & Offers", desc: "Send receipts and promotions by email." },
      { k: "sms", label: "SMS Notifications", desc: "Order-ready texts and reminders." },
      { k: "app", label: "Mobile App", desc: "Link the patient's mobile app account." }
    ].map(function (r) {
      var on = !!p.enroll[r.k];
      return '<div class="ext-enrow">' +
        '<div class="ext-enrow__txt"><div class="ext-enrow__label">' + esc(r.label) + '</div>' +
          '<div class="ext-enrow__desc">' + esc(r.desc) + '</div></div>' +
        '<button class="ext-switch ' + (on ? "is-on" : "") + '" data-enroll="' + r.k + '" role="switch" aria-checked="' + on + '" aria-label="' + esc(r.label) + '"><span class="ext-switch__dot"></span></button>' +
      '</div>';
    }).join("");
    return '<div class="ext-drawer" role="dialog" aria-modal="true" aria-label="Enrollment and preferences">' +
      '<div class="ext-drawer__head"><h3>Enrollment &amp; Preferences</h3>' +
        '<button class="ext-drawer__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-drawer__body">' +
        '<div class="ext-enrow__name">' + esc(p.name) + '</div>' + rows +
      '</div>' +
    '</div>';
  }

  // ---- hamburger sidebar ----
  var SIDE_NAV = [
    { id: "waitlist", label: "Waitlist", icon: "queue", soon: true },
    { id: "customers", label: "Customers", icon: "users" },
    { id: "orders", label: "Orders", icon: "receipt" },
    { id: "inventory", label: "Inventory", icon: "package" },
    { id: "register", label: "Register", icon: "monitor" },
    { id: "audit", label: "Audit", icon: "clipboard" }
  ];
  function menuHtml() {
    var items = SIDE_NAV.map(function (n) {
      return '<button class="ext-sidenav__item' + (n.soon ? " is-soon" : "") + '" data-nav="' + n.id + '"' +
        (n.soon ? ' data-soon="1"' : "") + '>' +
        '<span class="ext-sidenav__ic">' + icon(n.icon, 26) + '</span>' +
        '<span class="ext-sidenav__label">' + esc(n.label) + '</span>' +
        (n.soon ? '<span class="ext-sidenav__soon">Coming soon</span>' : '') +
      '</button>';
    }).join("");
    return '<nav class="ext-sidenav" role="dialog" aria-modal="true" aria-label="Main menu">' +
      '<div class="ext-sidenav__head">' +
        '<div class="ext-sidenav__title">Menu</div>' +
        '<button class="ext-drawer__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button>' +
      '</div>' +
      '<div class="ext-sidenav__list">' + items + '</div>' +
      '<div class="ext-sidenav__version">OMS+ v' + esc(APP_VERSION) + '</div>' +
    '</nav>';
  }

  // ---- discounts drawer ----
  function discAppliedRowHtml(a) {
    var kindIcon = a.kind === "reward" ? "star" : a.kind === "donation" ? "heart" : "tag";
    return '<div class="ext-dapp__row">' +
      '<span class="ext-dapp__ic ext-dapp__ic--' + a.kind + '">' + icon(kindIcon, 13) + '</span>' +
      '<span class="ext-dapp__label">' + esc(a.label) + '</span>' +
      '<span class="ext-dapp__amt ' + (a.amt < 0 ? "is-neg" : "is-pos") + '">' + (a.amt > 0 ? "+" : "") + money(a.amt) + '</span>' +
      '<button class="ext-dapp__del" data-deladj="' + a.id + '" aria-label="Remove">' + icon("x", 14) + '</button>' +
    '</div>';
  }
  function discDrawerHtml() {
    var d = state.disc;
    var coupon =
      '<div class="ext-dgroup__label">Coupon code</div>' +
      '<div class="ext-drow2">' +
        '<input id="discCoupon" class="ext-dinput" type="text" placeholder="Enter coupon code" value="' + esc(d.coupon) + '" autocomplete="off">' +
        '<button class="ext-dapply ext-dapply--icon" data-discapply="coupon" aria-label="Apply coupon">' + icon("check", 16) + '</button>' +
      '</div>';

    var listHtml = STD_DISCOUNTS.map(function (s, i) {
      var on = String(d.stdIdx) === String(i);
      return '<button class="ext-dlist__item' + (on ? " is-on" : "") + '" data-stdidx="' + i + '">' +
        '<span class="ext-dlist__dot"></span>' +
        '<span class="ext-dlist__name">' + esc(s.label) + '</span>' +
        '<span class="ext-dlist__pct">' + s.pct + '%</span>' +
      '</button>';
    }).join("");

    var adj = MED.adjustments.filter(function (a) { return a.kind === "discount"; });
    var total = adj.reduce(function (s, a) { return s + a.amt; }, 0);
    var applied = adj.length
      ? adj.map(discAppliedRowHtml).join("")
      : '<div class="ext-dapp__none">No discounts applied yet.</div>';

    return '<div class="ext-drawer ext-discdrawer" role="dialog" aria-modal="true" aria-label="Discounts">' +
      '<div class="ext-drawer__head"><h3>Discounts</h3>' +
        '<button class="ext-drawer__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-disc__top">' + coupon + '</div>' +
      '<div class="ext-dlist">' +
        '<div class="ext-dlist__label">Available discounts</div>' +
        listHtml +
      '</div>' +
      '<div class="ext-disc__applybar">' +
        '<button class="ext-dapply ext-dapply--block" data-discapply="standard">Apply discount</button>' +
      '</div>' +
      '<div class="ext-dapp">' +
        '<div class="ext-dapp__head">Applied <span class="ext-dapp__cnt">' + adj.length + '</span></div>' +
        '<div class="ext-dapp__list">' + applied + '</div>' +
        '<div class="ext-dapp__foot"><span>Total discount</span>' +
          '<b>' + (total !== 0 ? money(total) : "—") + '</b></div>' +
      '</div>' +
    '</div>';
  }

  var MGR_AMT_PRESETS = [5, 10, 25, 30];
  var MGR_PCT_PRESETS = [5, 10, 20, 25];
  function mgrHtml() {
    var m = state.mgr;
    if (m.step !== "apply") {
      return '<div class="ext-modal ext-mgr" role="dialog" aria-modal="true" aria-label="Manager authorization">' +
        '<div class="ext-pay__head"><div class="ext-pay__title">Manager authorization</div>' +
          '<button class="ext-pay__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
        '<div class="ext-mgr__body">' +
          '<p class="ext-mgr__hint">Enter a manager username and PIN to apply a manual discount.</p>' +
          '<label class="ext-mgr__field"><span>Username</span>' +
            '<input id="mgrUser" class="ext-dinput" type="text" autocomplete="username" value="' + esc(m.user) + '" placeholder="Manager username"></label>' +
          '<label class="ext-mgr__field"><span>PIN</span>' +
            '<input id="mgrPin" class="ext-dinput" type="password" inputmode="numeric" autocomplete="current-password" value="' + esc(m.pin) + '" placeholder="••••"></label>' +
          '<button class="ext-btn ext-btn--primary ext-btn--block" data-mgrauth>' + icon("lock", 16) + 'Authorize</button>' +
        '</div>' +
      '</div>';
    }

    var isPct = m.mode === "pct";
    var presets = (isPct ? MGR_PCT_PRESETS : MGR_AMT_PRESETS).map(function (v) {
      var on = String(m.preset) === String(v);
      var label = isPct ? v + "%" : "$" + v;
      return '<button class="ext-mgrpreset' + (on ? " is-on" : "") + '" data-mgrpreset="' + v + '">' + label + '</button>';
    }).join("") +
      '<button class="ext-mgrpreset' + (m.preset === "custom" ? " is-on" : "") + '" data-mgrpreset="custom">Custom</button>';

    var custom = m.preset === "custom"
      ? '<div class="ext-drow2 ext-mgr__custom"><div class="ext-dinwrap"><span class="ext-dinpre">' + (isPct ? "%" : "$") + '</span>' +
          '<input id="mgrCustom" class="ext-dinput" type="text" inputmode="decimal" placeholder="' + (isPct ? "0" : "0.00") + '" value="' + esc(m.custom) + '"></div></div>'
      : "";

    return '<div class="ext-modal ext-mgr" role="dialog" aria-modal="true" aria-label="Manager discount">' +
      '<div class="ext-pay__head"><div class="ext-pay__title">Manager discount</div>' +
        '<button class="ext-pay__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-mgr__body">' +
        '<div class="ext-mgr__tiles">' +
          '<button class="ext-mgrtile' + (!isPct ? " is-on" : "") + '" data-mgrmode="amt" aria-label="$ Discount">' +
            '<span class="ext-mgrtile__sym">$</span><span class="ext-mgrtile__label">$ Discount</span></button>' +
          '<button class="ext-mgrtile' + (isPct ? " is-on" : "") + '" data-mgrmode="pct" aria-label="% Discount">' +
            '<span class="ext-mgrtile__sym">%</span><span class="ext-mgrtile__label">% Discount</span></button>' +
        '</div>' +
        '<div class="ext-dgroup__label">' + (isPct ? "Percent off" : "Amount off") + '</div>' +
        '<div class="ext-mgrpresets">' + presets + '</div>' +
        custom +
        '<button class="ext-btn ext-btn--primary ext-btn--block" data-mgrapply>Apply discount</button>' +
      '</div>' +
    '</div>';
  }
  function pushAdj(kind, label, amt, extra) {
    var a = { id: "A" + (adjSeq++), kind: kind, label: label, amt: round2(amt) };
    if (extra) Object.keys(extra).forEach(function (k) { a[k] = extra[k]; });
    MED.adjustments.push(a);
  }
  function applyDiscount(type) {
    var t = calc();
    var pctBase = t.base + t.lineDisc;   // subtotal before coupon/standard adjustments
    if (type === "coupon") {
      var code = (state.disc.coupon || "").trim().toUpperCase();
      if (!code) { toast("Enter a coupon code"); return; }
      if (!(code in COUPONS)) { toast("Invalid coupon code"); return; }
      pushAdj("discount", "Coupon " + code, -COUPONS[code]);
      state.disc.coupon = "";
    } else if (type === "standard") {
      var i = state.disc.stdIdx;
      if (i === "" || i == null) { toast("Select a discount"); return; }
      var s = STD_DISCOUNTS[parseInt(i, 10)];
      if (!s) { toast("Select a discount"); return; }
      pushAdj("discount", s.label + " " + s.pct + "%", -(pctBase * (s.pct / 100)));
      state.disc.stdIdx = "";
    }
    render(); renderOverlay();
    toast("Applied");
  }
  function authorizeMgr() {
    var u = (state.mgr.user || "").trim();
    var pin = state.mgr.pin || "";
    if (!u) { toast("Enter a username"); return; }
    if (pin.length < 4) { toast("Enter a 4-digit PIN"); return; }
    state.mgr.step = "apply";
    state.mgr.pin = "";
    state.mgr.preset = null;
    state.mgr.custom = "";
    renderOverlay();
    toast("Authorized");
  }
  function applyMgrDiscount() {
    var t = calc();
    var pctBase = t.base + t.lineDisc;
    var m = state.mgr;
    var v = m.preset === "custom"
      ? (parseFloat(m.custom || "0") || 0)
      : (parseFloat(m.preset) || 0);
    if (v <= 0) { toast(m.preset === "custom" ? "Enter an amount" : "Select an amount"); return; }
    if (m.mode === "pct") pushAdj("discount", "Manager discount (" + v + "%)", -(pctBase * (v / 100)));
    else pushAdj("discount", "Manager discount $" + v.toFixed(0), -v);
    state.mgr.preset = null;
    state.mgr.custom = "";
    state.mgr.step = "auth";
    closeOverlay();
    render();
    toast("Manager discount applied");
  }

  // ---- Add-products (material lookup) modal ----
  // products in the current search / suggested / category view (before subcategory + filters)
  function lkCategoryProducts() {
    var c = LK_CATEGORIES.find(function (x) { return x.label === state.lookup.cat; });
    return c && c.match ? PRODUCTS.filter(function (p) { return p.cat === c.match; }) : [];
  }
  function lkScope() {
    var q = (state.lookup.q || "").trim().toLowerCase();
    if (q) {
      return PRODUCTS.filter(function (p) {
        var hay = (p.name + " " + p.brand + " " + (p.strainName || "") + " " + p.size + " " + p.id + " " + (p.subcat || "") + " " + (p.strain || "")).toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    }
    if (state.lookup.suggest) {
      return AI_SUGGESTED.map(function (id) { return PRODUCTS.find(function (p) { return p.id === id; }); }).filter(Boolean);
    }
    if (state.lookup.cat) {
      var list = lkCategoryProducts();
      if (state.lookup.sub) list = list.filter(function (p) { return p.subcat === state.lookup.sub; });
      return list;
    }
    return PRODUCTS.slice();
  }
  function lkShowFilter(list) {
    var show = state.lookup.show;
    if (show === "In stock" || show === "Available") return list.filter(function (p) { return p.stock > 0; });
    if (show === "Unavailable") return list.filter(function (p) { return p.stock <= 0; });
    return list;
  }
  function lkFilterOpt(groupKey, optKey) {
    var g = LK_FILTERS.find(function (x) { return x.k === groupKey; });
    return g && g.opts ? g.opts.find(function (o) { return o.k === optKey; }) : null;
  }
  // THC % is not comparable for edibles (dosed in mg)
  function lkThcPct(p) { return p.cat === "Edibles" ? null : p.thc; }
  function lkApplyFilters(list, f) {
    return list.filter(function (p) {
      if (f.strain.length && f.strain.indexOf(p.strain) === -1) return false;
      if (f.brand.length && f.brand.indexOf(p.brand) === -1) return false;
      if (f.size.length && f.size.indexOf(p.size) === -1) return false;
      var o;
      if (f.thc && (o = lkFilterOpt("thc", f.thc))) { var th = lkThcPct(p); if (th == null || th < o.min) return false; }
      if (f.cbd && (o = lkFilterOpt("cbd", f.cbd))) { if ((p.cbd || 0) < o.min) return false; }
      if (f.price && (o = lkFilterOpt("price", f.price))) { if (p.price < o.min || p.price >= o.max) return false; }
      return true;
    });
  }
  function lkPopularity(p) { return (PRODUCTS.indexOf(p) * 37 + p.stock * 11) % 101; }
  function lkSort(list) {
    var k = state.lookup.sort;
    var idx = function (p) { return PRODUCTS.indexOf(p); };
    var thc = function (p) { var v = lkThcPct(p); return v == null ? -1 : v; };
    var cmp = {
      popular: function (a, b) { return lkPopularity(b) - lkPopularity(a); },
      newest: function (a, b) { return idx(b) - idx(a); },
      oldest: function (a, b) { return idx(a) - idx(b); },
      az: function (a, b) { return a.name.localeCompare(b.name); },
      za: function (a, b) { return b.name.localeCompare(a.name); },
      priceAsc: function (a, b) { return a.price - b.price; },
      priceDesc: function (a, b) { return b.price - a.price; },
      thcDesc: function (a, b) { return thc(b) - thc(a); },
      thcAsc: function (a, b) { return thc(a) - thc(b); }
    }[k];
    // suggested picks keep their curated order under "Most popular"
    if (!cmp || (k === "popular" && state.lookup.suggest && !state.lookup.q)) return list;
    return list.slice().sort(cmp);
  }
  function lkResults(filters) {
    return lkSort(lkApplyFilters(lkShowFilter(lkScope()), filters || state.lookup.filters));
  }
  function lookupProducts() { return lkResults().slice(0, 48); }
  function lkFilterCount(f) {
    return f.strain.length + f.brand.length + f.size.length + (f.thc ? 1 : 0) + (f.cbd ? 1 : 0) + (f.price ? 1 : 0);
  }
  // category tiles show until a search, category, or filter narrows the catalog
  function lkBrowsing() {
    return !state.lookup.q && !state.lookup.cat && !state.lookup.suggest && !lkFilterCount(state.lookup.filters);
  }
  function lkInOrder(prodId) {
    return MED.items.filter(function (x) { return x.prodId === prodId; }).reduce(function (s, x) { return s + x.qty; }, 0);
  }
  function lkCardHtml(p) {
    var n = lkInOrder(p.id);
    var stype = p.strain
      ? '<span class="ext-stype ext-stype--' + p.strain.toLowerCase() + '">' + esc(p.strain) + '</span>'
      : '<span class="ext-stype ext-stype--na">—</span>';
    var sub = esc(p.size) + (p.subcat ? ' · ' + esc(p.subcat) : '');
    return '<div class="ext-lk__card' + (n ? ' is-in' : '') + '">' +
      (n ? '<span class="ext-lk__inorder">' + n + ' in order</span>' : '') +
      '<div class="ext-lk__card-top">' + stype + '<span class="ext-lk__stock">' + p.stock + ' in stock</span></div>' +
      '<div class="ext-lk__card-name">' + esc(p.name) + '</div>' +
      '<div class="ext-lk__card-sub">' + sub + '</div>' +
      '<div class="ext-lk__card-sku">' + esc(p.brand) + ' · ' + esc(p.id) + '</div>' +
      '<div class="ext-lk__card-foot"><span class="ext-lk__price">' + money(p.price) + '</span>' +
        '<button class="ext-lk__add" data-add="' + esc(p.id) + '">' + icon("plus", 15) + 'Add</button></div>' +
    '</div>';
  }
  // subcategory drill-down chips for the selected category
  function lkSubsHtml() {
    if (state.lookup.q || state.lookup.suggest || !state.lookup.cat) return "";
    if (!lkCategoryProducts().length) return "";
    var all = lkApplyFilters(lkShowFilter(lkCategoryProducts()), state.lookup.filters);
    var counts = {};
    var order = [];
    all.forEach(function (p) {
      var s = p.subcat || "Other";
      if (!(s in counts)) { counts[s] = 0; order.push(s); }
      counts[s]++;
    });
    var chip = function (val, label, n) {
      var on = (state.lookup.sub || "") === val;
      return '<button class="ext-lk__sub' + (on ? " is-on" : "") + '" data-lksub="' + esc(val) + '">' +
        esc(label) + '<span class="n">' + n + '</span></button>';
    };
    return '<div class="ext-lk__subs">' +
      chip("", "All " + state.lookup.cat, all.length) +
      order.map(function (s) { return chip(s, s, counts[s]); }).join("") +
    '</div>';
  }
  function lookupContentHtml() {
    if (lkBrowsing()) {
      var tiles = LK_CATEGORIES.map(function (c) {
        return '<button class="ext-lk__tile ext-lk__tile--' + c.cls + '" data-lkcat="' + esc(c.label) + '">' +
          '<span class="ext-lk__tile-ic">' + icon(c.icon, 22) + '</span>' +
          '<span class="ext-lk__tile-label">' + esc(c.label) + '</span>' +
        '</button>';
      }).join("");
      return '<div class="ext-lk__browse-head">Browse by category</div>' +
        '<div class="ext-lk__tiles">' + tiles + '</div>';
    }
    var crumb = '<div class="ext-lk__crumb">' +
      '<button class="ext-lk__back" data-lkback>' + icon("chevronLeft", 15) + 'Categories</button>';
    if (state.lookup.q) crumb += '<span class="ext-lk__chip" data-lkclearq>Search: ' + esc(state.lookup.q) + icon("x", 13) + '</span>';
    else if (state.lookup.suggest) crumb += '<span class="ext-lk__chip ext-lk__chip--sugg">' + icon("sparkles", 13) + 'Suggested</span>';
    else if (state.lookup.cat) {
      crumb += '<span class="ext-lk__chip" data-lkclearcat>' + esc(state.lookup.cat) + icon("x", 13) + '</span>';
      if (state.lookup.sub) crumb += icon("chevronRight", 14) + '<span class="ext-lk__chip ext-lk__chip--sub" data-lkclearsub>' + esc(state.lookup.sub) + icon("x", 13) + '</span>';
    }
    else crumb += '<span class="ext-lk__chip ext-lk__chip--plain">All products</span>';
    var total = lkResults().length;
    crumb += '<span class="ext-lk__count">' + total + ' product' + (total === 1 ? "" : "s") + '</span>' + lkToolsHtml() + '</div>';
    var list = lookupProducts();
    var nFilters = lkFilterCount(state.lookup.filters);
    var grid = list.length
      ? '<div class="ext-lk__grid">' + list.map(lkCardHtml).join("") + '</div>'
      : '<div class="ext-lk__empty">' + icon("search", 26) + '<h4>No products found</h4>' +
          '<p>' + (nFilters ? 'No products match the current filters.' : 'Nothing matches here yet. Try another category or search term.') + '</p>' +
          (nFilters ? '<button class="ext-lk__clearf" data-lkclearfilters>Clear filters</button>' : '') + '</div>';
    return crumb + lkSubsHtml() + grid;
  }

  // ---- sort / filter sheets (layered inside the Add products modal) ----
  function lkSortSheetHtml() {
    var opts = LK_SORTS.map(function (s, i) {
      var on = state.lookup.sort === s.k;
      return '<button class="ext-sortopt' + (on ? " is-on" : "") + (i === 0 ? " ext-sortopt--wide" : "") + '" data-lksort="' + s.k + '">' +
        (on ? icon("check", 16) : "") + esc(s.label) + '</button>';
    }).join("");
    return '<div class="ext-lksheet ext-lksheet--sort" role="dialog" aria-modal="true" aria-label="Sort products">' +
      '<div class="ext-lksheet__head"><h3>Sort by</h3>' +
        '<button class="ext-drawer__close" data-lksheetclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-sortgrid">' + opts + '</div>' +
    '</div>';
  }
  function lkFilterOptions(groupKey) {
    var g = LK_FILTERS.find(function (x) { return x.k === groupKey; });
    if (g.opts) return g.opts;
    var field = groupKey === "strain" ? "strain" : groupKey;
    var seen = {};
    var base = lkShowFilter(lkScope());
    base.forEach(function (p) { var v = p[field]; if (v && v !== "—") seen[v] = (seen[v] || 0) + 1; });
    var keys = Object.keys(seen);
    if (groupKey === "strain") {
      var pref = ["Sativa", "Indica", "Hybrid", "CBD"];
      keys.sort(function (a, b) { return pref.indexOf(a) - pref.indexOf(b); });
    } else if (groupKey === "size") {
      keys.sort(function (a, b) { return (parseFloat(a) || 0) - (parseFloat(b) || 0) || a.localeCompare(b); });
    } else keys.sort();
    return keys.map(function (v) { return { k: v, label: v }; });
  }
  function lkFilterSheetHtml() {
    var d = state.lookup.draft;
    var sections = LK_FILTERS.map(function (g) {
      var opts = lkFilterOptions(g.k);
      if (!opts.length) return "";
      var open = !!state.lookup.open[g.k];
      var picked = g.multi ? d[g.k] : (d[g.k] ? [d[g.k]] : []);
      var summary = picked.length
        ? picked.map(function (k) { var o = opts.find(function (x) { return x.k === k; }); return o ? o.label : k; }).join(", ")
        : "";
      var chips = opts.map(function (o) {
        var on = picked.indexOf(o.k) !== -1;
        return '<button class="ext-fchip' + (on ? " is-on" : "") + '" data-lkfopt="' + g.k + '" data-v="' + esc(o.k) + '">' +
          (on ? icon("check", 13) : "") + esc(o.label) + '</button>';
      }).join("");
      return '<div class="ext-fsec' + (open ? " is-open" : "") + '">' +
        '<button class="ext-fsec__head" data-lkfsec="' + g.k + '">' +
          '<span class="ext-fsec__label">' + esc(g.label) + '</span>' +
          (summary ? '<span class="ext-fsec__sum">' + esc(summary) + '</span>' : '') +
          '<span class="ext-fsec__chev">' + icon("chevronDown", 18) + '</span>' +
        '</button>' +
        (open ? '<div class="ext-fsec__chips">' + chips + '</div>' : '') +
      '</div>';
    }).join("");
    var n = lkResults(d).length;
    return '<div class="ext-lksheet ext-lksheet--filter" role="dialog" aria-modal="true" aria-label="Filter products">' +
      '<div class="ext-lksheet__head"><h3>Filters' + (lkFilterCount(d) ? ' <span class="ext-lk__fcount">' + lkFilterCount(d) + '</span>' : '') + '</h3>' +
        '<button class="ext-drawer__close" data-lksheetclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-lksheet__body">' + sections + '</div>' +
      '<div class="ext-lksheet__foot">' +
        '<button class="ext-btn ext-lksheet__clear" data-lkfclear>Clear all</button>' +
        '<button class="ext-btn ext-btn--primary ext-lksheet__show" data-lkfapply' + (n ? "" : " disabled") + '>' +
          (n ? 'Show ' + n + ' product' + (n === 1 ? "" : "s") : 'No matching products') + '</button>' +
      '</div>' +
    '</div>';
  }
  function lkSheetHtml() {
    if (!state.lookup.sheet) return "";
    return '<div class="ext-lksheet__bg" data-lksheetbg>' +
      (state.lookup.sheet === "sort" ? lkSortSheetHtml() : lkFilterSheetHtml()) +
    '</div>';
  }
  function lookupOrderListHtml() {
    if (!MED.items.length) return '<div class="ext-lk__ordernone">Nothing in the order yet.</div>';
    return MED.items.map(function (it) {
      return '<div class="ext-lk__orow">' +
        '<div class="ext-lk__orow-main">' +
          '<div class="ext-lk__orow-name">' + esc(it.name) + '</div>' +
          '<div class="ext-lk__orow-qty">Qty ' + it.qty + '</div>' +
        '</div>' +
        '<div class="ext-lk__orow-price">' + money(it.unit * it.qty) + '</div>' +
      '</div>';
    }).join("");
  }
  function lookupHtml() {
    var showBtns = LK_SHOW.map(function (s) {
      return '<button class="ext-lk__show' + (state.lookup.show === s ? " is-on" : "") + '" data-lkshow="' + esc(s) + '">' + esc(s) + '</button>';
    }).join("");
    return '<div class="ext-modal ext-lookup" role="dialog" aria-modal="true" aria-label="Add products">' +
      '<div class="ext-lk__head">' +
        '<div class="ext-lk__title">Add products</div>' +
        '<div class="ext-lk__search">' +
          '<span class="ext-lk__search-ic">' + icon("search", 18) + '</span>' +
          '<input id="lkSearch" type="text" placeholder="Search: type MF, 3.5 or a number…" value="' + esc(state.lookup.q) + '" autocomplete="off">' +
          '<button class="ext-lk__scan" data-lkscan aria-label="Scan barcode">' + icon("scan", 18) + '</button>' +
        '</div>' +
        '<button class="ext-lk__classic" data-classic aria-label="Classic view" title="Classic view">' + icon("refreshCcw", 16) + 'Classic view</button>' +
        '<button class="ext-lk__done" data-ovclose>Done</button>' +
      '</div>' +
      '<div class="ext-lk__filters" id="lkFilters">' + lkToolbarHtml(showBtns) + '</div>' +
      '<div class="ext-lk__main">' +
        '<div class="ext-lk__content" id="lkContent">' + lookupContentHtml() + '</div>' +
        '<aside class="ext-lk__order">' +
          '<div class="ext-lk__order-head">In this order <span class="ext-lk__order-count" id="lkCount">' + MED.items.length + '</span></div>' +
          '<div class="ext-lk__order-list" id="lkOrderList">' + lookupOrderListHtml() + '</div>' +
        '</aside>' +
      '</div>' +
      '<div class="ext-lk__foot">' +
        '<span class="ext-lk__hint">Can\'t find it? Type part of a code in the search bar (e.g. FL for Flower), or tap a category and narrow by brand or size.</span>' +
        '<span class="ext-lk__due">Amount due <b id="lkDue">' + money(calc().due) + '</b></span>' +
      '</div>' +
      lkSheetHtml() +
    '</div>';
  }
  function lkToolbarHtml(showBtns) {
    return '<span class="ext-lk__show-label">SHOW</span>' + showBtns;
  }
  function lkToolsHtml() {
    var sortLabel = (LK_SORTS.find(function (s) { return s.k === state.lookup.sort; }) || LK_SORTS[0]).label;
    var nf = lkFilterCount(state.lookup.filters);
    return '<span class="ext-lk__tools">' +
      '<button class="ext-lk__tool' + (state.lookup.sort !== "popular" ? " is-set" : "") + '" data-lksheet="sort" aria-label="Sort: ' + esc(sortLabel) + '" title="Sort: ' + esc(sortLabel) + '">' +
        icon("sort", 18) + '</button>' +
      '<button class="ext-lk__tool' + (nf ? " is-set" : "") + '" data-lksheet="filter" aria-label="Filter" title="Filter">' +
        icon("filter", 17) + (nf ? '<span class="ext-lk__tool-badge">' + nf + '</span>' : '') + '</button>' +
    '</span>';
  }
  function addProduct(prodId) {
    var p = PRODUCTS.find(function (x) { return x.id === prodId; });
    if (!p) return;
    var existing = MED.items.find(function (x) { return x.prodId === prodId; });
    if (existing) { existing.qty += 1; }
    else {
      MED.items.push({
        id: "L" + Date.now(), prodId: prodId,
        brand: p.brand, name: p.name + (p.size ? " " + p.size : ""),
        route: ROUTE_BY_CAT[p.cat] || "—", usage: p.size || "—", strain: p.strain || "",
        subcat: p.subcat || "", size: p.size || "",
        status: "notverified", batch: p.batch, qty: 1, unit: p.price, discount: null
      });
    }
    toast("Added " + p.name);
  }
  // refresh only the live regions of the lookup modal (keeps the search field focused)
  function refreshLookup() {
    var c = document.getElementById("lkContent"); if (c) c.innerHTML = lookupContentHtml();
    var o = document.getElementById("lkOrderList"); if (o) o.innerHTML = lookupOrderListHtml();
    var cnt = document.getElementById("lkCount"); if (cnt) cnt.textContent = MED.items.length;
    var due = document.getElementById("lkDue"); if (due) due.textContent = money(calc().due);
  }

  // ---- order type picker modal ----
  function orderTypeHtml() {
    var tiles = ORDER_TYPES.map(function (ot) {
      return '<button class="ext-ottile' + (MED.order.type === ot ? " is-on" : "") + '" data-settype="' + esc(ot) + '">' +
        '<span class="ext-ottile__ic">' + icon(ORDER_TYPE_ICON[ot] || "user", 26) + '</span>' +
        '<span class="ext-ottile__label">' + esc(ot) + '</span>' +
        (MED.order.type === ot ? '<span class="ext-ottile__check">' + icon("check", 15) + '</span>' : '') +
      '</button>';
    }).join("");
    return '<div class="ext-modal ext-ordertype-modal" role="dialog" aria-modal="true" aria-label="Order type">' +
      '<div class="ext-pay__head"><div class="ext-pay__title">Order Type</div>' +
        '<button class="ext-pay__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-ottiles">' + tiles + '</div>' +
    '</div>';
  }

  // ---- order settings modal (actions + toggles) ----
  function orderSettingRowsHtml() {
    return ORDER_SETTINGS.map(function (s) {
      var on = !!state.settings[s.k];
      return '<div class="ext-enrow">' +
        '<div class="ext-enrow__txt"><div class="ext-enrow__label">' + esc(s.label) + '</div>' +
          '<div class="ext-enrow__desc">' + esc(s.desc) + '</div></div>' +
        '<button class="ext-switch ' + (on ? "is-on" : "") + '" data-osetting="' + s.k + '" role="switch" aria-checked="' + on + '" aria-label="' + esc(s.label) + '"><span class="ext-switch__dot"></span></button>' +
      '</div>';
    }).join("");
  }
  function orderActionsHtml() {
    var head = '<div class="ext-pay__head"><div class="ext-pay__title">' + (state.voidConfirm ? "Void this order?" : "Order Settings") + '</div>' +
      '<button class="ext-pay__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>';
    if (state.voidConfirm) {
      return '<div class="ext-modal ext-ordertype-modal" role="dialog" aria-modal="true" aria-label="Void order">' + head +
        '<div class="ext-voidconfirm">' +
          '<p>Order #' + esc(MED.order.number) + ' will be voided. All items, discounts and payments on it will be removed. This can\'t be undone.</p>' +
          '<div class="ext-voidconfirm__btns">' +
            '<button class="ext-btn" data-voidcancel>Cancel</button>' +
            '<button class="ext-btn ext-btn--danger" data-voidorder>' + icon("circleX", 16) + 'Void order</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
    var tile = function (k, ic, label, cls, disabled) {
      return '<button class="ext-ottile' + (cls ? " " + cls : "") + '" data-oaction="' + k + '"' + (disabled ? " disabled" : "") + '>' +
        '<span class="ext-ottile__ic">' + icon(ic, 26) + '</span>' +
        '<span class="ext-ottile__label">' + label + '</span>' +
      '</button>';
    };
    return '<div class="ext-modal ext-osettings" role="dialog" aria-modal="true" aria-label="Order settings">' + head +
      '<div class="ext-ottiles">' +
        tile("void", "circleX", isVoided() ? "Order Voided" : "Void Order", "ext-ottile--danger", isVoided()) +
        tile("screen", "monitorSmartphone", "Open Customer Screen") +
      '</div>' +
      '<div class="ext-osettings__body">' + orderSettingRowsHtml() + '</div>' +
    '</div>';
  }
  function voidOrder() {
    MED.items = [];
    MED.adjustments = [];
    MED.payments = [];
    MED.order.status = "Voided";
    state.voidConfirm = false;
    closeOverlay();
    render();
    toast("Order #" + MED.order.number + " voided");
  }
  function issueStoreCredit() {
    var t = calc();
    if (t.total <= 0) { toast("Nothing to credit"); return; }
    MED.patient.credits = round2(MED.patient.credits + t.total);
    state.creditIssued = t.total;
    MED.order.status = "Complete";
    render();
    toast("Issued " + money(t.total) + " store credit to " + MED.patient.name);
  }

  // ---- customer notes modal ----
  function notesHtml() {
    var p = MED.patient;
    var notes = p.notes || [];
    var list = notes.length
      ? notes.map(function (n) {
          return '<div class="ext-note">' +
            '<div class="ext-note__meta"><span class="ext-note__author">' + esc(n.author) + '</span>' +
              '<span class="ext-note__time">' + esc(n.time) + '</span></div>' +
            '<div class="ext-note__text">' + esc(n.text) + '</div>' +
          '</div>';
        }).join("")
      : '<div class="ext-note__empty">No notes yet for this patient.</div>';
    return '<div class="ext-modal ext-notes" role="dialog" aria-modal="true" aria-label="Customer notes">' +
      '<div class="ext-pay__head"><div class="ext-pay__title">Notes <span class="ext-notes__count">' + notes.length + '</span></div>' +
        '<button class="ext-pay__close" data-ovclose aria-label="Close">' + icon("x", 20) + '</button></div>' +
      '<div class="ext-notes__list">' + list + '</div>' +
      '<div class="ext-notes__compose">' +
        '<textarea id="noteInput" class="ext-textarea" placeholder="Add a note for ' + esc(p.name) + '…" rows="3"></textarea>' +
        '<button class="ext-btn ext-btn--primary ext-btn--block" id="noteAdd">' + icon("plus", 16) + 'Add note</button>' +
      '</div>' +
    '</div>';
  }

  // ======================================================
  // INTERACTIONS
  // ======================================================
  var toastTimer;
  function toast(msg) {
    var el = $("#extToast");
    el.innerHTML = icon("check", 16) + "<span>" + esc(msg) + "</span>";
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-on"); }, 2200);
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var el;

      // ----- chrome -----
      if (e.target.closest("#btnClassic")) { openClassic(); return; }
      if (e.target.closest("#btnMenu")) { state.overlay = "menu"; renderOverlay(); return; }
      if (e.target.closest("#btnLogout")) { toast("Signing out " + STORE.user + "…"); setTimeout(function () { window.location.reload(); }, 750); return; }

      // ----- overlay controls -----
      if (e.target === $("#extOverlay")) { closeOverlay(); return; }
      if (e.target.closest("[data-ovclose]")) { closeOverlay(); return; }

      if ((el = e.target.closest("[data-nav]"))) {
        var navId = el.getAttribute("data-nav");
        var navItem = SIDE_NAV.filter(function (n) { return n.id === navId; })[0];
        if (el.getAttribute("data-soon") || (navItem && navItem.soon)) {
          toast("Waitlist — coming soon");
          return;
        }
        closeOverlay();
        toast(navItem ? navItem.label : navId);
        return;
      }

      if ((el = e.target.closest("[data-paytab]"))) {
        state.payMethod = el.getAttribute("data-paytab");
        state.payBuffer = "";
        renderOverlay();
        return;
      }
      if ((el = e.target.closest("[data-preset]"))) {
        var t = calc();
        var pk = el.getAttribute("data-preset");
        state.payBuffer = pk === "exact" ? t.due.toFixed(2) : pk;
        renderOverlay();
        return;
      }
      if ((el = e.target.closest("[data-key]"))) {
        editBuffer(el.getAttribute("data-key"));
        renderOverlay();
        return;
      }
      if (e.target.closest("#payApply")) { applyPayment(); return; }
      if ((el = e.target.closest("[data-reward]"))) { toggleReward(parseInt(el.getAttribute("data-reward"), 10)); return; }
      if ((el = e.target.closest("[data-donpreset]"))) {
        state.payBuffer = String(el.getAttribute("data-donpreset"));
        renderOverlay();
        return;
      }
      if (e.target.closest("#donApply")) { applyDonation(); return; }
      if (e.target.closest("[data-donremove]")) { removeDonation(); return; }
      if (e.target.closest("#payFinish")) {
        if (calc().due > 0) return;
        MED.order.status = "Complete";
        closeOverlay();
        render();
        toast("Sale complete");
        return;
      }
      if ((el = e.target.closest("[data-voidpay]"))) {
        MED.payments.splice(parseInt(el.getAttribute("data-voidpay"), 10), 1);
        render(); renderOverlay(); toast("Payment voided");
        return;
      }

      // ----- open overlays -----
      if ((el = e.target.closest("[data-open]"))) {
        var which = el.getAttribute("data-open");
        if (which === "lookup") { state.overlay = "lookup"; renderOverlay(); }
        else if (which === "allot") { state.overlay = "allot"; renderOverlay(); }
        else if (which === "disc") { state.overlay = "disc"; renderOverlay(); }
        else if (which === "mgr") {
          state.mgr.step = "auth";
          state.mgr.pin = "";
          state.mgr.preset = null;
          state.mgr.custom = "";
          if (!state.mgr.user) state.mgr.user = STORE.user;
          state.overlay = "mgr";
          renderOverlay();
        }
        else if (which === "enroll") { state.overlay = "enroll"; renderOverlay(); }
        else if (which === "notes") { state.overlay = "notes"; renderOverlay(); }
        else if (which === "ordertype") { state.overlay = "ordertype"; renderOverlay(); }
        else if (which === "actions") { state.voidConfirm = false; state.overlay = "actions"; renderOverlay(); }
        return;
      }
      if ((el = e.target.closest("[data-osetting]"))) {
        var sk2 = el.getAttribute("data-osetting");
        state.settings[sk2] = !state.settings[sk2];
        render(); renderOverlay();
        var sdef = ORDER_SETTINGS.filter(function (s) { return s.k === sk2; })[0];
        toast(sdef.label + (state.settings[sk2] ? " on" : " off"));
        return;
      }
      if ((el = e.target.closest("[data-oaction]"))) {
        var act = el.getAttribute("data-oaction");
        if (act === "void") { state.voidConfirm = true; renderOverlay(); }
        else { closeOverlay(); toast("Customer screen opened"); }
        return;
      }
      if (e.target.closest("[data-voidcancel]")) { state.voidConfirm = false; renderOverlay(); return; }
      if (e.target.closest("[data-voidorder]")) { voidOrder(); return; }
      if (e.target.closest("#issueCreditBtn")) { issueStoreCredit(); return; }
      if ((el = e.target.closest("[data-settype]"))) {
        MED.order.type = el.getAttribute("data-settype");
        closeOverlay();
        render();
        toast("Order type: " + MED.order.type);
        return;
      }

      // ----- discounts drawer + manager override + rewards/donation -----
      if ((el = e.target.closest("[data-stdidx]"))) {
        state.disc.stdIdx = el.getAttribute("data-stdidx"); renderOverlay(); return;
      }
      if (e.target.closest("[data-mgrauth]")) { authorizeMgr(); return; }
      if ((el = e.target.closest("[data-mgrmode]"))) {
        var mc = $("#mgrCustom"); if (mc) state.mgr.custom = mc.value;
        state.mgr.mode = el.getAttribute("data-mgrmode");
        state.mgr.preset = null;
        renderOverlay(); return;
      }
      if ((el = e.target.closest("[data-mgrpreset]"))) {
        var mc2 = $("#mgrCustom"); if (mc2) state.mgr.custom = mc2.value;
        state.mgr.preset = el.getAttribute("data-mgrpreset");
        renderOverlay(); return;
      }
      if (e.target.closest("[data-mgrapply]")) { applyMgrDiscount(); return; }
      if ((el = e.target.closest("[data-discapply]"))) { applyDiscount(el.getAttribute("data-discapply")); return; }
      if ((el = e.target.closest("[data-deladj]"))) {
        var rid = el.getAttribute("data-deladj");
        MED.adjustments = MED.adjustments.filter(function (a) { return a.id !== rid; });
        render(); renderOverlay(); toast("Removed");
        return;
      }

      if (e.target.closest("#tenderBtn")) { openPay(); return; }

      // ----- add-products (lookup) modal -----
      if (e.target.closest("[data-classic]")) { openClassic(); return; }
      if ((el = e.target.closest("[data-lkshow]"))) {
        state.lookup.show = el.getAttribute("data-lkshow"); renderOverlay(); return;
      }
      // sort / filter sheets
      if ((el = e.target.closest("[data-lksheet]"))) {
        state.lookup.sheet = el.getAttribute("data-lksheet");
        if (state.lookup.sheet === "filter") state.lookup.draft = JSON.parse(JSON.stringify(state.lookup.filters));
        renderOverlay(); return;
      }
      if (e.target.closest("[data-lksheetclose]") || (e.target.hasAttribute && e.target.hasAttribute("data-lksheetbg"))) {
        state.lookup.sheet = null; state.lookup.draft = null; renderOverlay(); return;
      }
      if ((el = e.target.closest("[data-lksort]"))) {
        state.lookup.sort = el.getAttribute("data-lksort");
        state.lookup.sheet = null;
        renderOverlay(); return;
      }
      if ((el = e.target.closest("[data-lkfsec]"))) {
        var sk = el.getAttribute("data-lkfsec");
        state.lookup.open[sk] = !state.lookup.open[sk];
        renderOverlay(); return;
      }
      if ((el = e.target.closest("[data-lkfopt]"))) {
        var gk = el.getAttribute("data-lkfopt"), gv = el.getAttribute("data-v");
        var grp = LK_FILTERS.find(function (x) { return x.k === gk; });
        var dr = state.lookup.draft;
        if (grp.multi) {
          var at = dr[gk].indexOf(gv);
          if (at === -1) dr[gk].push(gv); else dr[gk].splice(at, 1);
        } else {
          dr[gk] = dr[gk] === gv ? "" : gv;
        }
        renderOverlay(); return;
      }
      if (e.target.closest("[data-lkfclear]")) { state.lookup.draft = emptyLkFilters(); renderOverlay(); return; }
      if (e.target.closest("[data-lkfapply]")) {
        state.lookup.filters = state.lookup.draft;
        state.lookup.draft = null; state.lookup.sheet = null;
        renderOverlay(); return;
      }
      if (e.target.closest("[data-lkclearfilters]")) { state.lookup.filters = emptyLkFilters(); renderOverlay(); return; }
      if ((el = e.target.closest("[data-lksub]"))) {
        state.lookup.sub = el.getAttribute("data-lksub") || null;
        renderOverlay(); return;
      }
      if (e.target.closest("[data-lkclearsub]")) { state.lookup.sub = null; renderOverlay(); return; }

      if ((el = e.target.closest("[data-lkcat]"))) {
        var lbl = el.getAttribute("data-lkcat");
        var cat = LK_CATEGORIES.find(function (x) { return x.label === lbl; });
        state.lookup.q = "";
        state.lookup.sub = null;
        if (cat && cat.suggest) { state.lookup.suggest = true; state.lookup.cat = null; }
        else { state.lookup.suggest = false; state.lookup.cat = lbl; }
        renderOverlay(); return;
      }
      if (e.target.closest("[data-lkback]")) {
        state.lookup.q = ""; state.lookup.cat = null; state.lookup.sub = null; state.lookup.suggest = false;
        state.lookup.filters = emptyLkFilters();
        renderOverlay(); return;
      }
      if (e.target.closest("[data-lkclearq]")) { state.lookup.q = ""; renderOverlay(); return; }
      if (e.target.closest("[data-lkclearcat]")) { state.lookup.cat = null; state.lookup.sub = null; state.lookup.suggest = false; renderOverlay(); return; }
      if (e.target.closest("[data-lkscan]")) { toast("Point the scanner at a barcode (demo)"); return; }
      if ((el = e.target.closest("[data-add]"))) {
        addProduct(el.getAttribute("data-add"));
        render();          // keep the cart behind the modal in sync
        refreshLookup();   // update results (in-order badges) + order panel
        return;
      }

      // ----- notes modal -----
      if (e.target.closest("#noteAdd")) {
        var ta = $("#noteInput");
        var txt = ta ? (ta.value || "").trim() : "";
        if (!txt) { toast("Enter a note"); return; }
        if (!MED.patient.notes) MED.patient.notes = [];
        var now = new Date();
        var stamp = now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) +
          " · " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        MED.patient.notes.unshift({ author: STORE.user, time: stamp, text: txt });
        renderOverlay();
        renderCust();
        toast("Note added");
        return;
      }

      // ----- cart interactions -----
      if ((el = e.target.closest("[data-qty]"))) {
        var id = el.getAttribute("data-id");
        var it = MED.items.find(function (x) { return x.id === id; });
        if (it) {
          it.qty += (el.getAttribute("data-qty") === "inc" ? 1 : -1);
          if (it.qty < 1) MED.items = MED.items.filter(function (x) { return x.id !== id; });
          render();
        }
        return;
      }
      if ((el = e.target.closest("[data-remove]"))) {
        var rid = el.getAttribute("data-remove");
        MED.items = MED.items.filter(function (x) { return x.id !== rid; });
        render(); toast("Item removed");
        return;
      }
      if ((el = e.target.closest("[data-suggest]"))) {
        var s = MED.suggested[parseInt(el.getAttribute("data-suggest"), 10)];
        MED.items.push({
          id: "L" + Date.now(), brand: s.brand, name: s.name,
          route: s.route, usage: s.usage, strain: s.strain, batch: s.batch,
          qty: 1, unit: s.price, discount: null
        });
        render(); toast("Added " + s.name);
        return;
      }
      if ((el = e.target.closest("[data-enroll]"))) {
        var k = el.getAttribute("data-enroll");
        MED.patient.enroll[k] = !MED.patient.enroll[k];
        if (state.overlay === "enroll") renderOverlay();
        toast((MED.patient.enroll[k] ? "Enrolled in " : "Removed ") + k);
        return;
      }
      if ((el = e.target.closest("[data-receipt]"))) {
        if (el.getAttribute("data-receipt") === "email") toast("Receipt emailed to " + MED.patient.email);
        else toast("Sent to printer (demo)");
        return;
      }
    });

    document.addEventListener("input", function (e) {
      if (e.target.id === "lkSearch") { state.lookup.q = e.target.value; refreshLookup(); }
      else if (e.target.id === "discCoupon") { state.disc.coupon = e.target.value; }
      else if (e.target.id === "mgrUser") { state.mgr.user = e.target.value; }
      else if (e.target.id === "mgrPin") { state.mgr.pin = e.target.value; }
      else if (e.target.id === "mgrCustom") { state.mgr.custom = e.target.value; }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.overlay === "lookup" && state.lookup.sheet) {
        state.lookup.sheet = null; state.lookup.draft = null; renderOverlay(); return;
      }
      if (e.key === "Escape" && state.overlay) { closeOverlay(); return; }
      if (state.overlay === "mgr" && e.key === "Enter") {
        if (state.mgr.step === "apply") applyMgrDiscount();
        else authorizeMgr();
        return;
      }
      // keypad support while the tender page is open (tenders + donation amount)
      if (state.overlay === "pay" && state.payMethod !== "Rewards") {
        if (/^[0-9]$/.test(e.key)) { editBuffer(e.key); renderOverlay(); }
        else if (e.key === ".") { editBuffer("."); renderOverlay(); }
        else if (e.key === "Backspace") { editBuffer("back"); renderOverlay(); }
        else if (e.key === "Enter") { if (state.payMethod === "Donation") applyDonation(); else applyPayment(); }
      }
    });
  }

  function init() { render(); bind(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
