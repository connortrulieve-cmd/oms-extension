# OMS+ Med Sale Cart — Extension Prototype

A clickable, touch-first prototype of the OMS+ cannabis dispensary Med Sale cart,
designed for an iPad in landscape (1024×768). Plain HTML, CSS and JavaScript with
mock data; no build step and no backend.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000/extension/cart.html
```

## Files

| Path | Purpose |
| --- | --- |
| `extension/cart.html` | Page shell |
| `extension/extension.js` | Cart logic, pop-ups and demo data |
| `extension/extension.css` | Styles and design tokens |
| `js/icons.js` | Lucide-based icon set |
| `js/data.js` | Mock product catalog |

## Releasing a change

1. Bump `APP_VERSION` at the top of `extension/extension.js` (it shows at the bottom of the side menu).
2. Add an entry to `CHANGELOG.md`.
3. Bump the `?v=` numbers in `extension/cart.html` for any CSS/JS file you changed, so browsers load the new copy.
4. Commit and push to `main`; the site redeploys automatically in about a minute.
