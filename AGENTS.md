# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-28**
**Branch:** master

## OVERVIEW

Vite-based admin dashboard project using Tabler UI framework. iframe-based SPA architecture with dynamic menu loading from backend API, theming support, and common utility library.

Core stack: Vite 6, Tabler CSS/JS, Axios, Mustache-style templating.

## STRUCTURE

```
nodejs-learning/
├── src/                 # Source code: main.js (Vite entry) + ip-whitelist.js
├── public/               # Static assets served as-is (admin dashboard lives here)
│   ├── tabler/           # Admin dashboard HTML pages & assets (iframe SPA)
│   ├── js/common/        # Utility library (Common.* namespace)
│   ├── js/biz/           # Business-specific JS (fileCommon.js, 2453 lines)
│   ├── libs/             # 3rd party libs (tinymce, apexcharts, plyr)
│   ├── css/              # Custom styles + Tabler/Bootstrap CSS
│   ├── static/           # Static assets (docs, icons, images)
│   └── img/              # Image assets
├── server.js            # Production HTTP server (IP whitelist, static serving)
├── dist/                 # Build output
├── index.html           # Welcome page entry point
├── vite.config.js       # Vite configuration
└── package.json
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new page | public/tabler/ | Create HTML, add menu API |
| Edit global styles | src/main.js | Tabler CSS imports |
| Add utility function | public/js/common/common.js | Common global functions |
| Menu system | public/js/common/index.js | menu_build, load_menu, load_menu_base |
| Theme configuration | index.html | Theme builder offcanvas |
| Vite build config | vite.config.js | Output, aliases |
| API endpoint | .env | VITE_API_URL |
| Production server | server.js | IP whitelist, static serving |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| menu_build | function | public/js/common/index.js | Attach click handlers for target-link |
| load_menu | function | public/js/common/index.js | Load full menu tree from API |
| load_menu_base | function | public/js/common/index.js | Load base navigation |
| Common | object | public/js/common/common.js | Global utility library |
| Common.formSetData | function | public/js/common/common.js | Populate form with data |
| Common.getFormData | function | public/js/common/common.js | Extract form data |
| Common.createTemplate | function | public/js/common/common.js | Template engine |
| Common.alertSuccess | function | public/js/common/common.js | Success modal |
| Common.alertDanger | function | public/js/common/common.js | Danger modal |

## CONVENTIONS

- Use `target-link` attribute for menu items → loads page into iframe
- Use `layout-link` attribute for layout switches
- API endpoints: `/api/rest/v1/menu/tree` and `/api/rest/v1/menu/tree/base`
- Form elements accessed by ID, checkboxes return "1"/"0"
- Template syntax: `{variable}` for Mustache-style
- Number of decimal places: 2 (configurable via Common.NumberOfDecimal

## ANTI-PATTERNS

- ❌ Do not hardcode API_URL in multiple files → use .env VITE_API_URL
- ❌ Do not modify files in dist/ → built output
- ❌ Do not modify public/libs/ vendor files
- ❌ Do not use absolute URLs in production console.log statements → debug code
- ❌ Do not use jQuery → use template-id for templates/index/ pages
- ❌ Do not modify public/tabler/ vendor files (Tabler framework assets)
- ❌ Do not modify src/main.js for menu logic → use public/js/common/index.js

## UNIQUE STYLES

- iframe-based SPA (no router, no client-side routing library
- Dynamic menu chunks splitting into dropdown columns
- Theme builder with 12 colors, 4 modes, 4 fonts
- Tabler inline SVG icons directly in HTML
- Offcanvas settings panel

## COMMANDS

```bash
npm run dev      # Start dev server (port 4000)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## NOTES

- Default API endpoint: http://192.168.10.63:8080
- Dev server port: 4000
- Main iframe ID: index-main-iframe
- Base nav container: base-nav
- Modal templates use modal-success-context, modal-danger-context
- Production server: node server.js (serves dist/, IP whitelist via src/ip-whitelist.js)
- Menu functions (menu_build/load_menu/load_menu_base) are in public/js/common/index.js
