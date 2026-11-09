# Changelog

The version shown at the bottom of the side menu comes from `APP_VERSION` in
`extension/extension.js`. Bump it and add an entry here whenever a change is shared.

- **Patch** (0.1.0 → 0.1.1): fixes and small visual tweaks
- **Minor** (0.1.0 → 0.2.0): new features or screens
- **Major** (0.x → 1.0.0): first production-ready release

## 0.1.1 — 2026-11-08

- Load the Inter font so text looks the same on every device (it previously used
  each device's system font)
- Windows smaller than 1024×768 now show the whole app scaled down instead of
  squeezing pop-ups or stacking the right panel below the cart

## 0.1.0 — 2026-11-08

First shared iteration of the OMS+ Med Sale cart (iPad 1024×768).

- Med Sale cart with customer header, item overview, allotment and order rail
- Order types: Walk-in, Pickup, Curbside, Delivery, Return, Delivery Return
- Returns issue store credit directly from the rail
- Order Settings pop-up: void order, open customer screen, manual dispensation,
  caregiver pickup, rounding
- Tender Payment pop-up with Cash, CanPay, Store Credit, Rewards and Donation tiles
- Add Products pop-up with categories, subcategories, sort and filter
- Discounts drawer with manager authorization
- Email receipt option on completed orders
